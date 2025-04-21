import { useState, useRef, useEffect } from 'react';
import {
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  Button,
  Box,
  SelectChangeEvent,
  Popover,
  Typography,
} from '@mui/material';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';
import { format } from 'date-fns';

interface DateRangePickerProps {
  onSelect: (startDate: Date, endDate: Date) => void;
}

const DateRangePicker: React.FC<DateRangePickerProps> = ({ onSelect }) => {
  // Initialize with "last7" option
  const [selectedOption, setSelectedOption] = useState('last7');
  const [displayText, setDisplayText] = useState('Last 7 Days');

  // Initialize with last 7 days date range
  const endDate7Days = new Date();
  const startDate7Days = new Date();
  startDate7Days.setDate(endDate7Days.getDate() - 7);

  const [startDate, setStartDate] = useState<Date>(startDate7Days);
  const [endDate, setEndDate] = useState<Date>(endDate7Days);
  const [popoverOpen, setPopoverOpen] = useState(false);
  const selectRef = useRef<HTMLDivElement>(null);

  // Call onSelect with initial values when component mounts
  useEffect(() => {
    onSelect(startDate, endDate);
  }, []);

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

      setStartDate(start);
      setEndDate(end);
      setDisplayText('Last 7 Days');
      onSelect(start, end);
    } else if (value === 'last30') {
      // Calculate dates for last 30 days
      const end = new Date();
      const start = new Date();
      start.setDate(start.getDate() - 30);

      setStartDate(start);
      setEndDate(end);
      setDisplayText('Last 30 Days');
      onSelect(start, end);
    }
  };

  const handleApply = () => {
    const formattedRange = formatDateRange(startDate, endDate);
    setDisplayText(formattedRange);
    onSelect(startDate, endDate);
    setPopoverOpen(false);
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
            renderValue={() => displayText || 'Select Date Range'}
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
                },
              },
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
            <Typography variant="h6" sx={{ mb: 2 }}>
              Select Date Range
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <DatePicker
                label="From"
                value={startDate}
                onChange={newValue => {
                  if (newValue) setStartDate(newValue);
                }}
                format="yyyy-MM-dd"
                slots={{ textField: params => <TextField {...params} fullWidth /> }}
              />
              <DatePicker
                label="To"
                value={endDate}
                onChange={newValue => {
                  if (newValue) setEndDate(newValue);
                }}
                format="yyyy-MM-dd"
                slots={{ textField: params => <TextField {...params} fullWidth /> }}
              />
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2, gap: 1 }}>
              <Button onClick={handleClosePopover}>Cancel</Button>
              <Button variant="contained" onClick={handleApply}>
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
