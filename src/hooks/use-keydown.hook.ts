import { useEffect } from 'react';

function useKeydown(
  key: string,
  preventCondition: boolean,
  callback: (event: KeyboardEvent, bothShiftAndTabWerePressed: boolean) => void
) {
  useEffect(() => {
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
  }, [key, callback, preventCondition]);
}

export default useKeydown;
