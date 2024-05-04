import Header from '../Header';
import React from 'react';

import DataProvider from '../DataProvider';
import UserProvider from '../UserProvider';

import Sequence from '../Sequence';
import SequenceControlPanel from '../SequenceControlPanel';
import UserHistory from '../UserHistory/UserHistory';

import { LayoutGroup, motion } from 'framer-motion';

import styled from 'styled-components';
import ModeComboBox from '../ModeComboBox';
import SubmitButton from '../SubmitButton';
import Matrix from '../Matrix';
import Backdrop from '../Backdrop';
import DeepBackdrop from '../DeepBackdrop';
import NavBar from '../NavBar';
import WindowControls from '../WindowControls';
import MatrixHeader from '../MatrixHeader';
import SoundProvider from '../SoundProvider';
import StatsDisplay from '../StatsDisplay';

// import { withAuthenticator, Button, Heading } from '@aws-amplify/ui-react';
// import '@aws-amplify/ui-react/styles.css';

function App() {
  return (
    <UserProvider>
      <DataProvider>
        <SoundProvider>
          <DeepBackdrop />
          <Backdrop />
          <FlexColumnWrapper>
            <NavBar />
            <HeaderDiv>
              <Header />
            </HeaderDiv>
            <LeftDiv>
              <ModeComboBox />
            </LeftDiv>
            <MatrixHeader />
            <FlexRowWrapper>
              <SequenceControlPanel />
              <LayoutGroup>
                <TableWrapper>
                  <tbody>
                    <WindowControls />
                    <Sequence sequenceId={'g'} />
                    <Sequence sequenceId={'f'} />
                  </tbody>
                </TableWrapper>
              </LayoutGroup>
            </FlexRowWrapper>
            <FlexRowWrapper>
              <LeftDiv>
                <SubmitButton />
              </LeftDiv>
              <CenterDiv>
                <Matrix />
              </CenterDiv>
            </FlexRowWrapper>
            <UserHistory />
          </FlexColumnWrapper>
          <StatsDisplay />
        </SoundProvider>
      </DataProvider>
    </UserProvider>
  );
}

export default App;

const HeaderDiv = styled.div`
  align-self: flex-start;
  padding-left: 300px;
`;

const LeftDiv = styled.div`
  align-self: flex-start;
`;

const CenterDiv = styled.div`
  align-self: flex-start;
`;

const FlexColumnWrapper = styled.div`
  padding-left: 35px;
  display: flex;
  flex-direction: column;
  height: 100%;
  width: 100%;
  align-items: center;
  /* background-color: hsl(240, 40%, 90%); */
  margin-left: 0px;
`;

const FlexRowWrapper = styled.div`
  display: flex;
  flex-direction: row;
  align-self: flex-start;
`;

const TableWrapper = styled.table`
  margin-left: 10px;
  padding-top: 13px;
`;
