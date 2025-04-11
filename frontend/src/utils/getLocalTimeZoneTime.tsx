import { format } from 'date-fns';
import { toZonedTime } from 'date-fns-tz';

export const getLocalTimeWithTimezone = () => {
  // Get the current date and time
  const currentDate = new Date();

  // Get the local timezone
  const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;

  // Convert the current date to the local timezone
  const localTime = toZonedTime(currentDate, timeZone);

  // Format the local time with the required format "2025-03-14T09:00:00.000+02:00"
  const formattedTime = format(localTime, "yyyy-MM-dd'T'HH:mm:ss.SSSXXX");

  return formattedTime;
};