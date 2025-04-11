export const MIN_DATE = new Date(
  new Date().getFullYear() - 2,
  new Date().getMonth(),
  new Date().getDate()
).toISOString();

export const MAX_DATE = new Date(
  new Date().getFullYear() + 2,
  new Date().getMonth(),
  new Date().getDate()
).toISOString();

export const INITIAL_DATE = new Date(
  new Date().getFullYear(),
  new Date().getMonth(),
  new Date().getDate()
).toISOString();


export const CALENDAR_THEME = {
  light: {
    colors: {
      primary: '#1a73e8',
      onPrimary: '#fff',
      background: '#fff',
      onBackground: '#000',
      border: '#dadce0',
      text: '#000',
      surface: '#ECECEC',
    },
  },
  dark: {
    colors: {
      primary: '#4E98FA',
      onPrimary: '#FFF',
      background: '#1A1B21',
      onBackground: '#FFF',
      border: '#46464C',
      text: '#FFF',
      surface: '#545454',
    },
  },
};

export const STATUS_COLOR = (status: string) => {
  switch (status) {
    case 'Pending':
      return '#ff6d00';
    case 'Completed':
      return '#38b000';
    case 'Overdue':
      return 'red';
  }
};

export const HIGHLIGHT_DATES = {
  '5': { dayNumber: { color: '#38b000' }, dayName: { color: '#38b000' } },
  '6': { dayNumber: { color: '#ff6d00' }, dayName: { color: '#ff6d00' } },
  '7': { dayNumber: { color: 'red' }, dayName: { color: 'red' } },
};

export const recurrenceOptions = [
  { key: "", value: "None" },
  { key: "RRULE:FREQ=DAILY", value: "Daily" },
  { key: "RRULE:FREQ=WEEKLY", value: "Weekly" },
  { key: "RRULE:FREQ=MONTHLY", value: "Monthly" },
  { key: "RRULE:FREQ=YEARLY", value: "Yearly" },
];

export const statusOptions = [
  { key: "Pending", value: "Pending" },
  { key: "Completed", value: "Completed" },
  { key: "Overdue", value: "Overdue" },
];


