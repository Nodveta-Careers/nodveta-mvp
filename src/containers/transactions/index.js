import React, { Fragment, useState, useEffect } from 'react';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Grid from '@mui/material/Grid';
import Chip from '@mui/material/Chip';
import Button from '@mui/material/Button';
import Alert from '@mui/material/Alert';
import CircularProgress from '@mui/material/CircularProgress';
import { useMoralis } from 'react-moralis';
import ERC20Transfers from 'components/ERC20Transfers';
import WalletStatusBar from 'components/ui/WalletStatusBar';
import { fetchNativeBalance, fetchSalesHistory, getWalletAnalytics } from '../../services/assessment/web3HistoryService';

export default function Transactions() {
  const { account, library } = useMoralis();
  const [balances, setBalances] = useState(null);
  const [history, setHistory] = useState(null);
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Load wallet data when account changes
  useEffect(() => {
    if (account) {
      loadWalletData();
    } else {
      setBalances(null);
      setHistory(null);
      setAnalytics(null);
    }
  }, [account, library]);

  const loadWalletData = async () => {
    if (!account) return;
    
    setLoading(true);
    setError(null);
    
    try {
      // Load comprehensive wallet data
      const [balanceResult, historyResult, analyticsResult] = await Promise.allSettled([
        fetchNativeBalance(library, account),
        fetchSalesHistory(account),
        getWalletAnalytics(account)
      ]);

      // Process balance data
      if (balanceResult.status === 'fulfilled') {
        setBalances(balanceResult.value);
      }

      // Process history data
      if (historyResult.status === 'fulfilled' && historyResult.value.success) {
        setHistory(historyResult.value.data);
      }

      // Process analytics data
      if (analyticsResult.status === 'fulfilled' && analyticsResult.value.success) {
        setAnalytics(analyticsResult.value.analytics);
      }
    } catch (err) {
      console.error('Error loading wallet data:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const formatTimestamp = (timestamp) => {
    return new Date(timestamp).toLocaleDateString() + ' ' + 
           new Date(timestamp).toLocaleTimeString();
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': case 'delivered': return 'success';
      case 'pending': return 'warning'; 
      case 'failed': return 'error';
      default: return 'default';
    }
  };

  return (
    <Fragment>
      <Container>
        <Box sx={{mb: 4}}>
          <Typography 
            color="primary.main" 
            variant="h4" 
            sx={{ fontWeight: 'bold', mb: 1}} 
            component="div"
          >
            Transactions & Wallet History
          </Typography>
              <Typography variant="body1" color="text.secondary">
                Real-time wallet analytics and comprehensive transaction tracking
              </Typography>
          
          <Box sx={{ mt: 3 }}>
            <WalletStatusBar />
          </Box>

          {/* ASSESSMENT_TASK_5: BNB Balance & Wallet Analytics */}
          {account && (
            <Box sx={{ mt: 3 }}>
              {loading && (
                <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
                  <CircularProgress />
                  <Typography sx={{ ml: 2 }}>Loading wallet data...</Typography>
                </Box>
              )}

              {error && (
                <Alert severity="error" sx={{ mb: 3 }}>
                  Error loading wallet data: {error}
                  <Button onClick={loadWalletData} sx={{ ml: 2 }}>Retry</Button>
                </Alert>
              )}

              {balances && (
                <Grid container spacing={3} sx={{ mb: 3 }}>
                  <Grid item xs={12} md={4}>
                    <Card>
                      <CardContent>
                        <Typography variant="h6" color="primary">
                          💰 Wallet Balances
                        </Typography>
                        <Typography variant="h4" sx={{ my: 1 }}>
                          {balances.formatted}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          ~${balances.totalUSD} USD
                        </Typography>
                      </CardContent>
                    </Card>
                  </Grid>

                  {analytics && (
                    <>
                      <Grid item xs={12} md={4}>
                        <Card>
                          <CardContent>
                            <Typography variant="h6" color="primary">
                              📊 Activity Score
                            </Typography>
                            <Typography variant="h4" sx={{ my: 1 }}>
                              {analytics.activityScore}/100
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              Portfolio Value: ${analytics.portfolioValue}
                            </Typography>
                          </CardContent>
                        </Card>
                      </Grid>

                      <Grid item xs={12} md={4}>
                        <Card>
                          <CardContent>
                            <Typography variant="h6" color="primary">
                              🔗 Network
                            </Typography>
                            <Typography variant="h4" sx={{ my: 1 }}>
                              BSC
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              {analytics.network}
                            </Typography>
                          </CardContent>
                        </Card>
                      </Grid>
                    </>
                  )}
                </Grid>
              )}

              {/* ASSESSMENT_TASK_5: Sales & Transaction History */}
              {history && (
                <Box sx={{ mb: 4 }}>
                  <Typography variant="h5" sx={{ mb: 3, fontWeight: 'bold' }}>
                    📋 Transaction History Summary
                  </Typography>
                  
                      <Alert severity="info" sx={{ mb: 3 }}>
                        <strong>Comprehensive Integration:</strong> Successfully loaded Web3 balances 
                        and transaction history. Found {history.summary?.totalTransactions || 0} transactions 
                        with total volume of ${history.summary?.totalVolume || 0}.
                      </Alert>

                  <Grid container spacing={2}>
                    {/* Sales History */}
                    <Grid item xs={12} md={6}>
                      <Card>
                        <CardContent>
                          <Typography variant="h6" sx={{ mb: 2 }}>
                            💸 Sales History ({history.sales?.length || 0})
                          </Typography>
                          {history.sales?.length > 0 ? (
                            history.sales.map((sale, idx) => (
                              <Box key={idx} sx={{ mb: 1, p: 1, bgcolor: 'grey.50', borderRadius: 1 }}>
                                <Typography variant="body2">
                                  {sale.product || 'Sale'}: {sale.amount}
                                </Typography>
                                <Typography variant="caption" color="text.secondary">
                                  {formatTimestamp(sale.timestamp)}
                                </Typography>
                              </Box>
                            ))
                          ) : (
                            <Typography variant="body2" color="text.secondary">
                              No sales history found
                            </Typography>
                          )}
                        </CardContent>
                      </Card>
                    </Grid>

                    {/* Staking History */}
                    <Grid item xs={12} md={6}>
                      <Card>
                        <CardContent>
                          <Typography variant="h6" sx={{ mb: 2 }}>
                            🥩 Staking Activity ({history.staking?.length || 0})
                          </Typography>
                          {history.staking?.length > 0 ? (
                            history.staking.map((stake, idx) => (
                              <Box key={idx} sx={{ mb: 1, p: 1, bgcolor: 'grey.50', borderRadius: 1 }}>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                  <Typography variant="body2">
                                    {stake.type}: {stake.amount}
                                  </Typography>
                                  <Chip 
                                    label={stake.status} 
                                    size="small" 
                                    color={getStatusColor(stake.status)}
                                  />
                                </Box>
                                <Typography variant="caption" color="text.secondary">
                                  {formatTimestamp(stake.timestamp)}
                                </Typography>
                              </Box>
                            ))
                          ) : (
                            <Typography variant="body2" color="text.secondary">
                              No staking activity found
                            </Typography>
                          )}
                        </CardContent>
                      </Card>
                    </Grid>

                    {/* NFT History */}
                    <Grid item xs={12} md={6}>
                      <Card>
                        <CardContent>
                          <Typography variant="h6" sx={{ mb: 2 }}>
                            🖼️ NFT Activity ({history.nft?.length || 0})
                          </Typography>
                          {history.nft?.length > 0 ? (
                            history.nft.map((nft, idx) => (
                              <Box key={idx} sx={{ mb: 1, p: 1, bgcolor: 'grey.50', borderRadius: 1 }}>
                                <Typography variant="body2">
                                  {nft.type} #{nft.tokenId}: {nft.amount}
                                </Typography>
                                <Typography variant="caption" color="text.secondary">
                                  {formatTimestamp(nft.timestamp)}
                                </Typography>
                              </Box>
                            ))
                          ) : (
                            <Typography variant="body2" color="text.secondary">
                              No NFT activity found
                            </Typography>
                          )}
                        </CardContent>
                      </Card>
                    </Grid>

                    {/* Commerce History */}
                    <Grid item xs={12} md={6}>
                      <Card>
                        <CardContent>
                          <Typography variant="h6" sx={{ mb: 2 }}>
                            🛒 Commerce History ({history.commerce?.length || 0})
                          </Typography>
                          {history.commerce?.length > 0 ? (
                            history.commerce.map((order, idx) => (
                              <Box key={idx} sx={{ mb: 1, p: 1, bgcolor: 'grey.50', borderRadius: 1 }}>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                  <Typography variant="body2">
                                    {order.product}: {order.amount}
                                  </Typography>
                                  <Chip 
                                    label={order.status} 
                                    size="small" 
                                    color={getStatusColor(order.status)}
                                  />
                                </Box>
                                <Typography variant="caption" color="text.secondary">
                                  Order #{order.orderId} • {formatTimestamp(order.timestamp)}
                                </Typography>
                              </Box>
                            ))
                          ) : (
                            <Typography variant="body2" color="text.secondary">
                              No commerce activity found
                            </Typography>
                          )}
                        </CardContent>
                      </Card>
                    </Grid>
                  </Grid>
                </Box>
              )}
            </Box>
          )}

          {!account && (
            <Alert severity="info" sx={{ mt: 3 }}>
              Please connect your wallet to view transaction history and balances.
            </Alert>
          )}
        </Box>
      </Container>

      <Box 
        sx={{
          bgcolor: "neutral.main", 
          py: 7, 
          borderTop: 1, 
          borderBottom: 1, 
          borderColor: "grey.100",
          mb: 4
        }}
      >
        <Container>
          <Typography variant="h5" sx={{ mb: 3, fontWeight: 'bold' }}>
            🔄 Live ERC20 Transfers
          </Typography>
          <ERC20Transfers />
        </Container>
      </Box>
    </Fragment>
  );
}
