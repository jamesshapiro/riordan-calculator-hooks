// Usage:

// import useKeydown from '../../hooks/use-keydown.hook'
// const handleEscape = React.useCallback(removeItems, []);
// useKeydown('Escape', handleEscape)

import React from 'react';

function useKeydown(key, callback) {
  React.useEffect(() => {
    function handleKeyDown(event) {
      if (event.code === key) {
        callback();
      }
    }

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [key, callback]);
}

export default useKeydown;
