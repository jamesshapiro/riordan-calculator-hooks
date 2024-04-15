import React from 'react';

// Note: replace "Data" with the name of the thing being provided.
// For usage, see the "DataContextUser" component.

import useKeydown from '../../hooks/use-keydown.hook';

export const DataContext = React.createContext();

function DataProvider({ children }) {
  const randomItem = 'random item';
  const [sequenceLength, setSequenceLength] = React.useState(11);
  const [items, setItems] = React.useState([]);

  function tabFocus() {
    console.log('tab registered!');
  }

  const handleTab = React.useCallback(tabFocus, []);
  useKeydown('Tab', handleTab);

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
      }}
    >
      {children}
    </DataContext.Provider>
  );
}

export default DataProvider;
