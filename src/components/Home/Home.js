import React from 'react';

import Header from '../Header';

import Sequence from '../Sequence';
import SequenceControlPanel from '../SequenceControlPanel';
import { LayoutGroup } from 'framer-motion';

import styled from 'styled-components';
import ModeComboBox from '../ModeComboBox';
import SubmitButton from '../SubmitButton';
import Matrix from '../Matrix';
import NavBar from '../NavBar';
import WindowControls from '../WindowControls';
import MatrixHeader from '../MatrixHeader';
import ShareDialog from '../ShareDialog';
import StarSequence from '../StarSequence';
import OEISInput from '../OEISInput/OEISInput';
import OEISSequenceDisplay from '../OEISSequenceDisplay/OEISSequenceDisplay';

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
      <InputSection>
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
      </InputSection>
      <ComputeRow>
        <SubmitButton />
      </ComputeRow>
      <MatrixResultsSection>
        <Matrix variant='default' />
        <Matrix variant='inverse' />
        <Matrix variant='stieltjes' />
        <StarSequence variant='a' />
        <StarSequence variant='b' />
        <StarSequence variant='z' />
      </MatrixResultsSection>
      <BottomSpacer />
    </FlexColumnWrapper>
  );
}

export default Home;

const HeaderDiv = styled.div`
  align-self: flex-start;
  padding-left: 300px;
  margin-top: 8px;
`;

const LeftDiv = styled.div`
  align-self: flex-start;
`;

const OEISContainer = styled.div`
  align-self: flex-start;
  padding-left: 300px;
  margin: 12px 0;
`;

const ErrorMessage = styled.div`
  color: #c45340;
  font-size: 13px;
  margin: 6px 0;
  font-weight: 500;
`;

const FlexColumnWrapper = styled.div`
  padding-left: 35px;
  display: flex;
  flex-direction: column;
  height: 100%;
  width: 100%;
  align-items: center;
  margin-left: 0px;
`;

const InputSection = styled.div`
  display: flex;
  flex-direction: row;
  align-self: flex-start;
`;

const ComputeRow = styled.div`
  align-self: flex-start;
  padding-left: 0;
  margin-top: 16px;
  margin-bottom: 8px;
`;

const MatrixResultsSection = styled.div`
  align-self: flex-start;
  display: flex;
  flex-direction: column;
  width: calc(100% - 35px);
  max-width: 100%;
  padding-bottom: 24px;
`;

const BottomSpacer = styled.div`
  height: 80px;
`;

const TableWrapper = styled.table`
  margin-left: 10px;
  padding-top: 13px;
`;
