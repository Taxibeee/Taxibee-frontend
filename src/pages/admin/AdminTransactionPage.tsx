import React, { useState } from 'react';
import {
    Typography,
    Box, 
    Card,
    Tabs,
    Tab,
    Select,
    MenuItem,
    FormControl,
    InputLabel,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    CardHeader,
    Divider,
    CircularProgress,
    Alert,
    SelectChangeEvent
} from '@mui/material';
import { DashboardLayout } from '../../components';
import { sidebarItemsAdmin } from './AdminSidebar';
import { useAdminQueries } from '../../hooks';

interface TabPanelProps {
    children?: React.ReactNode;
    index: number;
    value: number;
}

const TabPanel = (props: TabPanelProps) => {
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
          <Box sx={{ p: 3 }}>
            {children}
          </Box>
        )}
      </div>
    );
};

// Format currency
const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'EUR'
    }).format(amount);
};

// Format Date
const formatDate = (timestamp: number) => {
    return new Date(timestamp * 1000).toLocaleString();
};

const AdminTransactionPage = () => {
    const [ tabValue, setTabValue ] = useState(0);
    const [ selectedWeekday, setSelectedWeekday ] = useState<string | undefined>(undefined);
    const [ selectedTerminal, setSelectedTerminal ] = useState<string | undefined>(undefined);

    const { useTransactionsByWeekday, useTransactionsByTerminal, useUnaccountedTransactions } = useAdminQueries();

    const { data: weekdayData, isLoading: weekdayLoading, isError: weekdayError } = 
    useTransactionsByWeekday(selectedWeekday);
  
    const { data: terminalData, isLoading: terminalLoading, isError: terminalError } = 
    useTransactionsByTerminal({ terminal_name: selectedTerminal });
  
    const { data: unaccountedData, isLoading: unaccountedLoading, isError: unaccountedError } = 
    useUnaccountedTransactions();

    const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
        setTabValue(newValue);
    };
    
    const handleWeekdayChange = (event: SelectChangeEvent<string>) => {
        setSelectedWeekday(event.target.value);
    };
    
    const handleTerminalChange = (event: SelectChangeEvent<string>) => {
        setSelectedTerminal(event.target.value);
    };

    return (
        <DashboardLayout title="Transactions" menuItems={sidebarItemsAdmin}>
          <Box>
            <Typography variant="h4" sx={{ mb: 3 }}>Transaction Management</Typography>
            
            <Card elevation={2}>
              <CardHeader title="Transactions" />
              <Divider />
              <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                <Tabs value={tabValue} onChange={handleTabChange} aria-label="transaction tabs">
                  <Tab label="By Weekday" id="transactions-tab-0" />
                  <Tab label="By Terminal" id="transactions-tab-1" />
                  <Tab label="Unaccounted" id="transactions-tab-2" />
                </Tabs>
              </Box>
              
              {/* By Weekday Tab */}
              <TabPanel value={tabValue} index={0}>
                <Box sx={{ mb: 3 }}>
                  <FormControl variant="outlined" size="small" sx={{ minWidth: 200 }}>
                    <InputLabel id="weekday-select-label">Select Weekday</InputLabel>
                    <Select
                      labelId="weekday-select-label"
                      id="weekday-select"
                      value={selectedWeekday || ''}
                      onChange={handleWeekdayChange}
                      label="Select Weekday"
                    >
                      <MenuItem value="">All Weekdays</MenuItem>
                      <MenuItem value="Monday">Monday</MenuItem>
                      <MenuItem value="Tuesday">Tuesday</MenuItem>
                      <MenuItem value="Wednesday">Wednesday</MenuItem>
                      <MenuItem value="Thursday">Thursday</MenuItem>
                      <MenuItem value="Friday">Friday</MenuItem>
                      <MenuItem value="Saturday">Saturday</MenuItem>
                      <MenuItem value="Sunday">Sunday</MenuItem>
                    </Select>
                  </FormControl>
                </Box>
                
                {weekdayLoading ? (
                  <CircularProgress />
                ) : weekdayError ? (
                  <Alert severity="error">Failed to load weekday transaction data.</Alert>
                ) : !weekdayData ? (
                  <Alert severity="info">No transaction data available.</Alert>
                ) : (
                  <TableContainer component={Paper} elevation={0}>
                    <Table>
                      <TableHead>
                        <TableRow>
                          <TableCell>Day</TableCell>
                          <TableCell>Transactions</TableCell>
                          <TableCell align="right">Total Amount</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {selectedWeekday ? (
                          <TableRow>
                            <TableCell>{selectedWeekday}</TableCell>
                            <TableCell>{weekdayData.count}</TableCell>
                            <TableCell align="right">{formatCurrency(weekdayData.total_amount)}</TableCell>
                          </TableRow>
                        ) : (
                          Object.entries(weekdayData.days).map(([day, data]) => (
                            <TableRow key={day}>
                              <TableCell>{day}</TableCell>
                              <TableCell>{data.count}</TableCell>
                              <TableCell align="right">{formatCurrency(data.total_amount)}</TableCell>
                            </TableRow>
                          ))
                        )}
                      </TableBody>
                    </Table>
                  </TableContainer>
                )}
              </TabPanel>
              
              {/* By Terminal Tab */}
              <TabPanel value={tabValue} index={1}>
                <Box sx={{ mb: 3 }}>
                  <FormControl variant="outlined" size="small" sx={{ minWidth: 200 }}>
                    <InputLabel id="terminal-select-label">Select Terminal</InputLabel>
                    <Select
                      labelId="terminal-select-label"
                      id="terminal-select"
                      value={selectedTerminal || ''}
                      onChange={handleTerminalChange}
                      label="Select Terminal"
                    >
                      <MenuItem value="">All Terminals</MenuItem>
                      {terminalData && Object.keys(terminalData.terminals).map(terminal => (
                        <MenuItem key={terminal} value={terminal}>{terminal}</MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Box>
                
                {terminalLoading ? (
                  <CircularProgress />
                ) : terminalError ? (
                  <Alert severity="error">Failed to load terminal transaction data.</Alert>
                ) : !terminalData ? (
                  <Alert severity="info">No transaction data available.</Alert>
                ) : (
                  <TableContainer component={Paper} elevation={0}>
                    <Table>
                      <TableHead>
                        <TableRow>
                          <TableCell>Terminal</TableCell>
                          <TableCell>Transactions</TableCell>
                          <TableCell align="right">Total Amount</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {selectedTerminal ? (
                          <TableRow>
                            <TableCell>{selectedTerminal}</TableCell>
                            <TableCell>{terminalData.terminals[selectedTerminal].count}</TableCell>
                            <TableCell align="right">{formatCurrency(terminalData.terminals[selectedTerminal].total_amount)}</TableCell>
                          </TableRow>
                        ) : (
                          Object.entries(terminalData.terminals).map(([terminal, data]) => (
                            <TableRow key={terminal}>
                              <TableCell>{terminal}</TableCell>
                              <TableCell>{data.count}</TableCell>
                              <TableCell align="right">{formatCurrency(data.total_amount)}</TableCell>
                            </TableRow>
                          ))
                        )}
                      </TableBody>
                    </Table>
                  </TableContainer>
                )}
              </TabPanel>
              
              {/* Unaccounted Tab */}
              <TabPanel value={tabValue} index={2}>
                {unaccountedLoading ? (
                  <CircularProgress />
                ) : unaccountedError ? (
                  <Alert severity="error">Failed to load unaccounted transaction data.</Alert>
                ) : !unaccountedData ? (
                  <Alert severity="info">No unaccounted transaction data available.</Alert>
                ) : (
                  <TableContainer component={Paper} elevation={0}>
                    <Table>
                      <TableHead>
                        <TableRow>
                          <TableCell>Reference</TableCell>
                          <TableCell>Date</TableCell>
                          <TableCell>Terminal</TableCell>
                          <TableCell align="right">Amount</TableCell>
                          <TableCell>Driver(s)</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {unaccountedData.transactions.map((transaction) => (
                          <TableRow key={transaction.payment_reference}>
                            <TableCell>{transaction.payment_reference}</TableCell>
                            <TableCell>{transaction.transaction_date_formatted || formatDate(transaction.transaction_date)}</TableCell>
                            <TableCell>{transaction.terminal_name}</TableCell>
                            <TableCell align="right">{formatCurrency(transaction.transaction_amount)}</TableCell>
                            <TableCell>{transaction.driver_names?.join(', ') || 'Unassigned'}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                )}
              </TabPanel>
            </Card>
          </Box>
        </DashboardLayout>
      );
};

export default AdminTransactionPage;

