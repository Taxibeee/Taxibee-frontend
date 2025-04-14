import { useState, useRef } from 'react';
import { FormControl, InputLabel, Select, MenuItem, TextField, Button, Box, SelectChangeEvent, Popover, Typography } from '@mui/material';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';
import { format } from 'date-fns';

interface DateRangePickerProps {
  onSelect?: (startDate: Date | null, endDate: Date | null, option: string) => void;
}

const DateRangePicker = ({ onSelect = () => {} }: DateRangePickerProps) => {
  const [selectedOption, setSelectedOption] = useState('');
  const [displayText, setDisplayText] = useState('');
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [popoverOpen, setPopoverOpen] = useState(false);
  const selectRef = useRef<HTMLDivElement>(null);

  const formatDateRange = (start: Date, end: Date) => {
    return `${format(start, 'MMM d, yyyy')} - ${format(end, 'MMM d, yyyy')}`;
  };

  const handleOptionChange = (event: SelectChangeEvent<string>) => {
    const value = event.target.value as string;
    setSelectedOption(value);
    
    if (value === 'custom') {
      // Always open popover for custom selection
      setPopoverOpen(true);
    } else if (value === 'last7') {
      // Calculate dates for last 7 days
      const end = new Date();
      const start = new Date();
      start.setDate(start.getDate() - 7);
      console.log('Selected last 7 days:', start, end);
      setStartDate(start);
      setEndDate(end);
      setDisplayText('Last 7 Days');
      onSelect(start, end, value);
    } else if (value === 'last30') {
      // Calculate dates for last 30 days
      const end = new Date();
      const start = new Date();
      start.setDate(start.getDate() - 30);
      console.log('Selected last 30 days:', start, end);
      setStartDate(start);
      setEndDate(end);
      setDisplayText('Last 30 Days');
      onSelect(start, end, value);
    }
  };

  // Separate handler just for opening the custom date picker
  const handleCustomClick = () => {
    setPopoverOpen(true);
  };

  const handleApply = () => {
    if (startDate && endDate) {
      const formattedRange = formatDateRange(startDate, endDate);
      setDisplayText(formattedRange);
      console.log('Custom date range selected:', startDate, endDate);
      onSelect(startDate, endDate, 'custom');
      setPopoverOpen(false);
    }
  };

  const handleClosePopover = () => {
    setPopoverOpen(false);
    // If user cancels without applying and there's no existing selection, reset to empty
    if (selectedOption === 'custom' && !displayText) {
      setSelectedOption('');
    }
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, width: 300 }}>
        <FormControl fullWidth ref={selectRef}>
          <InputLabel id="date-filter-label">Date Filter</InputLabel>
          <Select
            labelId="date-filter-label"
            value={selectedOption}
            label="Date Filter"
            onChange={handleOptionChange}
            renderValue={() => displayText || "Select Date Range"}
            MenuProps={{
              PaperProps: {
                onClick: (e: React.MouseEvent<HTMLDivElement>) => {
                  // Check if clicking on custom option
                  if (e.target instanceof HTMLElement) {
                    const menuItem = e.target.closest('[data-value="custom"]');
                    if (menuItem && selectedOption === 'custom') {
                      e.stopPropagation();
                      setTimeout(() => setPopoverOpen(true), 100);
                    }
                  }
                }
              }
            }}
          >
            <MenuItem value="last7">Last 7 Days</MenuItem>
            <MenuItem value="last30">Last 30 Days</MenuItem>
            <MenuItem value="custom">Custom Date Range</MenuItem>
          </Select>
        </FormControl>

        <Popover
          open={popoverOpen}
          anchorEl={selectRef.current}
          onClose={handleClosePopover}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'left',
          }}
          transformOrigin={{
            vertical: 'top',
            horizontal: 'left',
          }}
        >
          <Box sx={{ p: 2, width: 300 }}>
            <Typography variant="h6" sx={{ mb: 2 }}>Select Date Range</Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
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
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2, gap: 1 }}>
              <Button onClick={handleClosePopover}>Cancel</Button>
              <Button 
                variant="contained" 
                onClick={handleApply} 
                disabled={!startDate || !endDate}
              >
                Apply
              </Button>
            </Box>
          </Box>
        </Popover>
      </Box>
    </LocalizationProvider>
  );
};

export default DateRangePicker;