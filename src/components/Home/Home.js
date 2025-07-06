import React from 'react';

import Header from '../Header';

import Sequence from '../Sequence';
import SequenceControlPanel from '../SequenceControlPanel';
import UserHistory from '../UserHistory/UserHistory';

import { LayoutGroup } from 'framer-motion';

import styled from 'styled-components';
import ModeComboBox from '../ModeComboBox';
import SubmitButton from '../SubmitButton';
import Matrix from '../Matrix';
import NavBar from '../NavBar';
import WindowControls from '../WindowControls';
import MatrixHeader from '../MatrixHeader';
import StatsDisplay from '../StatsDisplay';
import ShareDialog from '../ShareDialog';
import StarSequence from '../StarSequence';
import OEISInput from '../OEISInput/OEISInput';
import OEISSequenceDisplay from '../OEISSequenceDisplay/OEISSequenceDisplay';

import { Link } from 'react-router-dom';
import { DataContext } from '../DataProvider';
import { UserContext } from '../UserProvider';

function Home() {
  const {
    fetchOeisSequence,
    oeisSequence,
    oeisSequenceId,
    isOeisLoading,
    oeisError,
    setOeisToF,
    setOeisToG,
  } = React.useContext(DataContext);

  const { token } = React.useContext(UserContext);

  return (
    <FlexColumnWrapper>
      <NavBar />
      <HeaderDiv>
        <Header isHome={true} />
      </HeaderDiv>
      <LeftDiv>
        <ModeComboBox />
      </LeftDiv>
      <OEISContainer>
        <OEISInput
          onFetchSequence={(oeisId) => fetchOeisSequence(oeisId, token)}
          isLoading={isOeisLoading}
        />
        {oeisError && <ErrorMessage>{oeisError}</ErrorMessage>}
        <OEISSequenceDisplay
          sequence={oeisSequence}
          sequenceId={oeisSequenceId}
          onSetToF={setOeisToF}
          onSetToG={setOeisToG}
          isLoading={isOeisLoading}
        />
      </OEISContainer>
      <MatrixHeader />
      <ShareDialog />
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
          <Matrix variant='default' />
        </CenterDiv>
      </FlexRowWrapper>
      <FlexRowWrapper>
        <LeftDiv>{/* <SubmitButton /> */}</LeftDiv>
        <CenterDiv>
          <Matrix variant='inverse' />
        </CenterDiv>
      </FlexRowWrapper>
      <FlexRowWrapper>
        <LeftDiv>{/* <SubmitButton /> */}</LeftDiv>
        <CenterDiv>
          <Matrix variant='stieltjes' />
        </CenterDiv>
      </FlexRowWrapper>
      <FlexRowWrapper>
        <LeftDiv>{/* <SubmitButton /> */}</LeftDiv>
        <CenterDiv>
          <StarSequence variant='a' />
        </CenterDiv>
      </FlexRowWrapper>
      <FlexRowWrapper>
        <LeftDiv>{/* <SubmitButton /> */}</LeftDiv>
        <CenterDiv>
          <StarSequence variant='b' />
        </CenterDiv>
      </FlexRowWrapper>
      <FlexRowWrapper>
        <LeftDiv>{/* <SubmitButton /> */}</LeftDiv>
        <CenterDiv>
          <StarSequence variant='z' />
        </CenterDiv>
      </FlexRowWrapper>
      {/* <StatsDisplay /> */}
    </FlexColumnWrapper>
  );
}

export default Home;

const BottomSpace = styled.div`
  height: 100px;
`;

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

const OEISContainer = styled.div`
  align-self: flex-start;
  padding-left: 300px;
  margin: 10px 0;
`;

const ErrorMessage = styled.div`
  color: #dc3545;
  font-size: 14px;
  margin: 5px 0;
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
