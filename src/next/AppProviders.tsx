import React, { type ReactNode } from 'react';

import DataProvider from '../components/DataProvider';
import UserProvider from '../components/UserProvider';
import Backdrop from '../components/Backdrop';
import DeepBackdrop from '../components/DeepBackdrop';

type AppProvidersProps = {
  children: ReactNode;
};

export default function AppProviders({ children }: AppProvidersProps) {
  return (
    <UserProvider>
      <DataProvider>
        <DeepBackdrop />
        <Backdrop />
        {children}
      </DataProvider>
    </UserProvider>
  );
}
