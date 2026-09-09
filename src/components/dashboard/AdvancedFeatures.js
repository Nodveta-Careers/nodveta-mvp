/**
 * NodeMeta Advanced Features Dashboard
 * Comprehensive showcase of all ecosystem functionality
 */

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { Card, Typography, Button, Row, Col, Tabs, Statistic, Progress, Badge } from 'antd';
import { 
  RobotOutlined, 
  SwapOutlined, 
  ShoppingCartOutlined,
  PieChartOutlined,
  MobileOutlined,
  CloudOutlined,
  TrophyOutlined,
  FireOutlined
} from '@ant-design/icons';

// Import services
import { getAIStrategies, getMarketAnalysis } from '../../services/tradingBotService';
import { getSupportedRoutes, getCrossChainBalances } from '../../services/crossChainBridgeService';
import { getMerchantListings } from '../../services/assessment/commerceService';
import { getTokenomicsDashboard } from '../../services/tokenomicsService';

const { Title, Text } = Typography;
const { TabPane } = Tabs;

const AdvancedFeatures = ({ address }) => {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('trading');
  const [data, setData] = useState({
    trading: {},
    bridge: {},
    commerce: {},
    tokenomics: {}
  });

  useEffect(() => {
    // Set active tab from URL parameter
    if (router.query.tab) {
      setActiveTab(router.query.tab);
    }
  }, [router.query.tab]);

  useEffect(() => {
    loadAdvancedFeatures();
  }, [address]);

  const loadAdvancedFeatures = async () => {
    try {
      setLoading(true);
      
      const [
        tradingStrategies,
        marketAnalysis,
        bridgeRoutes,
        crossChainBalances,
        merchantListings,
        tokenomicsDashboard
      ] = await Promise.all([
        getAIStrategies(),
        getMarketAnalysis(address),
        getSupportedRoutes(),
        getCrossChainBalances(address || '0x0'),
        getMerchantListings(),
        getTokenomicsDashboard()
      ]);

      setData({
        trading: {
          strategies: tradingStrategies.strategies || [],
          analysis: marketAnalysis.analysis || {}
        },
        bridge: {
          routes: bridgeRoutes.routes || [],
          balances: crossChainBalances.balances || {}
        },
        commerce: {
          merchants: merchantListings.merchants || []
        },
        tokenomics: tokenomicsDashboard.dashboard || {}
      });
    } catch (error) {
      console.error('Error loading advanced features:', error);
    } finally {
      setLoading(false);
    }
  };

  const TradingBotPanel = () => (
    <div className="space-y-6">
      <Row gutter={[16, 16]}>
        <Col xs={24} sm={12} md={8}>
          <Card className="text-center hover:shadow-lg transition-all duration-300">
            <RobotOutlined className="text-4xl text-blue-500 mb-3" />
            <Statistic 
              title="Active Strategies" 
              value={data.trading.strategies?.length || 4} 
              suffix="AI Bots"
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={8}>
          <Card className="text-center hover:shadow-lg transition-all duration-300">
            <TrophyOutlined className="text-4xl text-green-500 mb-3" />
            <Statistic 
              title="Success Rate" 
              value={87} 
              suffix="%" 
              valueStyle={{ color: '#52c41a' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={8}>
          <Card className="text-center hover:shadow-lg transition-all duration-300">
            <FireOutlined className="text-4xl text-orange-500 mb-3" />
            <Statistic 
              title="24h Return" 
              value={2.8} 
              suffix="%" 
              precision={1}
              valueStyle={{ color: '#fa8c16' }}
            />
          </Card>
        </Col>
      </Row>

      <Card title="AI Trading Strategies" className="shadow-lg">
        <Row gutter={[16, 16]}>
          {data.trading.strategies?.map((strategy, index) => (
            <Col xs={24} md={12} key={strategy.id || index}>
              <Card 
                size="small" 
                className="border-l-4 border-l-blue-500 hover:shadow-md transition-shadow"
              >
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <Text strong>{strategy.name}</Text>
                    <Badge 
                      color={strategy.active ? 'green' : 'red'} 
                      text={strategy.active ? 'Active' : 'Inactive'}
                    />
                  </div>
                  <Text type="secondary" className="text-sm block">
                    {strategy.description}
                  </Text>
                  <div className="flex justify-between text-xs">
                    <span>Risk: <Text type="warning">{strategy.risk}</Text></span>
                    <span>APY: <Text type="success">{strategy.expectedReturn}</Text></span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span>Min: {strategy.minInvestment}</span>
                    <span>Time: {strategy.timeframe}</span>
                  </div>
                  {strategy.active && (
                    <Button type="primary" size="small" className="w-full mt-2">
                      Start Trading Bot
                    </Button>
                  )}
                </div>
              </Card>
            </Col>
          ))}
        </Row>
      </Card>

      <Card title="Market Analysis" className="shadow-lg">
        <Row gutter={[16, 16]}>
          <Col xs={24} md={12}>
            <div className="space-y-4">
              <div>
                <Text strong>Current Price: </Text>
                <Text className="text-lg">{data.trading.analysis?.price || '$0.024'}</Text>
                <Text type="success" className="ml-2">
                  {data.trading.analysis?.change24h || '+5.67%'}
                </Text>
              </div>
              <div>
                <Text strong>24h Volume: </Text>
                <Text>{data.trading.analysis?.volume24h || '$89,450'}</Text>
              </div>
              <div>
                <Text strong>Market Cap: </Text>
                <Text>{data.trading.analysis?.marketCap || '$2,450,000'}</Text>
              </div>
            </div>
          </Col>
          <Col xs={24} md={12}>
            <div className="space-y-2">
              <Text strong>Technical Indicators</Text>
              <div className="space-y-1 text-sm">
                <div className="flex justify-between">
                  <span>RSI:</span>
                  <span>{data.trading.analysis?.indicators?.rsi || 65.4}</span>
                </div>
                <div className="flex justify-between">
                  <span>MACD:</span>
                  <Badge color="green" text={data.trading.analysis?.indicators?.macd || 'Bullish'} />
                </div>
                <div className="flex justify-between">
                  <span>Support:</span>
                  <span>{data.trading.analysis?.indicators?.support || '$0.022'}</span>
                </div>
                <div className="flex justify-between">
                  <span>Resistance:</span>
                  <span>{data.trading.analysis?.indicators?.resistance || '$0.026'}</span>
                </div>
              </div>
            </div>
          </Col>
        </Row>
      </Card>
    </div>
  );

  const CrossChainBridgePanel = () => (
    <div className="space-y-6">
      <Row gutter={[16, 16]}>
        <Col xs={24} sm={8}>
          <Card className="text-center">
            <SwapOutlined className="text-4xl text-purple-500 mb-3" />
            <Statistic 
              title="Supported Chains" 
              value={Object.keys(data.bridge.balances || {}).length || 4}
            />
          </Card>
        </Col>
        <Col xs={24} sm={8}>
          <Card className="text-center">
            <CloudOutlined className="text-4xl text-cyan-500 mb-3" />
            <Statistic 
              title="Bridge Routes" 
              value={data.bridge.routes?.length || 12}
            />
          </Card>
        </Col>
        <Col xs={24} sm={8}>
          <Card className="text-center">
            <MobileOutlined className="text-4xl text-green-500 mb-3" />
            <Statistic 
              title="Avg Time" 
              value="8" 
              suffix="min"
            />
          </Card>
        </Col>
      </Row>

      <Card title="Cross-Chain Balances" className="shadow-lg">
        <Row gutter={[16, 16]}>
          {Object.entries(data.bridge.balances || {}).map(([chainId, balance]) => (
            <Col xs={24} sm={12} md={8} key={chainId}>
              <Card size="small" className="text-center">
                <div className="space-y-2">
                  <Text strong>{balance.chain}</Text>
                  <div className="text-2xl font-bold text-blue-600">
                    {parseFloat(balance.balance).toFixed(4)} NTE
                  </div>
                  <Text type="secondary" className="text-xs">
                    Native: {balance.nativeToken}
                  </Text>
                  <Button size="small" type="primary" ghost className="w-full">
                    Bridge Tokens
                  </Button>
                </div>
              </Card>
            </Col>
          ))}
        </Row>
      </Card>

      <Card title="Available Bridge Routes" className="shadow-lg">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {data.bridge.routes?.slice(0, 6).map((route, index) => (
            <div key={index} className="p-4 border rounded-lg hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between mb-2">
                <span className="font-medium">{route.from?.name}</span>
                <SwapOutlined className="text-gray-400" />
                <span className="font-medium">{route.to?.name}</span>
              </div>
              <div className="text-xs text-gray-500 space-y-1">
                <div>Time: {route.estimatedTime}</div>
                <div>Min: {route.minAmount}</div>
                <Badge 
                  color={route.supported ? 'green' : 'red'} 
                  text={route.supported ? 'Available' : 'Coming Soon'}
                />
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );

  const SmartCommercePanel = () => (
    <div className="space-y-6">
      <Row gutter={[16, 16]}>
        <Col xs={24} sm={8}>
          <Card className="text-center">
            <ShoppingCartOutlined className="text-4xl text-green-500 mb-3" />
            <Statistic 
              title="Active Merchants" 
              value={data.commerce.merchants?.length || 12}
            />
          </Card>
        </Col>
        <Col xs={24} sm={8}>
          <Card className="text-center">
            <TrophyOutlined className="text-4xl text-orange-500 mb-3" />
            <Statistic 
              title="Products" 
              value="1,234" 
            />
          </Card>
        </Col>
        <Col xs={24} sm={8}>
          <Card className="text-center">
            <FireOutlined className="text-4xl text-red-500 mb-3" />
            <Statistic 
              title="24h Volume" 
              value="$45.2K" 
            />
          </Card>
        </Col>
      </Row>

      <Card title="Featured Merchants" className="shadow-lg">
        <Row gutter={[16, 16]}>
          {data.commerce.merchants?.map((merchant, index) => (
            <Col xs={24} sm={12} md={8} key={merchant.id || index}>
              <Card 
                size="small" 
                hoverable
                className="text-center border-2 border-transparent hover:border-blue-500 transition-all"
              >
                <div className="space-y-3">
                  <div>
                    <Text strong className="text-lg">{merchant.name}</Text>
                    {merchant.verified && (
                      <Badge color="blue" text="Verified" className="ml-2" />
                    )}
                  </div>
                  <div className="space-y-1 text-sm">
                    <div>Category: <Text type="secondary">{merchant.category}</Text></div>
                    <div>Rating: <Text className="text-yellow-500">★ {merchant.rating}/5</Text></div>
                    <div>Products: <Text>{merchant.products}</Text></div>
                  </div>
                  <Button type="primary" size="small" className="w-full">
                    Visit Store
                  </Button>
                </div>
              </Card>
            </Col>
          ))}
        </Row>
      </Card>

      <Card title="Commerce Analytics" className="shadow-lg">
        <Row gutter={[16, 16]}>
          <Col xs={24} md={12}>
            <div className="space-y-4">
              <div>
                <Text strong>Payment Methods</Text>
                <div className="mt-2 space-y-2">
                  <div className="flex justify-between items-center">
                    <span>NTE Token</span>
                    <Progress percent={85} size="small" className="flex-1 mx-3" />
                    <span>85%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>BNB</span>
                    <Progress percent={65} size="small" className="flex-1 mx-3" />
                    <span>65%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>USDT</span>
                    <Progress percent={45} size="small" className="flex-1 mx-3" />
                    <span>45%</span>
                  </div>
                </div>
              </div>
            </div>
          </Col>
          <Col xs={24} md={12}>
            <div className="space-y-4">
              <Text strong>Top Categories</Text>
              <div className="space-y-2 text-sm">
                {['Electronics', 'Gaming', 'Digital Services', 'Fashion'].map((category, index) => (
                  <div key={category} className="flex justify-between items-center">
                    <span>{category}</span>
                    <Badge count={[156, 89, 234, 67][index]} />
                  </div>
                ))}
              </div>
            </div>
          </Col>
        </Row>
      </Card>
    </div>
  );

  const TokenomicsPanel = () => (
    <div className="space-y-6">
      <Row gutter={[16, 16]}>
        <Col xs={24} sm={6}>
          <Card className="text-center">
            <PieChartOutlined className="text-4xl text-blue-500 mb-3" />
            <Statistic 
              title="Total Supply" 
              value={data.tokenomics.overview?.tokenInfo?.totalSupply || "100M"}
              suffix="NTE"
            />
          </Card>
        </Col>
        <Col xs={24} sm={6}>
          <Card className="text-center">
            <FireOutlined className="text-4xl text-red-500 mb-3" />
            <Statistic 
              title="Burned" 
              value={data.tokenomics.burns?.burnMetrics?.burnPercentage || "5.0"}
              suffix="%"
            />
          </Card>
        </Col>
        <Col xs={24} sm={6}>
          <Card className="text-center">
            <TrophyOutlined className="text-4xl text-green-500 mb-3" />
            <Statistic 
              title="Staked" 
              value={data.tokenomics.staking?.staking?.stakingPercentage || "25.0"}
              suffix="%"
            />
          </Card>
        </Col>
        <Col xs={24} sm={6}>
          <Card className="text-center">
            <CloudOutlined className="text-4xl text-purple-500 mb-3" />
            <Statistic 
              title="Holders" 
              value={data.tokenomics.community?.totalHolders || "12,847"}
            />
          </Card>
        </Col>
      </Row>

      <Card title="Token Distribution" className="shadow-lg">
        <Row gutter={[16, 16]}>
          <Col xs={24} md={12}>
            <div className="space-y-4">
              <Text strong>Supply Breakdown</Text>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span>Circulating Supply</span>
                  <Progress 
                    percent={85} 
                    size="small" 
                    className="flex-1 mx-3" 
                    strokeColor="#52c41a"
                  />
                  <span>85M NTE</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Staking Rewards</span>
                  <Progress 
                    percent={60} 
                    size="small" 
                    className="flex-1 mx-3"
                    strokeColor="#1890ff"
                  />
                  <span>25M NTE</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Team & Development</span>
                  <Progress 
                    percent={40} 
                    size="small" 
                    className="flex-1 mx-3"
                    strokeColor="#722ed1"
                  />
                  <span>15M NTE</span>
                </div>
              </div>
            </div>
          </Col>
          <Col xs={24} md={12}>
            <div className="space-y-4">
              <Text strong>Emission Schedule</Text>
              <div className="space-y-2 text-sm">
                <div className="p-3 bg-gray-50 rounded">
                  <div className="font-medium">Current Period (Year 1-2)</div>
                  <div className="text-gray-600">Reward Rate: 1.0 NTE/block</div>
                  <div className="text-green-600">Status: Active</div>
                </div>
                <div className="p-3 bg-blue-50 rounded">
                  <div className="font-medium">Next Halving</div>
                  <div className="text-gray-600">Days Remaining: ~547 days</div>
                  <div className="text-blue-600">New Rate: 0.5 NTE/block</div>
                </div>
              </div>
            </div>
          </Col>
        </Row>
      </Card>

      <Card title="Transparency Metrics" className="shadow-lg">
        <Row gutter={[16, 16]}>
          <Col xs={24} md={8}>
            <div className="text-center p-4 bg-green-50 rounded">
              <div className="text-2xl font-bold text-green-600">
                {data.tokenomics.governance?.governance?.participationRate || "67%"}
              </div>
              <div className="text-sm text-gray-600">Governance Participation</div>
            </div>
          </Col>
          <Col xs={24} md={8}>
            <div className="text-center p-4 bg-blue-50 rounded">
              <div className="text-2xl font-bold text-blue-600">
                {data.tokenomics.governance?.governance?.activeProposals || 3}
              </div>
              <div className="text-sm text-gray-600">Active Proposals</div>
            </div>
          </Col>
          <Col xs={24} md={8}>
            <div className="text-center p-4 bg-purple-50 rounded">
              <div className="text-2xl font-bold text-purple-600">0.72</div>
              <div className="text-sm text-gray-600">Gini Coefficient</div>
            </div>
          </Col>
        </Row>
      </Card>
    </div>
  );

  return (
    <div className="advanced-features-dashboard">
      <div className="mb-6">
        <Title level={2} className="mb-2">
          🚀 NodeMeta Advanced Features
        </Title>
        <Text type="secondary">
          Explore cutting-edge Web3 functionality built for the decentralized future
        </Text>
      </div>

      <Tabs 
        activeKey={activeTab} 
        onChange={setActiveTab}
        className="advanced-features-tabs"
        size="large"
      >
        <TabPane 
          tab={
            <span className="flex items-center space-x-2">
              <RobotOutlined />
              <span className="hidden sm:inline">AI Trading Bot</span>
              <span className="sm:hidden">Trading</span>
            </span>
          } 
          key="trading"
        >
          <TradingBotPanel />
        </TabPane>
        
        <TabPane 
          tab={
            <span className="flex items-center space-x-2">
              <SwapOutlined />
              <span className="hidden sm:inline">Cross-Chain Bridge</span>
              <span className="sm:hidden">Bridge</span>
            </span>
          } 
          key="bridge"
        >
          <CrossChainBridgePanel />
        </TabPane>
        
        <TabPane 
          tab={
            <span className="flex items-center space-x-2">
              <ShoppingCartOutlined />
              <span className="hidden sm:inline">Smart Commerce</span>
              <span className="sm:hidden">Commerce</span>
            </span>
          } 
          key="commerce"
        >
          <SmartCommercePanel />
        </TabPane>
        
        <TabPane 
          tab={
            <span className="flex items-center space-x-2">
              <PieChartOutlined />
              <span className="hidden sm:inline">Tokenomics Dashboard</span>
              <span className="sm:hidden">Tokenomics</span>
            </span>
          } 
          key="tokenomics"
        >
          <TokenomicsPanel />
        </TabPane>
      </Tabs>

      <style jsx>{`
        .advanced-features-dashboard {
          padding: 0;
        }
        
        @media (max-width: 768px) {
          .advanced-features-dashboard {
            padding: 0 8px;
          }
        }
        
        :global(.advanced-features-tabs .ant-tabs-nav) {
          margin-bottom: 24px;
        }
        
        :global(.advanced-features-tabs .ant-tabs-tab) {
          font-weight: 500;
        }
        
        :global(.advanced-features-tabs .ant-tabs-tab-active) {
          font-weight: 600;
        }
      `}</style>
    </div>
  );
};

export default AdvancedFeatures;