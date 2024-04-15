import Header from '../Header';
import React from 'react';

import DataProvider from '../DataProvider';
import Sequence from '../Sequence';

import { INITIAL_SEQUENCE } from '../../constants';

import styled from 'styled-components';

function App() {
  return (
    <DataProvider>
      <Wrapper>
        <Header />
        <Sequence initialSequence={INITIAL_SEQUENCE.f} />
        <Sequence initialSequence={INITIAL_SEQUENCE.g} />
      </Wrapper>
    </DataProvider>
  );
}

export default App;

const Wrapper = styled.div`
  height: 100%;
`;
