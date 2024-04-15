import Header from '../Header';
import React from 'react';

import DataProvider from '../DataProvider';
import Sequence from '../Sequence';
import SequenceControlPanel from '../SequenceControlPanel';

import styled from 'styled-components';
import ModeComboBox from '../ModeComboBox';
import SubmitButton from '../SubmitButton';
import Matrix from '../Matrix';

function App() {
  return (
    <DataProvider>
      <Wrapper>
        <Header />
        <ModeComboBox />
        <SequenceControlPanel />
        <TableWrapper>
          <tbody>
            <Sequence sequenceId={'g'} />
            <Sequence sequenceId={'f'} />
          </tbody>
        </TableWrapper>
        <SubmitButton />
        <Matrix />
      </Wrapper>
    </DataProvider>
  );
}

export default App;

const Wrapper = styled.div`
  padding-left: 35px;
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
  padding-top: 13px;
`;
