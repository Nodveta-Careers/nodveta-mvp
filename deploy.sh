#!/bin/bash

# NodeMeta MVP - Production Deployment Script
# Automated deployment with health checks and rollback capability

set -e  # Exit on any error

# Configuration
PROJECT_NAME="nodemeta-mvp"
DOCKER_COMPOSE_FILE="docker-compose.yml"
BACKUP_DIR="./backups"
LOG_FILE="./logs/deploy-$(date +%Y%m%d_%H%M%S).log"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Logging function
log() {
    echo -e "${BLUE}[$(date '+%Y-%m-%d %H:%M:%S')]${NC} $1" | tee -a "$LOG_FILE"
}

error() {
    echo -e "${RED}[ERROR]${NC} $1" | tee -a "$LOG_FILE"
}

success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1" | tee -a "$LOG_FILE"
}

warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1" | tee -a "$LOG_FILE"
}

# Create necessary directories
mkdir -p logs backups docker/ssl

# Check prerequisites
check_prerequisites() {
    log "Checking prerequisites..."
    
    if ! command -v docker &> /dev/null; then
        error "Docker is not installed or not in PATH"
        exit 1
    fi
    
    if ! command -v docker-compose &> /dev/null && ! docker compose version &> /dev/null; then
        error "Docker Compose is not installed"
        exit 1
    fi
    
    if ! docker info &> /dev/null; then
        error "Docker daemon is not running"
        exit 1
    fi
    
    success "Prerequisites check passed"
}

# Create environment file if it doesn't exist
setup_environment() {
    log "Setting up environment configuration..."
    
    if [ ! -f .env.local ]; then
        if [ -f .env.production ]; then
            cp .env.production .env.local
            log "Created .env.local from .env.production template"
        else
            error ".env.production template not found"
            exit 1
        fi
    fi
    
    # Validate required environment variables
    if ! grep -q "MONGODB_URI" .env.local; then
        error "MONGODB_URI not found in .env.local"
        exit 1
    fi
    
    success "Environment configuration ready"
}

# Backup current deployment
backup_deployment() {
    log "Creating backup of current deployment..."
    
    local backup_name="backup-$(date +%Y%m%d_%H%M%S)"
    local backup_path="$BACKUP_DIR/$backup_name"
    
    mkdir -p "$backup_path"
    
    # Backup database
    if docker ps | grep -q "nodemeta-mongo"; then
        log "Backing up MongoDB database..."
        docker exec nodemeta-mongo mongodump --out /tmp/backup
        docker cp nodemeta-mongo:/tmp/backup "$backup_path/mongodb"
        success "Database backup completed"
    else
        warning "MongoDB container not found, skipping database backup"
    fi
    
    # Backup volumes
    docker run --rm -v nodemeta-mongo-data:/data -v "$PWD/$backup_path":/backup alpine \
        tar czf /backup/mongo-data.tar.gz -C /data .
    
    echo "$backup_name" > "$BACKUP_DIR/latest"
    success "Backup completed: $backup_name"
}

# Build Docker images
build_images() {
    log "Building Docker images..."
    
    # Build with BuildKit for better performance
    export DOCKER_BUILDKIT=1
    
    docker build -t "$PROJECT_NAME:latest" .
    
    # Tag with timestamp for rollback capability
    local image_tag="$PROJECT_NAME:$(date +%Y%m%d_%H%M%S)"
    docker tag "$PROJECT_NAME:latest" "$image_tag"
    
    success "Docker images built successfully"
}

# Deploy application
deploy_application() {
    log "Deploying NodeMeta application..."
    
    # Stop existing containers gracefully
    if docker-compose ps | grep -q "Up"; then
        log "Stopping existing containers..."
        docker-compose down --timeout 30
    fi
    
    # Start new deployment
    log "Starting new deployment..."
    docker-compose up -d --build
    
    success "Application deployed"
}

# Health check
health_check() {
    log "Performing health checks..."
    
    local max_attempts=30
    local attempt=0
    
    while [ $attempt -lt $max_attempts ]; do
        attempt=$((attempt + 1))
        log "Health check attempt $attempt/$max_attempts"
        
        # Check if containers are running
        if ! docker-compose ps | grep -q "Up"; then
            warning "Containers not yet running, waiting..."
            sleep 10
            continue
        fi
        
        # Check application health
        if curl -f http://localhost/health > /dev/null 2>&1; then
            success "Health check passed!"
            return 0
        fi
        
        if [ $attempt -eq $max_attempts ]; then
            error "Health check failed after $max_attempts attempts"
            return 1
        fi
        
        sleep 10
    done
}

# Rollback deployment
rollback_deployment() {
    error "Deployment failed, initiating rollback..."
    
    # Stop failed deployment
    docker-compose down --timeout 30
    
    # Restore from latest backup
    if [ -f "$BACKUP_DIR/latest" ]; then
        local latest_backup=$(cat "$BACKUP_DIR/latest")
        local backup_path="$BACKUP_DIR/$latest_backup"
        
        log "Restoring from backup: $latest_backup"
        
        # Restore database if backup exists
        if [ -d "$backup_path/mongodb" ]; then
            docker-compose up -d mongo
            sleep 10
            docker cp "$backup_path/mongodb" nodemeta-mongo:/tmp/restore
            docker exec nodemeta-mongo mongorestore /tmp/restore
        fi
        
        # Restore volumes
        if [ -f "$backup_path/mongo-data.tar.gz" ]; then
            docker run --rm -v nodemeta-mongo-data:/data -v "$PWD/$backup_path":/backup alpine \
                tar xzf /backup/mongo-data.tar.gz -C /data
        fi
        
        success "Rollback completed"
    else
        error "No backup found for rollback"
    fi
}

# Cleanup old images and containers
cleanup() {
    log "Cleaning up old Docker resources..."
    
    # Remove unused images (keep last 3 versions)
    docker image prune -f
    
    # Remove old backups (keep last 5)
    if [ -d "$BACKUP_DIR" ]; then
        cd "$BACKUP_DIR"
        ls -t | tail -n +6 | xargs -r rm -rf
        cd -
    fi
    
    success "Cleanup completed"
}

# Generate SSL certificates (Let's Encrypt)
setup_ssl() {
    log "Setting up SSL certificates..."
    
    if [ ! -f "docker/ssl/fullchain.pem" ]; then
        warning "SSL certificates not found. Please run the following command to generate them:"
        warning "certbot certonly --webroot -w ./docker/ssl -d node-meta.com -d www.node-meta.com"
        warning "Then copy the certificates to docker/ssl/ directory"
        
        # Create self-signed certificates for development
        log "Creating self-signed certificates for development..."
        openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
            -keyout docker/ssl/privkey.pem \
            -out docker/ssl/fullchain.pem \
            -subj "/C=US/ST=State/L=City/O=NodeMeta/CN=node-meta.com"
        
        success "Self-signed certificates created"
    else
        success "SSL certificates found"
    fi
}

# Main deployment function
main() {
    log "Starting NodeMeta MVP deployment..."
    
    # Parse command line arguments
    case "${1:-deploy}" in
        "deploy")
            check_prerequisites
            setup_environment
            setup_ssl
            backup_deployment
            build_images
            deploy_application
            
            if health_check; then
                cleanup
                success "🚀 NodeMeta deployment completed successfully!"
                log "Application is available at:"
                log "  - Frontend: http://localhost:5000"
                log "  - Backend API: http://localhost:4000"
                log "  - Monitoring: http://localhost:3001 (Grafana)"
                log "  - Metrics: http://localhost:9090 (Prometheus)"
            else
                rollback_deployment
                exit 1
            fi
            ;;
        "rollback")
            rollback_deployment
            ;;
        "backup")
            backup_deployment
            ;;
        "cleanup")
            cleanup
            ;;
        "health")
            health_check
            ;;
        *)
            echo "Usage: $0 {deploy|rollback|backup|cleanup|health}"
            echo ""
            echo "Commands:"
            echo "  deploy   - Full deployment with health checks"
            echo "  rollback - Rollback to previous version"
            echo "  backup   - Create backup only"
            echo "  cleanup  - Clean up old resources"
            echo "  health   - Run health check only"
            exit 1
            ;;
    esac
}

# Run main function with all arguments
main "$@"