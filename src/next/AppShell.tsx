import type { ReactNode } from 'react';

import Backdrop from '../components/Backdrop';
import DataProvider from '../components/DataProvider';
import DeepBackdrop from '../components/DeepBackdrop';
import UserProvider from '../components/UserProvider';

type AppShellProps = {
  children: ReactNode;
};

export default function AppShell({ children }: AppShellProps) {
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
