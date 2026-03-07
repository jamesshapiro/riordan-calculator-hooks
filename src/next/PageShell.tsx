import React from 'react';

import About from '../components/About';
import Backdrop from '../components/Backdrop';
import DataProvider from '../components/DataProvider';
import DeepBackdrop from '../components/DeepBackdrop';
import History from '../components/History';
import Home from '../components/Home';
import Papers from '../components/Papers';
import SequenceEditor from '../components/SequenceEditor';
import UserProvider from '../components/UserProvider';

const pageMap = {
  about: About,
  history: History,
  home: Home,
  papers: Papers,
  sequences: SequenceEditor,
};

export type PageName = keyof typeof pageMap;

type PageShellProps = {
  page: PageName;
};

export default function PageShell({ page }: PageShellProps) {
  const PageComponent = pageMap[page];

  return (
    <UserProvider>
      <DataProvider>
        <DeepBackdrop />
        <Backdrop />
        <PageComponent />
      </DataProvider>
    </UserProvider>
  );
}
