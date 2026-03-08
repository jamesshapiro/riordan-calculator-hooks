// Usage:

// import useKeydown from '../../hooks/use-keydown.hook'
// const handleEscape = React.useCallback(removeItems, []);
// useKeydown('Escape', handleEscape)

import React from 'react';

function useKeydown(key, preventCondition, callback) {
  React.useEffect(() => {
    function handleKeyDown(event) {
      if (event.code === key) {
        if (preventCondition) {
          event.preventDefault();
        }
        if (event.shiftKey) {
          callback(event, true);
        } else {
          callback(event, false);
        }
      }
    }

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [key, callback]);
}

export default useKeydown;
