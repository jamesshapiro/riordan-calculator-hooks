import type { Metadata } from 'next';
import StyledComponentsRegistry from '../lib/styled-components-registry';
import UserProvider from '../components/UserProvider/UserProvider';
import DataProvider from '../components/DataProvider/DataProvider';
import Backdrop from '../components/Backdrop/Backdrop';
import DeepBackdrop from '../components/DeepBackdrop/DeepBackdrop';
import '../reset.css';
import '../styles.css';

export const metadata: Metadata = {
  title: 'Riordan Calculator',
  icons: {
    icon: '/favicon.png',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <StyledComponentsRegistry>
          <UserProvider>
            <DataProvider>
              <DeepBackdrop />
              <Backdrop />
              {children}
            </DataProvider>
          </UserProvider>
        </StyledComponentsRegistry>
      </body>
    </html>
  );
}
