'use client';

import React from 'react';
import UserProvider from '@/components/UserProvider';
import DataProvider from '@/components/DataProvider';
import Backdrop from '@/components/Backdrop';
import DeepBackdrop from '@/components/DeepBackdrop';

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
