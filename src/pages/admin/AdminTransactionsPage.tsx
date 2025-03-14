import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid2,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Tabs,
  Tab,
  Select,
  MenuItem,
  FormControl,
  SelectChangeEvent,
  InputLabel,
  Chip,
  CircularProgress,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Divider
} from '@mui/material';
import { useAdminQueries } from '../../hooks';
import { Transaction } from '../../api/adminApi';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`transactions-tabpanel-${index}`}
      aria-labelledby={`transactions-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ py: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
}

const AdminTransactionsPage: React.FC = () => {
  // State for tabs and filters
  const [tabValue, setTabValue] = useState(0);
  const [weekday, setWeekday] = useState('');
  const [terminal, setTerminal] = useState('');
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);
  const [driverAssignDialogOpen, setDriverAssignDialogOpen] = useState(false);
  const [selectedDriverUuid, setSelectedDriverUuid] = useState('');

  // Fetch transaction data
  const { 
    useTransactionsByWeekday, 
    useTransactionsByTerminal, 
    useUnaccountedTransactions,
    useUpdateTransactionDriver
  } = useAdminQueries();

  const { 
    data: weekdayData, 
    isLoading: weekdayLoading 
  } = useTransactionsByWeekday(weekday || undefined);

  const { 
    data: terminalData, 
    isLoading: terminalLoading 
  } = useTransactionsByTerminal(terminal ? { terminal_name: terminal } : {});

  const { 
    data: unaccountedData, 
    isLoading: unaccountedLoading 
  } = useUnaccountedTransactions();

  const { 
    mutate: updateTransactionDriver,
    isPending: isUpdatingDriver
  } = useUpdateTransactionDriver();

  // Handle tab change
  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  // Handle weekday filter change
  const handleWeekdayChange = (event: SelectChangeEvent<string>) => {
    setWeekday(event.target.value as string);
  };

  // Handle terminal filter change
  const handleTerminalChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    setTerminal(event.target.value as string);
  };

  // Open driver assign dialog
  const handleOpenDriverAssignDialog = (transaction: Transaction) => {
    setSelectedTransaction(transaction);
    setSelectedDriverUuid('');
    setDriverAssignDialogOpen(true);
  };

  // Close driver assign dialog
  const handleCloseDriverAssignDialog = () => {
    setDriverAssignDialogOpen(false);
    setSelectedTransaction(null);
  };

  // Handle driver selection
  const handleDriverSelection = (event: SelectChangeEvent<string>) => {
    setSelectedDriverUuid(event.target.value as string);
  };

  // Handle driver assignment
  const handleAssignDriver = () => {
    if (selectedTransaction && selectedDriverUuid) {
      updateTransactionDriver({
        payment_reference: selectedTransaction.payment_reference,
        driver_uuids: selectedDriverUuid
      }, {
        onSuccess: () => {
          handleCloseDriverAssignDialog();
        }
      });
    }
  };

  // Format timestamp to readable date
  const formatTimestamp = (timestamp: number): string => {
    return new Date(timestamp * 1000).toLocaleString();
  };

  // Format currency
  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('nl-NL', {
      style: 'currency',
      currency: 'EUR'
    }).format(amount);
  };

  // Get all unique terminal names from terminalData
  const getUniqueTerminals = (): string[] => {
    if (!terminalData?.terminals) return [];
    return Object.keys(terminalData.terminals).filter(name => name);
  };

  // Get days of the week
  const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

  return (
    <Box>
      <Card>
        <CardContent>
          <Typography variant="h5" gutterBottom>
            Transactions Management
          </Typography>

          <Tabs 
            value={tabValue} 
            onChange={handleTabChange}
            indicatorColor="primary"
            textColor="primary"
            sx={{ borderBottom: 1, borderColor: 'divider', mb: 2 }}
          >
            <Tab label="By Weekday" />
            <Tab label="By Terminal" />
            <Tab label="Unaccounted Transactions" />
          </Tabs>

          <TabPanel value={tabValue} index={0}>
            <Grid2 container spacing={3}>
              <Grid2 item xs={12} md={4}>
                <FormControl fullWidth>
                  <InputLabel id="weekday-filter-label">Filter by Weekday</InputLabel>
                  <Select
                    labelId="weekday-filter-label"
                    value={weekday}
                    onChange={handleWeekdayChange}
                    label="Filter by Weekday"
                    
                  >
                    <MenuItem value="">All Week</MenuItem>
                    {daysOfWeek.map((day) => (
                      <MenuItem key={day} value={day}>{day}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid2>
              
              <Grid2 item xs={12}>
                {weekdayLoading ? (
                  <Box display="flex" justifyContent="center" p={3}>
                    <CircularProgress />
                  </Box>
                ) : !weekdayData ? (
                  <Typography color="error">No transaction data available</Typography>
                ) : (
                  <Box>
                    {weekday ? (
                      // Single day view
                      <Box>
                        <Box sx={{ mb: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <Typography variant="h6">{weekday} Transactions</Typography>
                          <Chip 
                            label={`Total: ${formatCurrency(weekdayData.data?.total_amount || 0)}`}
                            color="primary"
                          />
                        </Box>
                        
                        <TableContainer component={Paper}>
                          <Table size="small">
                            <TableHead>
                              <TableRow>
                                <TableCell>Reference</TableCell>
                                <TableCell>Date</TableCell>
                                <TableCell>Terminal</TableCell>
                                <TableCell>Operator</TableCell>
                                <TableCell align="right">Amount</TableCell>
                                <TableCell>Driver(s)</TableCell>
                              </TableRow>
                            </TableHead>
                            <TableBody>
                              {weekdayData.data?.transactions?.length > 0 ? (
                                weekdayData.data.transactions.map((transaction: Transaction) => (
                                  <TableRow key={transaction.payment_reference} hover>
                                    <TableCell>{transaction.payment_reference}</TableCell>
                                    <TableCell>{transaction.transaction_date_formatted || formatTimestamp(transaction.transaction_date)}</TableCell>
                                    <TableCell>{transaction.terminal_name || 'N/A'}</TableCell>
                                    <TableCell>{transaction.operator_code || 'N/A'}</TableCell>
                                    <TableCell align="right">{formatCurrency(transaction.transaction_amount)}</TableCell>
                                    <TableCell>
                                      {transaction.driver_names?.length > 0 ? (
                                        transaction.driver_names.join(', ')
                                      ) : (
                                        <Chip label="Unassigned" size="small" color="warning" />
                                      )}
                                    </TableCell>
                                  </TableRow>
                                ))
                              ) : (
                                <TableRow>
                                  <TableCell colSpan={6} align="center">
                                    No transactions found for {weekday}
                                  </TableCell>
                                </TableRow>
                              )}
                            </TableBody>
                          </Table>
                        </TableContainer>
                      </Box>
                    ) : (
                      // Week summary view
                      <Box>
                        <Box sx={{ mb: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <Typography variant="h6">Weekly Transactions Summary</Typography>
                          <Chip 
                            label={`Week Total: ${formatCurrency(weekdayData.data?.week_total?.total_amount || 0)}`}
                            color="primary"
                          />
                        </Box>
                        
                        <TableContainer component={Paper}>
                          <Table>
                            <TableHead>
                              <TableRow>
                                <TableCell>Day</TableCell>
                                <TableCell align="right">Transactions Count</TableCell>
                                <TableCell align="right">Total Amount</TableCell>
                              </TableRow>
                            </TableHead>
                            <TableBody>
                              {Object.entries(weekdayData.data?.days || {}).map(([day, data]) => (
                                <TableRow key={day} hover>
                                  <TableCell>{day}</TableCell>
                                  <TableCell align="right">{data.count}</TableCell>
                                  <TableCell align="right">{formatCurrency(data.total_amount)}</TableCell>
                                </TableRow>
                              ))}
                              <TableRow sx={{ bgcolor: 'action.hover' }}>
                                <TableCell sx={{ fontWeight: 'bold' }}>Weekly Total</TableCell>
                                <TableCell align="right" sx={{ fontWeight: 'bold' }}>
                                  {weekdayData.data?.week_total?.total_count || 0}
                                </TableCell>
                                <TableCell align="right" sx={{ fontWeight: 'bold' }}>
                                  {formatCurrency(weekdayData.data?.week_total?.total_amount || 0)}
                                </TableCell>
                              </TableRow>
                            </TableBody>
                          </Table>
                        </TableContainer>
                      </Box>
                    )}
                  </Box>
                )}
              </Grid2>
            </Grid2>
          </TabPanel>

          <TabPanel value={tabValue} index={1}>
            <Grid2 container spacing={3}>
              <Grid2 item xs={12} md={4}>
                <FormControl fullWidth>
                  <InputLabel id="terminal-filter-label">Filter by Terminal</InputLabel>
                  <Select
                    labelId="terminal-filter-label"
                    value={terminal}
                    onChange={handleTerminalChange}
                    label="Filter by Terminal"
                  >
                    <MenuItem value="">All Terminals</MenuItem>
                    {getUniqueTerminals().map((name) => (
                      <MenuItem key={name} value={name}>{name}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid2>
              
              <Grid2 item xs={12}>
                {terminalLoading ? (
                  <Box display="flex" justifyContent="center" p={3}>
                    <CircularProgress />
                  </Box>
                ) : !terminalData ? (
                  <Typography color="error">No terminal data available</Typography>
                ) : (
                  <Box>
                    {terminal ? (
                      // Single terminal view
                      <Box>
                        <Box sx={{ mb: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <Typography variant="h6">Terminal: {terminal}</Typography>
                          <Chip 
                            label={`Total: ${formatCurrency(terminalData.terminals[terminal]?.total_amount || 0)}`}
                            color="primary"
                          />
                        </Box>
                        
                        <TableContainer component={Paper}>
                          <Table size="small">
                            <TableHead>
                              <TableRow>
                                <TableCell>Reference</TableCell>
                                <TableCell>Date</TableCell>
                                <TableCell>Operator</TableCell>
                                <TableCell align="right">Amount</TableCell>
                                <TableCell>Driver(s)</TableCell>
                              </TableRow>
                            </TableHead>
                            <TableBody>
                              {terminalData.terminals[terminal]?.transactions.length > 0 ? (
                                terminalData.terminals[terminal].transactions.map((transaction: Transaction) => (
                                  <TableRow key={transaction.payment_reference} hover>
                                    <TableCell>{transaction.payment_reference}</TableCell>
                                    <TableCell>{transaction.transaction_date_formatted || formatTimestamp(transaction.transaction_date)}</TableCell>
                                    <TableCell>{transaction.operator_code || 'N/A'}</TableCell>
                                    <TableCell align="right">{formatCurrency(transaction.transaction_amount)}</TableCell>
                                    <TableCell>
                                      {transaction.driver_names?.length > 0 ? (
                                        transaction.driver_names.join(', ')
                                      ) : (
                                        <Chip label="Unassigned" size="small" color="warning" />
                                      )}
                                    </TableCell>
                                  </TableRow>
                                ))
                              ) : (
                                <TableRow>
                                  <TableCell colSpan={5} align="center">
                                    No transactions found for terminal {terminal}
                                  </TableCell>
                                </TableRow>
                              )}
                            </TableBody>
                          </Table>
                        </TableContainer>
                      </Box>
                    ) : (
                      // All terminals summary view
                      <Box>
                        <Box sx={{ mb: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <Typography variant="h6">Terminal Transactions Summary</Typography>
                          <Chip 
                            label={`Total: ${formatCurrency(terminalData.total_amount || 0)}`}
                            color="primary"
                          />
                        </Box>
                        
                        <TableContainer component={Paper}>
                          <Table>
                            <TableHead>
                              <TableRow>
                                <TableCell>Terminal</TableCell>
                                <TableCell align="right">Transactions Count</TableCell>
                                <TableCell align="right">Total Amount</TableCell>
                              </TableRow>
                            </TableHead>
                            <TableBody>
                              {Object.entries(terminalData.terminals || {}).map(([name, data]) => (
                                <TableRow key={name} hover>
                                  <TableCell>{name || 'Unknown'}</TableCell>
                                  <TableCell align="right">{data.count}</TableCell>
                                  <TableCell align="right">{formatCurrency(data.total_amount)}</TableCell>
                                </TableRow>
                              ))}
                              <TableRow sx={{ bgcolor: 'action.hover' }}>
                                <TableCell sx={{ fontWeight: 'bold' }}>Total</TableCell>
                                <TableCell align="right" sx={{ fontWeight: 'bold' }}>
                                  {terminalData.total_count || 0}
                                </TableCell>
                                <TableCell align="right" sx={{ fontWeight: 'bold' }}>
                                  {formatCurrency(terminalData.total_amount || 0)}
                                </TableCell>
                              </TableRow>
                            </TableBody>
                          </Table>
                        </TableContainer>
                      </Box>
                    )}
                  </Box>
                )}
              </Grid2>
            </Grid2>
          </TabPanel>

          <TabPanel value={tabValue} index={2}>
            {unaccountedLoading ? (
              <Box display="flex" justifyContent="center" p={3}>
                <CircularProgress />
              </Box>
            ) : !unaccountedData ? (
              <Typography color="error">No unaccounted transaction data available</Typography>
            ) : (
              <Box>
                <Typography variant="h6" gutterBottom>
                  Unaccounted Transactions
                </Typography>
                <Typography variant="body2" color="text.secondary" paragraph>
                  These transactions have either multiple drivers assigned or no driver assigned and need to be managed.
                </Typography>
                
                <TableContainer component={Paper}>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>Reference</TableCell>
                        <TableCell>Date</TableCell>
                        <TableCell>Terminal</TableCell>
                        <TableCell align="right">Amount</TableCell>
                        <TableCell>Current Driver(s)</TableCell>
                        <TableCell align="center">Actions</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {unaccountedData.transactions.length > 0 ? (
                        unaccountedData.transactions.map((transaction: Transaction) => (
                          <TableRow key={transaction.payment_reference} hover>
                            <TableCell>{transaction.payment_reference}</TableCell>
                            <TableCell>{transaction.transaction_date_formatted || formatTimestamp(transaction.transaction_date)}</TableCell>
                            <TableCell>{transaction.terminal_name || 'N/A'}</TableCell>
                            <TableCell align="right">{formatCurrency(transaction.transaction_amount)}</TableCell>
                            <TableCell>
                              {transaction.driver_names?.length > 0 ? (
                                <Chip 
                                  label={`${transaction.driver_names.length} drivers`} 
                                  color="warning" 
                                  size="small" 
                                />
                              ) : (
                                <Chip label="None" color="error" size="small" />
                              )}
                            </TableCell>
                            <TableCell align="center">
                              <Button
                                size="small"
                                variant="outlined"
                                onClick={() => handleOpenDriverAssignDialog(transaction)}
                              >
                                Assign Driver
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))
                      ) : (
                        <TableRow>
                          <TableCell colSpan={6} align="center">
                            No unaccounted transactions found
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Box>
            )}
          </TabPanel>
        </CardContent>
      </Card>

      {/* Driver Assignment Dialog */}
      <Dialog
        open={driverAssignDialogOpen}
        onClose={handleCloseDriverAssignDialog}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          Assign Driver to Transaction
        </DialogTitle>
        <DialogContent>
          {selectedTransaction && (
            <Box sx={{ mt: 2 }}>
              <Typography variant="subtitle2" gutterBottom>
                Transaction Details
              </Typography>
              <Divider sx={{ mb: 2 }} />
              
              <Grid2 container spacing={2} sx={{ mb: 3 }}>
                <Grid2 item xs={12} sm={6}>
                  <Typography variant="body2" color="text.secondary">
                    Reference
                  </Typography>
                  <Typography variant="body1">
                    {selectedTransaction.payment_reference}
                  </Typography>
                </Grid2>
                <Grid2 item xs={12} sm={6}>
                  <Typography variant="body2" color="text.secondary">
                    Date
                  </Typography>
                  <Typography variant="body1">
                    {selectedTransaction.transaction_date_formatted || formatTimestamp(selectedTransaction.transaction_date)}
                  </Typography>
                </Grid2>
                <Grid2 item xs={12} sm={6}>
                  <Typography variant="body2" color="text.secondary">
                    Terminal
                  </Typography>
                  <Typography variant="body1">
                    {selectedTransaction.terminal_name || 'N/A'}
                  </Typography>
                </Grid2>
                <Grid2 item xs={12} sm={6}>
                  <Typography variant="body2" color="text.secondary">
                    Amount
                  </Typography>
                  <Typography variant="body1" fontWeight="bold">
                    {formatCurrency(selectedTransaction.transaction_amount)}
                  </Typography>
                </Grid2>
                {selectedTransaction.driver_names && selectedTransaction.driver_names.length > 0 && (
                  <Grid2 item xs={12}>
                    <Typography variant="body2" color="text.secondary">
                      Current Drivers
                    </Typography>
                    <Typography variant="body1">
                      {selectedTransaction.driver_names.join(', ')}
                    </Typography>
                  </Grid2>
                )}
              </Grid2>
              
              <Typography variant="subtitle2" gutterBottom>
                Select Driver
              </Typography>
              <Divider sx={{ mb: 2 }} />
              
              <FormControl fullWidth sx={{ mt: 1 }}>
                <InputLabel id="assign-driver-label">Driver</InputLabel>
                <Select
                  labelId="assign-driver-label"
                  value={selectedDriverUuid}
                  onChange={handleDriverSelection}
                  label="Driver"
                >
                  <MenuItem value="">
                    <em>Select a driver</em>
                  </MenuItem>
                  {unaccountedData?.driver_options.map((driver) => (
                    <MenuItem key={driver.uuid} value={driver.uuid}>
                      {driver.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDriverAssignDialog}>
            Cancel
          </Button>
          <Button 
            onClick={handleAssignDriver} 
            variant="contained" 
            color="primary"
            disabled={!selectedDriverUuid || isUpdatingDriver}
          >
            {isUpdatingDriver ? 'Assigning...' : 'Assign Driver'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default AdminTransactionsPage;
