import React from 'react';

function useKeydown(key: string, preventCondition: boolean, callback: (event: KeyboardEvent, shiftPressed: boolean) => void) {
  React.useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
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
