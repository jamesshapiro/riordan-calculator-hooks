import Header from '../Header';
import React from 'react';

import DataProvider from '../DataProvider';
import Sequence from '../Sequence';
import SequenceControlPanel from '../SequenceControlPanel';

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
  padding-top: 70px;
  background-image: linear-gradient(
    var(--background-gradient-top),
    var(--background-gradient-bottom)
  );
`;

const TableWrapper = styled.table`
  margin-left: 450px;
  margin-right: auto;
  padding-top: 50px;
`;
