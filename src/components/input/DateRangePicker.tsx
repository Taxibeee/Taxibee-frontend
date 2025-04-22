import { useState, useRef, useEffect } from 'react';
import {
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  Button,
  SelectChangeEvent,
  Popover,
} from '@mui/material';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';
import { format } from 'date-fns';
import InfoItemWrapper from '../common/InfoItemWrapper';
import FlexWrapper from '../common/FlexWrapper';
import HeadingsWrapper from '../common/HeadingsWrapper';

interface DateRangePickerProps {
  onSelect: (startDate: Date, endDate: Date) => void;
}

const DateRangePicker: React.FC<DateRangePickerProps> = ({ onSelect }) => {
  // Initialize with "currentWeek" option
  const [selectedOption, setSelectedOption] = useState('currentWeek');
  const [displayText, setDisplayText] = useState('Current Week');

  // Initialize with current week date range
  const today = new Date();
  const startDateCurrentWeek = new Date(today);
  const endDateCurrentWeek = new Date(today);
  const dayOfWeek = today.getDay(); // 0 (Sunday) to 6 (Saturday)
  const diffToMonday = dayOfWeek === 0 ? -6 : 1 - dayOfWeek; // Adjust for Monday
  startDateCurrentWeek.setDate(today.getDate() + diffToMonday);
  endDateCurrentWeek.setDate(startDateCurrentWeek.getDate() + 6);

  const [startDate, setStartDate] = useState<Date>(startDateCurrentWeek);
  const [endDate, setEndDate] = useState<Date>(endDateCurrentWeek);
  const [popoverOpen, setPopoverOpen] = useState(false);
  const selectRef = useRef<HTMLDivElement>(null);

  // Call onSelect with initial values when component mounts
  useEffect(() => {
    onSelect(startDate, endDate);
  }, [startDate, endDate, onSelect]);

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
    } else if (value === 'currentWeek') {
      // Calculate dates for the current week (Monday to Sunday)
      const today = new Date();
      const start = new Date(today);
      const end = new Date(today);
      const dayOfWeek = today.getDay(); // 0 (Sunday) to 6 (Saturday)
      const diffToMonday = dayOfWeek === 0 ? -6 : 1 - dayOfWeek; // Adjust for Monday
      start.setDate(today.getDate() + diffToMonday);
      end.setDate(start.getDate() + 6);

      setStartDate(start);
      setEndDate(end);
      setDisplayText('Current Week');
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
      <FlexWrapper gap="md" direction="vertical" sx={{ width: 300 }}>
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
            <MenuItem value="currentWeek">Current Week</MenuItem>
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
          <FlexWrapper gap="md" direction="vertical" sx={{ p: 2, width: 300 }}>
            <FlexWrapper gap="xs" direction="vertical">
              <HeadingsWrapper text="Select Date Range" type="h6" />
              <InfoItemWrapper text="The date format is YYYY-MM-DD" size="sm" />
            </FlexWrapper>
            <FlexWrapper gap="sm" direction="vertical">
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
            </FlexWrapper>
            <FlexWrapper gap="sm" direction="horizontal" sx={{ justifyContent: 'flex-end' }}>
              <Button onClick={handleClosePopover}>Cancel</Button>
              <Button variant="contained" onClick={handleApply}>
                Apply
              </Button>
            </FlexWrapper>
          </FlexWrapper>
        </Popover>
      </FlexWrapper>
    </LocalizationProvider>
  );
};

export default DateRangePicker;
