import React from 'react';

import SequenceEditorSequence from '../SequenceEditorSequence';

import { sequences } from '../../data';

import styled from 'styled-components';
import NavBar from '../NavBar';
import Header from '../Header';

function SequenceEditor() {
  function getSequenceDisplay(sequenceTerms) {
    return [...sequenceTerms, '...'].map((term, index) => {
      if (term.toString().length < 6) {
        return (
          <MiniNumberBoxWrapper key={`term-${index}`}>
            <InnerContainer>
              <InnerElement>{term}</InnerElement>
            </InnerContainer>
          </MiniNumberBoxWrapper>
        );
      } else {
        return null;
      }
    });
  }
  const SearchSVG = (
    <StyledSVG
      xmlns='http://www.w3.org/2000/svg'
      width='24'
      height='24'
      viewBox='0 0 24 24'
      fill='none'
      stroke='currentColor'
      strokeWidth='2'
      strokeLinecap='round'
      strokeLinejoin='round'
      className='lucide lucide-eye'
    >
      <path d='M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z' />
      <circle cx='12' cy='12' r='3' />
    </StyledSVG>
  );

  return (
    <FlexColumnWrapper>
      <NavBar />
      <HeaderDiv>
        <Header />
      </HeaderDiv>
      <VerticalSpace />
      {/* {sequences.map((sequence, index) => {
        console.log(sequence);
        return (
          <>
            <p></p>
            <SequenceEditorSequence
              name={sequence.name}
              key={`seq-${index}`}
              sequenceValues={sequence.sequence}
            />
          </>
        );
      })} */}
      <Table>
        <thead>
          <tr>
            <TDWrapper>Title</TDWrapper>
            <TDWrapper>Sequence</TDWrapper>
            <TDWrapper>Hide/Show</TDWrapper>
          </tr>
        </thead>
        <tbody>
          {sequences.map((sequence, index) => {
            const sequenceName = sequence.name;
            const sequenceSequence = sequence.sequence;
            const displayTerms = getSequenceDisplay(
              sequenceSequence.slice(0, 15)
            );
            return (
              <tr key={index}>
                <TDWrapper>{sequenceName}</TDWrapper>
                <TDWrapper>{displayTerms}</TDWrapper>
                <TDWrapper>
                  <Preview>{SearchSVG}</Preview>
                </TDWrapper>
              </tr>
            );
          })}
        </tbody>
      </Table>
    </FlexColumnWrapper>
  );
}

export default SequenceEditor;

const VerticalSpace = styled.div`
  min-height: 50px;
`;

const Wrapper = styled.div`
  margin-left: 10px;
  margin-top: 10px;
  z-index: 10;
`;

const HeaderDiv = styled.div`
  align-self: flex-start;
  padding-left: 300px;
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

const StyledSVG = styled.svg`
  cursor: pointer;
`;

const Preview = styled.div`
  margin-left: 15px;
`;

const Table = styled.table`
  background-color: var(--user-history-cell-background);
  border-collapse: collapse;
  border: 1.5px solid var(--mini-number-box-border-color);
  width: fit-content;
  margin-top: 200px;
  margin-right: 30px;
  margin-bottom: 300px;
`;
const TDWrapper = styled.td`
  border: 1px solid var(--mini-number-box-border-color);
  padding: 8px;
`;

const Permalink = styled.a`
  text-decoration: none;
  padding-left: 20px;

  &:visited {
    color: blue;
    text-decoration: none;
  }
`;

const MiniNumberBoxWrapper = styled.div`
  position: relative;
  display: inline-block;
  cursor: ${(p) => (p.disabled ? 'default' : 'text')};
  background-color: var(--mini-number-box-background-color);
  border-radius: var(--mini-number-box-border-radius);
  min-width: var(--mini-number-box-width);
  height: var(--mini-number-box-height);
  margin: 1px;
  border: 1px solid var(--mini-number-box-border-color);
  z-index: 1;
  /* padding: 10%; */
`;

const InnerContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  font-family: 'Lato', sans-serif;
  color: var(--mini-number-box-font-color);
  color: var(--mini-number-box-font-color);
  width: fit-content;
  height: 100%;
  width: 100%;
`;

const InnerElement = styled.p`
  width: fit-content;
  font-size: clamp(
    ${(p) => p.$minfontsize},
    ${(p) => p.fontSize},
    ${(p) => p.$maxfontsize}
  );
`;

const MatrixTable = styled.table`
  border-spacing: 0px;
  border-collapse: collapse;
`;

const MatrixRow = styled.tr``;

const MatrixCell = styled.td`
  border: 1px solid var(--number-box-border-color);
  min-width: 60px;
  height: 50px;
  text-align: center;
  background-color: ${(p) =>
    p.$col === 0 || p.$row === 0
      ? 'var(--select-td-background)'
      : p.$row > 0 && p.$col > p.$row
        ? 'var(--matrix-cell-background-color)'
        : 'black'};

  background-image: ${(p) =>
    p.$col === 0 || p.$row === 0
      ? 'revert'
      : p.$col > p.$row
        ? 'var(--box-gradient)'
        : 'revert'};
  color: ${(p) =>
    p.$row > 0 && p.$col > p.$row ? 'var(--number-box-font-color)' : 'white'};
`;
