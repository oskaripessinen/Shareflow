// Get current month (1-12)
export const getCurrentMonth = (): number => {
  return new Date().getMonth() + 1;
};

// Get current year
export const getCurrentYear = (): number => {
  return new Date().getFullYear();
};

// Format date to display format
export const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
};

// Get month name
export const getMonthName = (month: number): string => {
  const months = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ];
  return months[month - 1];
};

// Get month options for dropdowns
export const getMonthOptions = () => {
  return [
    { label: 'January', value: 1 },
    { label: 'February', value: 2 },
    { label: 'March', value: 3 },
    { label: 'April', value: 4 },
    { label: 'May', value: 5 },
    { label: 'June', value: 6 },
    { label: 'July', value: 7 },
    { label: 'August', value: 8 },
    { label: 'September', value: 9 },
    { label: 'October', value: 10 },
    { label: 'November', value: 11 },
    { label: 'December', value: 12 },
  ];
};

// Get year options for dropdowns (current year and next 5 years)
export const getYearOptions = () => {
  const currentYear = getCurrentYear();
  return Array.from({ length: 6 }, (_, i) => ({
    label: String(currentYear + i),
    value: currentYear + i,
  }));
};