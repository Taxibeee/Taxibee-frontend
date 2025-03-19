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
  Button,
  TextField,
  InputAdornment,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Divider,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  SelectChangeEvent
} from '@mui/material';
import DownloadIcon from '@mui/icons-material/Download';
import SearchIcon from '@mui/icons-material/Search';
import { useQuery } from '@tanstack/react-query';
import api from '../../api/api';
import { formatApiError } from '../../api/api';
import { CustomAlert } from '../../utils/customAlert';

// Define interface for Exact Debnr data
interface ExactDebnr {
  driver_name: string;
  bolt_driver_uuid: string;
  exact_debnr_number: string | null;
  ride_price_sum: number;
  commission_bolt: number;
  commission_tc: number;
  tips_bolt: number;
  tips_mypos: number;
  card_received: number;
  cash_received: number;
  card_terminal_value: number;
}

interface SearchFieldProps {
  searchTerm: string;
  setSearchTerm: React.Dispatch<React.SetStateAction<string>>;
}

const SearchField: React.FC<SearchFieldProps> = ({ searchTerm, setSearchTerm }) => {

   // Handle search input change
   const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  return <Box sx={{
    display: 'flex'
  }} >
  <TextField
    fullWidth
    variant="outlined"
    placeholder="Search by driver name or debnr"
    onChange={handleSearchChange}
    value={searchTerm}
  />
  <InputAdornment position="start">
    <SearchIcon />
  </InputAdornment>
  </Box>
};


const AdminExactFilePage: React.FC = () => {
  // State for search, dialog and export settings
  const [searchTerm, setSearchTerm] = useState('');
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [weekNumber, setWeekNumber] = useState<number>(getCurrentWeek());
  const [year, setYear] = useState<number>(new Date().getFullYear());
  const [exportSuccess, setExportSuccess] = useState(false);
  const [exportError, setExportError] = useState<string | null>(null);

  // Function to get current week number
  function getCurrentWeek(): number {
    const currentDate = new Date();
    const startDate = new Date(currentDate.getFullYear(), 0, 1);
    const days = Math.floor((currentDate.getTime() - startDate.getTime()) / (24 * 60 * 60 * 1000));
    const weekNumber = Math.ceil((days + startDate.getDay() + 1) / 7);
    return weekNumber;
  }

  // Custom hook to fetch exact debnr data
  const useExactDebnrData = () => {
    return useQuery<ExactDebnr[], Error>({
      queryKey: ['admin', 'exactDebnr'],
      queryFn: async () => {
        try {
          const response = await api.get('/admin/getExactDebnr');
          return response.data;
        } catch (error) {
          throw formatApiError(error);
        }
      }
    });
  };

  // Fetch the exact debnr data
  const { data, isLoading, isError, error } = useExactDebnrData();

  // Function to export exact debnr csv
  const exportExactDebnrCsv = async () => {
    try {
      setExportSuccess(false);
      setExportError(null);
      
      const response = await api.get(`/admin/exportExactDebnrCsv?week_number=${weekNumber}&year=${year}`, {
        responseType: 'blob'
      });
      
      // Create a download link and trigger it
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `Self-billing-week-${year}-${weekNumber.toString().padStart(2, '0')}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      setExportSuccess(true);
      setConfirmDialogOpen(false);
    } catch (err) {
      console.error('Export error:', err);
      setExportError('Failed to export file. Please try again.');
      setConfirmDialogOpen(false);
    }
  };


  // Handle export button click
  const handleExportClick = () => {
    setConfirmDialogOpen(true);
  };

  // Handle week number change
  const handleWeekNumberChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(event.target.value);
    if (!isNaN(value) && value > 0 && value <= 53) {
      setWeekNumber(value);
    }
  };

  // Handle year change
  const handleYearChange = (event: SelectChangeEvent<number>) => {
    setYear(parseInt(event.target.value.toString()));
  };

  // Format currency
  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('nl-NL', {
      style: 'currency',
      currency: 'EUR'
    }).format(amount);
  };

  // Filter data based on search term
  const filteredData = data?.filter(item => 
    item.driver_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (item.exact_debnr_number && item.exact_debnr_number.toLowerCase().includes(searchTerm.toLowerCase()))
  ) || [];

  // Get available years for the selector (current year and 2 years back)
  const getYearOptions = () => {
    const currentYear = new Date().getFullYear();
    return [currentYear - 2, currentYear - 1, currentYear, currentYear + 1];
  };

  return (
    <Box>
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
            <Typography variant="h5">
              Exact Debnr Management
            </Typography>
            <Button
              variant="contained"
              color="primary"
              startIcon={<DownloadIcon />}
              onClick={handleExportClick}
            >
              Export CSV
            </Button>
          </Box>

          {exportSuccess && (
            <CustomAlert severity="success" sx={{ mb: 3 }}>
              Export successful! The file has been downloaded to your device.
            </CustomAlert>
          )}

          {exportError && (
            <CustomAlert severity="error" sx={{ mb: 3 }}>
              {exportError}
            </CustomAlert>
          )}

          <SearchField
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
          />

          {isLoading ? (
            <Box display="flex" justifyContent="center" p={3}>
              <CircularProgress />
            </Box>
          ) : isError ? (
            <CustomAlert severity="error">
              Error loading Exact Debnr data: {error instanceof Error ? error.message : 'Unknown error'}
            </CustomAlert>
          ) : (
            <TableContainer component={Paper}>
              <Table sx={{ minWidth: 650 }}>
                <TableHead>
                  <TableRow>
                    <TableCell>Driver</TableCell>
                    <TableCell>Exact Debnr</TableCell>
                    <TableCell align="right">Ride Price Sum</TableCell>
                    <TableCell align="right">Commission Bolt</TableCell>
                    <TableCell align="right">Commission TC</TableCell>
                    <TableCell align="right">Tips</TableCell>
                    <TableCell align="right">Card Terminal Value</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredData.length > 0 ? (
                    filteredData.map((item) => (
                      <TableRow key={item.bolt_driver_uuid} hover>
                        <TableCell>{item.driver_name}</TableCell>
                        <TableCell>
                          {item.exact_debnr_number || (
                            <Typography variant="body2" color="error">
                              Not assigned
                            </Typography>
                          )}
                        </TableCell>
                        <TableCell align="right">{formatCurrency(item.ride_price_sum)}</TableCell>
                        <TableCell align="right">{formatCurrency(item.commission_bolt)}</TableCell>
                        <TableCell align="right">{formatCurrency(item.commission_tc)}</TableCell>
                        <TableCell align="right">
                          {formatCurrency(item.tips_bolt + item.tips_mypos)}
                        </TableCell>
                        <TableCell align="right">{formatCurrency(item.card_terminal_value)}</TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell align="center">
                        No Exact Debnr data found
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </CardContent>
      </Card>

      {/* Export Confirmation Dialog */}
      <Dialog
        open={confirmDialogOpen}
        onClose={() => setConfirmDialogOpen(false)}
      >
        <DialogTitle>Confirm Export</DialogTitle>
        <DialogContent>
          <DialogContentText sx={{ mb: 2 }}>
            You are about to export the Exact Debnr data as a CSV file. Please confirm the week number and year for the export:
          </DialogContentText>
          
          <Divider sx={{ mb: 3 }} />
          
          <Grid2 container spacing={2}>
            <Grid2 item size={{ xs: 12, sm: 6 }}>
              <TextField
                fullWidth
                label="Week Number"
                type="number"
                value={weekNumber}
                onChange={handleWeekNumberChange}
              />
            </Grid2>
            <Grid2 item size={{ xs: 12, sm: 6 }} >
              <FormControl fullWidth>
                <InputLabel id="year-select-label">Year</InputLabel>
                <Select
                  labelId="year-select-label"
                  value={year}
                  onChange={(event) => handleYearChange(event)}
                  label="Year"
                >
                  {getYearOptions().map((year) => (
                    <MenuItem key={year} value={year}>{year}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid2>
          </Grid2>
          
          <CustomAlert severity="info" sx={{ mt: 3 }}>
            The export will include all drivers who have an Exact Debnr number assigned.
          </CustomAlert>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmDialogOpen(false)}>
            Cancel
          </Button>
          <Button onClick={exportExactDebnrCsv} variant="contained" color="primary">
            Export
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default AdminExactFilePage;
