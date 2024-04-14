import React from 'react';

// Note: replace "Generic" with the name of the thing being provided.
// For usage, see the "GenericContextUser" component.

export const GenericContext = React.createContext();

function GenericProvider({ children }) {
  const [items, setItems] = React.useState([]);

  function createItem(content, variant) {
    const nextItems = [
      ...items,
      {
        id: crypto.randomUUID(),
        content,
        variant
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
    <GenericContext.Provider
      value={{
        items,
        createItem,
        clearItem,
      }}
    >
      {children}
    </GenericContext.Provider>
  );
}

export default GenericProvider;
