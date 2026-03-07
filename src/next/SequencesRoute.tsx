import React from 'react';

import SequenceEditor from '../components/SequenceEditor';
import AppProviders from './AppProviders';

export default function SequencesRoute() {
  return (
    <AppProviders>
      <SequenceEditor />
    </AppProviders>
  );
}
