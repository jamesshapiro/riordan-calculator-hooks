import React from 'react';

import DataProvider from '../DataProvider';
import UserProvider from '../UserProvider';

import Backdrop from '../Backdrop';
import DeepBackdrop from '../DeepBackdrop';
import History from '../History';

import Home from '../Home';
import About from '../About';
import Papers from '../Papers';
import SequenceEditor from '../SequenceEditor';

function App() {
  const pathname =
    typeof window !== 'undefined' ? window.location.pathname : '/';
  const normalizedPath = pathname.endsWith('/') && pathname !== '/'
    ? pathname.slice(0, -1)
    : pathname;
  const routeMap = {
    '/': <Home />,
    '/about': <About />,
    '/papers': <Papers />,
    '/sequences': <SequenceEditor />,
    '/history': <History />,
  };
  const activeRoute = routeMap[normalizedPath] || <Home />;

  return (
    <UserProvider>
      <DataProvider>
        <DeepBackdrop />
        <Backdrop />
        {activeRoute}
      </DataProvider>
    </UserProvider>
  );
}

export default App;
