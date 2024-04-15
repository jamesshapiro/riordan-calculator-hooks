import Header from '../Header';
import React from 'react';

import DataProvider from '../DataProvider';
import Sequence from '../Sequence';
import SequenceControlPanel from '../SequenceControlPanel';

import { INITIAL_SEQUENCE } from '../../constants';

import styled from 'styled-components';

function App() {
  return (
    <DataProvider>
      <Wrapper>
        <Header />
        <SequenceControlPanel />
        <TableWrapper>
          <tbody>
            <Sequence sequenceId={'g'} />
            <Sequence sequenceId={'f'} />
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
  margin-left: 200px;
  margin-right: auto;
  margin-top: 100px;
`;
