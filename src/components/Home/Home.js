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
    </FlexColumnWrapper>
  );
}

export default Home;

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
  margin: 16px 0;
`;

const ErrorMessage = styled.div`
  color: hsl(0, 60%, 45%);
  font-size: 13px;
  font-weight: 500;
  margin: 6px 0;
`;

const FlexColumnWrapper = styled.div`
  padding: 24px 40px 60px;
  display: flex;
  flex-direction: column;
  min-height: 100%;
  width: 100%;
  align-items: center;
  background-color: #ffffff;
`;

const FlexRowWrapper = styled.div`
  display: flex;
  flex-direction: row;
  align-self: flex-start;
`;

const TableWrapper = styled.table`
  margin-left: 12px;
  padding-top: 16px;
`;
