'use client';

import React from 'react';
import UserProvider from '@/components/UserProvider/UserProvider';
import DataProvider from '@/components/DataProvider/DataProvider';
import Backdrop from '@/components/Backdrop/Backdrop';
import DeepBackdrop from '@/components/DeepBackdrop/DeepBackdrop';

export default function Providers({ children }: { children: React.ReactNode }) {
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
