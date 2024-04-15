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
      <Backdrop></Backdrop>
      <FlexColumnWrapper>
        <div>
          <Header />
        </div>
        <LeftDiv>
          <ModeComboBox />
        </LeftDiv>
        <FlexRowWrapper>
          <SequenceControlPanel />
          <TableWrapper>
            <tbody>
              <Sequence sequenceId={'g'} />
              <Sequence sequenceId={'f'} />
            </tbody>
          </TableWrapper>
        </FlexRowWrapper>
        <LeftDiv>
          <SubmitButton />
        </LeftDiv>
        <div>
          <Matrix />
        </div>
      </FlexColumnWrapper>
    </DataProvider>
  );
}

export default App;

const LeftDiv = styled.div`
  align-self: flex-start;
`;

const Backdrop = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  height: 100%;
  width: 100%;
  align-items: center;
  background-image: linear-gradient(
    var(--background-gradient-top),
    var(--background-gradient-bottom)
  );
  z-index: -10000;
`;

const FlexColumnWrapper = styled.div`
  padding-left: 35px;
  display: flex;
  flex-direction: column;
  height: 100%;
  width: 100%;
  align-items: center;
  padding-top: 70px;
`;

const FlexRowWrapper = styled.div`
  display: flex;
  flex-direction: row;
  align-self: flex-start;
`;

const TableWrapper = styled.table`
  margin-left: 50px;
  padding-top: 13px;
`;
