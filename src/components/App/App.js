import Header from '../Header';
import React from 'react';

import DataProvider from '../DataProvider';

function App() {
  return (
    <DataProvider>
      <div className="wrapper">
        <Header />
      </div>
    </DataProvider>
  );
}

export default App;
