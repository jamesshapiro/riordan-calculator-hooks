import type { ReactNode } from 'react';
import Backdrop from '../components/Backdrop';
import DataProvider from '../components/DataProvider';
import DeepBackdrop from '../components/DeepBackdrop';
import UserProvider from '../components/UserProvider';

type PageLayoutProps = {
  children: ReactNode;
};

export default function PageLayout({ children }: PageLayoutProps) {
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
