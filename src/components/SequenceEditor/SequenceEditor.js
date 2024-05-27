import React from 'react';

import SequenceEditorSequence from '../SequenceEditorSequence';

import { UserContext } from '../UserProvider';
import { sequences } from '../../data';

import styled from 'styled-components';
import NavBar from '../NavBar';
import Header from '../Header';
import SequenceEditorSelectTable from '../SequenceEditorSelectTable';

const AUTH_ENDPOINT = process.env.REACT_APP_MATRIX_URL_AUTH;

function SequenceEditor() {
  const {
    userSequences,
    userDefaultHiddenSequences,
    setUserDefaultHiddenSequences,
    token,
  } = React.useContext(UserContext);
  const [selectedOption, setSelectedOption] = React.useState('default');

  const updateDefaults = async (sequenceId, displayOption) => {
    const URL =
      AUTH_ENDPOINT + `preset?sequence=${sequenceId}&display=${displayOption}`;
    const HEADERS = {
      'Content-Type': 'application/json',
      Authorization: token,
    };
    const request = new Request(URL, {
      method: 'PUT',
      headers: HEADERS,
      timeout: 100000,
    });
    fetch(request);
  };

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
  const EyeOffSVG = (
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
      className='lucide lucide-eye-off'
    >
      <path d='M9.88 9.88a3 3 0 1 0 4.24 4.24' />
      <path d='M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68' />
      <path d='M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61' />
      <line x1='2' x2='22' y1='2' y2='22' />
    </StyledSVG>
  );

  const EyeOnSVG = (
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

  const presetTable = (
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
          const sequenceId = sequence.id;
          const sequenceSequence = sequence.sequence;
          const displayTerms = getSequenceDisplay(
            sequenceSequence.slice(0, 15)
          );
          const hideIconPredicate =
            userDefaultHiddenSequences &&
            userDefaultHiddenSequences.includes(sequenceId);
          const icon = hideIconPredicate ? EyeOffSVG : EyeOnSVG;
          return (
            <tr key={index}>
              <TDWrapper>{sequenceName}</TDWrapper>
              <TDWrapper>{displayTerms}</TDWrapper>
              <TDWrapper>
                <Preview
                  onClick={() => {
                    if (userDefaultHiddenSequences.includes(sequenceId)) {
                      updateDefaults(sequenceId, 'true');
                      setUserDefaultHiddenSequences((oldValue) => {
                        const newValue = oldValue.filter(
                          (item) => item !== sequenceId
                        );
                        return newValue;
                      });
                    } else {
                      updateDefaults(sequenceId, 'false');
                      setUserDefaultHiddenSequences((oldValue) => {
                        const newValue = [...oldValue];
                        newValue.push(sequenceId);
                        return newValue;
                      });
                    }
                  }}
                >
                  {icon}
                </Preview>
              </TDWrapper>
            </tr>
          );
        })}
      </tbody>
    </Table>
  );

  return (
    <FlexColumnWrapper>
      <NavBar />
      <HeaderDiv>
        <Header />
      </HeaderDiv>
      <VerticalSpace />
      <SequenceEditorSelectTable
        selectedOption={selectedOption}
        setSelectedOption={setSelectedOption}
      />
      {selectedOption === 'default' ? presetTable : null}
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
  margin-top: 20px;
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
