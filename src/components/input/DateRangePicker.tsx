import { useState } from 'react';
import { FormControl, InputLabel, Select, MenuItem, TextField, Button, Box, SelectChangeEvent } from '@mui/material';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';

const DateRangePicker = () => {
  const [selectedOption, setSelectedOption] = useState('');
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);

  const handleOptionChange = (event: SelectChangeEvent<string>) => {
    setSelectedOption(event.target.value as string);
    if (event.target.value !== 'custom') {
      setStartDate(null);
      setEndDate(null);
    }
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, width: 300 }}>

        <FormControl fullWidth>
          <InputLabel id="date-filter-label">Date Filter</InputLabel>
          <Select
            labelId="date-filter-label"
            value={selectedOption}
            label="Date Filter"
            onChange={handleOptionChange}
          >
            <MenuItem value="last7">Last 7 Days</MenuItem>
            <MenuItem value="last30">Last 30 Days</MenuItem>
            <MenuItem value="custom">Custom Date Range</MenuItem>
          </Select>
        </FormControl>

        {selectedOption === 'custom' && (
          <Box sx={{ display: 'flex', gap: 2 }}>
            <DatePicker
              label="From"
              value={startDate}
              onChange={(newValue) => setStartDate(newValue)}
              slots={{ textField: (params) => <TextField {...params} fullWidth /> }}
            />
            <DatePicker
              label="To"
              value={endDate}
              onChange={(newValue) => setEndDate(newValue)}
              slots={{ textField: (params) => <TextField {...params} fullWidth /> }}
            />
          </Box>
        )}

        {/* Apply button for later logic */}
        <Button variant="contained" disabled={selectedOption === 'custom' && (!startDate || !endDate)}>
          Apply Filter
        </Button>

      </Box>
    </LocalizationProvider>
  );
};

export default DateRangePicker;
