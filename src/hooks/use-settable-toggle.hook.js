import React from 'react';

function useSettableToggle(initialValue = false) {
  if (typeof initialValue !== 'boolean' && typeof initialValue !== 'function') {
    console.warn('Invalid type for useSettableToggle');
  }

  const [value, setValue] = React.useState(initialValue);

  function toggleValue(newValue) {
    if (typeof newValue === 'boolean') {
      setValue(newValue);
    } else {
      setValue((currentValue) => !currentValue);
    }
  }

  return [value, toggleValue];
}

export default useSettableToggle;
