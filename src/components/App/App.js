import React from 'react';

import DataProvider from '../DataProvider';
import UserProvider from '../UserProvider';

import Backdrop from '../Backdrop';
import DeepBackdrop from '../DeepBackdrop';
import Home from '../Home';

function App() {
  return (
    <UserProvider>
      <DataProvider>
        <DeepBackdrop />
        <Backdrop />
        <Home />
      </DataProvider>
    </UserProvider>
  );
}

export default App;
