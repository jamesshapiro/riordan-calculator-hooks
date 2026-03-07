'use client';

import React from 'react';
import Header from '@/components/Header/Header';
import Sequence from '@/components/Sequence/Sequence';
import SequenceControlPanel from '@/components/SequenceControlPanel/SequenceControlPanel';
import { LayoutGroup } from 'framer-motion';
import styled from 'styled-components';
import ModeComboBox from '@/components/ModeComboBox/ModeComboBox';
import SubmitButton from '@/components/SubmitButton/SubmitButton';
import Matrix from '@/components/Matrix/Matrix';
import NavBar from '@/components/NavBar/NavBar';
import WindowControls from '@/components/WindowControls/WindowControls';
import MatrixHeader from '@/components/MatrixHeader/MatrixHeader';
import ShareDialog from '@/components/ShareDialog/ShareDialog';
import StarSequence from '@/components/StarSequence/StarSequence';
import OEISInput from '@/components/OEISInput/OEISInput';
import OEISSequenceDisplay from '@/components/OEISSequenceDisplay/OEISSequenceDisplay';
import { DataContext } from '@/components/DataProvider/DataProvider';
import { UserContext } from '@/components/UserProvider/UserProvider';

function Home() {
  const { fetchOeisSequence, oeisSequence, oeisSequenceId, isOeisLoading, oeisError, setOeisToF, setOeisToG } = React.useContext(DataContext);
  const { token } = React.useContext(UserContext);

  return (
    <FlexColumnWrapper>
      <NavBar />
      <HeaderDiv><Header isHome={true} /></HeaderDiv>
      <LeftDiv><ModeComboBox /></LeftDiv>
      <OEISContainer>
        <OEISInput onFetchSequence={(oeisId: string) => fetchOeisSequence(oeisId, token)} isLoading={isOeisLoading} />
        {oeisError && <ErrorMessage>{oeisError}</ErrorMessage>}
        <OEISSequenceDisplay sequence={oeisSequence} sequenceId={oeisSequenceId} onSetToF={setOeisToF} onSetToG={setOeisToG} isLoading={isOeisLoading} />
      </OEISContainer>
      <MatrixHeader />
      <ShareDialog />
      <FlexRowWrapper>
        <SequenceControlPanel />
        <LayoutGroup>
          <TableWrapper><tbody>
            <WindowControls />
            <Sequence sequenceId='g' />
            <Sequence sequenceId='f' />
          </tbody></TableWrapper>
        </LayoutGroup>
      </FlexRowWrapper>
      <FlexRowWrapper><LeftDiv><SubmitButton /></LeftDiv><CenterDiv><Matrix variant='default' /></CenterDiv></FlexRowWrapper>
      <FlexRowWrapper><LeftDiv /><CenterDiv><Matrix variant='inverse' /></CenterDiv></FlexRowWrapper>
      <FlexRowWrapper><LeftDiv /><CenterDiv><Matrix variant='stieltjes' /></CenterDiv></FlexRowWrapper>
      <FlexRowWrapper><LeftDiv /><CenterDiv><StarSequence variant='a' /></CenterDiv></FlexRowWrapper>
      <FlexRowWrapper><LeftDiv /><CenterDiv><StarSequence variant='b' /></CenterDiv></FlexRowWrapper>
      <FlexRowWrapper><LeftDiv /><CenterDiv><StarSequence variant='z' /></CenterDiv></FlexRowWrapper>
    </FlexColumnWrapper>
  );
}

export default Home;

const HeaderDiv = styled.div`align-self: flex-start; padding-left: 300px;`;
const LeftDiv = styled.div`align-self: flex-start;`;
const CenterDiv = styled.div`align-self: flex-start;`;
const OEISContainer = styled.div`align-self: flex-start; padding-left: 300px; margin: 10px 0;`;
const ErrorMessage = styled.div`color: #dc3545; font-size: 14px; margin: 5px 0;`;
const FlexColumnWrapper = styled.div`padding-left: 35px; display: flex; flex-direction: column; height: 100%; width: 100%; align-items: center; margin-left: 0px;`;
const FlexRowWrapper = styled.div`display: flex; flex-direction: row; align-self: flex-start;`;
const TableWrapper = styled.table`margin-left: 10px; padding-top: 13px;`;
