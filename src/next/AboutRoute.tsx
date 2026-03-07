import React from 'react';

import About from '../components/About';
import AppProviders from './AppProviders';

export default function AboutRoute() {
  return (
    <AppProviders>
      <About />
    </AppProviders>
  );
}
