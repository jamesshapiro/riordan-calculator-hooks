import type { Metadata } from 'next';
import StyledComponentsRegistry from '@/lib/registry';
import Providers from './providers';
import './globals.css';

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
          <Providers>{children}</Providers>
        </StyledComponentsRegistry>
      </body>
    </html>
  );
}
