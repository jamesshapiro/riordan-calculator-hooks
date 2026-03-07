import React from 'react';

import Home from '../components/Home';
import AppProviders from './AppProviders';

export default function HomeRoute() {
  return (
    <AppProviders>
      <Home />
    </AppProviders>
  );
}
