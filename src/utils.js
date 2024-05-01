export const formatDate = (dateString) => {
  if (!dateString.endsWith('Z')) {
    dateString += 'Z';
  }
  const date = new Date(Date.parse(dateString));
  let userTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  let userLocale = navigator.language || navigator.languages[0];

  if (isNaN(date)) {
    return 'Invalid date string';
  }

  const dateOptions = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    timeZone: userTimeZone,
  };
  const timeOptions = {
    hour: 'numeric',
    minute: 'numeric',
    hour12: true,
    timeZone: userTimeZone,
  };

  const formattedDate = date.toLocaleString(userLocale, dateOptions);
  const formattedTime = date.toLocaleString(userLocale, timeOptions);

  return `${formattedDate}, ${formattedTime}`;
};

export const sample = (arr) => {
  return arr[Math.floor(Math.random() * arr.length)];
};

export const range = (start, end, step = 1) => {
  let output = [];
  if (typeof end === 'undefined') {
    end = start;
    start = 0;
  }
  for (let i = start; i < end; i += step) {
    output.push(i);
  }
  return output;
};

export const random = (min, max) =>
  Math.floor(Math.random() * (max - min)) + min;
