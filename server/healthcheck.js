#!/usr/bin/env node

/**
 * NodeMeta Health Check Script
 * Used by Docker healthcheck to verify application status
 */

const http = require('http');
const mongoose = require('mongoose');

// Health check configuration
const HEALTH_CHECK_CONFIG = {
  timeout: 5000,
  endpoints: [
    { name: 'Frontend', url: 'http://localhost:3000/api/health', port: 3000 },
    { name: 'Backend', url: 'http://localhost:4000/api/health', port: 4000 }
  ]
};

// Check if a port is accessible
function checkPort(port) {
  return new Promise((resolve) => {
    const request = http.get(`http://localhost:${port}/api/health`, { timeout: HEALTH_CHECK_CONFIG.timeout }, (res) => {
      if (res.statusCode === 200) {
        resolve({ success: true, port });
      } else {
        resolve({ success: false, port, error: `HTTP ${res.statusCode}` });
      }
    });

    request.on('error', (error) => {
      resolve({ success: false, port, error: error.message });
    });

    request.on('timeout', () => {
      request.destroy();
      resolve({ success: false, port, error: 'Timeout' });
    });
  });
}

// Check MongoDB connection
async function checkMongoDB() {
  try {
    const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/nodemeta-mvp';
    
    // Create a new connection for health check
    const connection = mongoose.createConnection(mongoUri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 3000,
      connectTimeoutMS: 3000
    });

    // Wait for connection
    await new Promise((resolve, reject) => {
      connection.once('open', resolve);
      connection.once('error', reject);
      
      setTimeout(() => reject(new Error('MongoDB connection timeout')), 3000);
    });

    await connection.close();
    return { success: true, service: 'MongoDB' };
  } catch (error) {
    return { success: false, service: 'MongoDB', error: error.message };
  }
}

// Main health check function
async function performHealthCheck() {
  console.log('NodeMeta Health Check - Starting...');
  
  const checks = [];
  const results = {
    timestamp: new Date().toISOString(),
    status: 'healthy',
    services: {},
    details: []
  };

  // Check application ports
  for (const endpoint of HEALTH_CHECK_CONFIG.endpoints) {
    const result = await checkPort(endpoint.port);
    checks.push(result);
    results.services[endpoint.name] = result.success;
    
    if (result.success) {
      results.details.push(`✓ ${endpoint.name} (port ${endpoint.port}): OK`);
    } else {
      results.details.push(`✗ ${endpoint.name} (port ${endpoint.port}): ${result.error}`);
    }
  }

  // Check MongoDB
  const mongoResult = await checkMongoDB();
  checks.push(mongoResult);
  results.services.MongoDB = mongoResult.success;
  
  if (mongoResult.success) {
    results.details.push(`✓ MongoDB: Connected`);
  } else {
    results.details.push(`✗ MongoDB: ${mongoResult.error}`);
  }

  // Determine overall health
  const allHealthy = checks.every(check => check.success);
  results.status = allHealthy ? 'healthy' : 'unhealthy';

  // Output results
  console.log(`Health Check Status: ${results.status.toUpperCase()}`);
  console.log('Service Status:');
  results.details.forEach(detail => console.log(`  ${detail}`));

  // Exit with appropriate code
  if (allHealthy) {
    console.log('NodeMeta Health Check - PASSED');
    process.exit(0);
  } else {
    console.error('NodeMeta Health Check - FAILED');
    process.exit(1);
  }
}

// Handle uncaught errors
process.on('uncaughtException', (error) => {
  console.error('Health check failed with uncaught exception:', error.message);
  process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('Health check failed with unhandled rejection:', reason);
  process.exit(1);
});

// Run health check
performHealthCheck().catch((error) => {
  console.error('Health check failed:', error.message);
  process.exit(1);
});