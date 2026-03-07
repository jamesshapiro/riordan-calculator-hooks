import type { AppProps } from 'next/app';
import Head from 'next/head';

import UserProvider from '../components/UserProvider';
import DataProvider from '../components/DataProvider';
import Backdrop from '../components/Backdrop';
import DeepBackdrop from '../components/DeepBackdrop';

import '../reset.css';
import '../styles.css';
import '../components/AuthDialog/styles.css';
import '../components/ConfirmDeleteQueryDialog/styles.css';
import '../components/SequenceEditorConfirmDeleteSequenceDialog/styles.css';
import '../components/ShareDialog/styles.css';
import '../components/TooltipWrapper/styles.css';
import '../components/UserDropdown/styles.css';
import '../components/SequenceComboBox/style.css';

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>Riordan Calculator</title>
      </Head>
      <UserProvider>
        <DataProvider>
          <DeepBackdrop />
          <Backdrop />
          <Component {...pageProps} />
        </DataProvider>
      </UserProvider>
    </>
  );
}
