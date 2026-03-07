export const formatDate = (dateString: string): string => {
  if (!dateString.endsWith('Z')) {
    dateString += 'Z';
  }
  const date = new Date(Date.parse(dateString));
  let userTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  let userLocale = navigator.language || navigator.languages[0];

  if (isNaN(date.getTime())) {
    return 'Invalid date string';
  }

  const dateOptions: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    timeZone: userTimeZone,
  };
  const timeOptions: Intl.DateTimeFormatOptions = {
    hour: 'numeric',
    minute: 'numeric',
    hour12: true,
    timeZone: userTimeZone,
  };

  const formattedDate = date.toLocaleString(userLocale, dateOptions);
  const formattedTime = date.toLocaleString(userLocale, timeOptions);

  return `${formattedDate}, ${formattedTime}`;
};

export const range = (start: number, end?: number, step: number = 1): number[] => {
  let output: number[] = [];
  if (typeof end === 'undefined') {
    end = start;
    start = 0;
  }
  for (let i = start; i < end; i += step) {
    output.push(i);
  }
  return output;
};
