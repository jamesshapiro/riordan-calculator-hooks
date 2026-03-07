import type { Metadata } from 'next';
import StyledComponentsRegistry from '@/lib/styled-components-registry';
import './reset.css';
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
          {children}
        </StyledComponentsRegistry>
      </body>
    </html>
  );
}
