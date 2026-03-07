import React from 'react';

import History from '../components/History';
import AppProviders from './AppProviders';

export default function HistoryRoute() {
  return (
    <AppProviders>
      <History />
    </AppProviders>
  );
}
