import React from 'react';

import Papers from '../components/Papers';
import AppProviders from './AppProviders';

export default function PapersRoute() {
  return (
    <AppProviders>
      <Papers />
    </AppProviders>
  );
}
