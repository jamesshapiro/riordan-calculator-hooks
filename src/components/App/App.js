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
        <TableWrapper>
          <tbody>
            <Sequence initialSequence={INITIAL_SEQUENCE.f} sequenceId={'g'} />
            <Sequence initialSequence={INITIAL_SEQUENCE.g} sequenceId={'f'} />
          </tbody>
        </TableWrapper>
      </Wrapper>
    </DataProvider>
  );
}

export default App;

const Wrapper = styled.div`
  height: 100%;
`;

const TableWrapper = styled.table`
  width: min(70%, 1100px);
  margin: 0 auto;
  margin-top: 100px;
`;
