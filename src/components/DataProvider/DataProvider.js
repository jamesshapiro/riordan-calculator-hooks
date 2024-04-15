import React from 'react';

// Note: replace "Data" with the name of the thing being provided.
// For usage, see the "DataContextUser" component.

import useKeydown from '../../hooks/use-keydown.hook';

export const DataContext = React.createContext();

function DataProvider({ children }) {
  const randomItem = 'random item';
  const [sequenceLength, setSequenceLength] = React.useState(11);
  const [items, setItems] = React.useState([]);
  const [targetBoxIndex, setTargetBoxIndex] = React.useState(-1);

  function tabFocus(event, shiftWasPressed) {
    const increment = shiftWasPressed ? -1 : 1;
    setTargetBoxIndex((oldValue) => {
      let result = (oldValue + increment) % (sequenceLength * 2);
      if (result < 0) {
        result += sequenceLength * 2;
      }
      console.log(result);
      return result;
    });
  }

  // const handleTab = React.useCallback(tabFocus, []);
  useKeydown('Tab', (event, shiftWasPressed) =>
    tabFocus(event, shiftWasPressed)
  );

  function createItem(content, variant) {
    const nextItems = [
      ...items,
      {
        id: crypto.randomUUID(),
        content,
        variant,
      },
    ];

    setItems(nextItems);
  }

  function clearItem(id) {
    const nextItems = items.filter((item) => {
      return item.id !== id;
    });
    setItems(nextItems);
  }

  return (
    <DataContext.Provider
      value={{
        items,
        createItem,
        clearItem,
        randomItem,
        sequenceLength,
        setSequenceLength,
        targetBoxIndex,
        setTargetBoxIndex,
      }}
    >
      {children}
    </DataContext.Provider>
  );
}

export default DataProvider;
