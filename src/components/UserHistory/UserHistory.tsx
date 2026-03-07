'use client';

import React from 'react';

import styled from 'styled-components';
import Link from 'next/link';
import { UserContext } from '../UserProvider/UserProvider';
import ConfirmDeleteQueryDialog from '../ConfirmDeleteQueryDialog/ConfirmDeleteQueryDialog';

import TooltipWrapper from '../TooltipWrapper/TooltipWrapper';

import { formatDate } from '../../utils';

function UserHistory() {
  const { userQueries, deleteQuery } = React.useContext(UserContext);
  if (userQueries.length < 1) {
    return <></>;
  }

  function getSequenceDisplay(sequenceTerms: (string | number)[]) {
    return [...sequenceTerms, '...'].map((term, index) => {
      return (
        <MiniNumberBoxWrapper key={`term-${index}`}>
          <InnerContainer>
            <InnerElement>{term}</InnerElement>
          </InnerContainer>
        </MiniNumberBoxWrapper>
      );
    });
  }

  const linkSVG24 = (
    <StyledSVG
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="lucide lucide-link"
    >
      <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
      <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
    </StyledSVG>
  );

  const SearchSVG = (
    <StyledSVG
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="lucide lucide-eye"
    >
      <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
      <circle cx="12" cy="12" r="3" />
    </StyledSVG>
  );

  return (
    <Wrapper>
      <thead>
        <tr>
          <TDWrapper>Permalink</TDWrapper>
          <TDWrapper>Title</TDWrapper>
          <TDWrapper>Date</TDWrapper>
          <TDWrapper>G</TDWrapper>
          <TDWrapper>F</TDWrapper>
          <TDWrapper>Preview</TDWrapper>
          <TDWrapper>Delete</TDWrapper>
        </tr>
      </thead>
      <tbody>
        {userQueries.map((query, index) => {
          const displayMatrix = JSON.parse(query['MATRIX_DATA']['S'])[
            'riordan group elem'
          ];

          const matrixElem = (
            <MatrixTable>
              <tbody key="matrixbody">
                {displayMatrix.map((row: number[][], rowIndex: number) => {
                  return (
                    <tr key={`row${rowIndex}`}>
                      {row.map((num, colIndex) => {
                        return (
                          <MatrixCell
                            $row={rowIndex + 1}
                            $col={colIndex + 1}
                            key={`${rowIndex},${colIndex + 1}`}
                          >
                            {num}
                          </MatrixCell>
                        );
                      })}
                    </tr>
                  );
                })}
              </tbody>
            </MatrixTable>
          );
          const previewElem = (
            <TooltipWrapper
              message={matrixElem}
              side="top"
              sideOffset={5}
              alignOffset="-500px"
              arrowshiftX="0"
              arrowshiftY="0"
              omitInfo={true}
            >
              {SearchSVG}
            </TooltipWrapper>
          );

          const matrixTitle = query.TITLE ? query.TITLE.S : '(none)';
          const displayGTerms = getSequenceDisplay(
            JSON.parse(query.G_SEQUENCE.S).slice(0, 10)
          );
          const displayFTerms = getSequenceDisplay(
            JSON.parse(query.F_SEQUENCE.S).slice(0, 10)
          );
          const matrixId = query.MATRIX_SHAREID.S;
          return (
            <tr key={index}>
              <TDWrapper>
                <Permalink href={`/?${matrixId}`}>{linkSVG24}</Permalink>
              </TDWrapper>
              <TDWrapper>{matrixTitle}</TDWrapper>
              <TDWrapper>{formatDate(query.CREATED_AT.S)}</TDWrapper>
              <TDWrapper>{displayGTerms}</TDWrapper>
              <TDWrapper>{displayFTerms}</TDWrapper>
              <TDWrapper>
                <Preview>{previewElem}</Preview>
              </TDWrapper>
              <TDWrapper>
                <ConfirmDeleteQueryDialog
                  matrixId={matrixId}
                  deleteQuery={deleteQuery}
                />
              </TDWrapper>
            </tr>
          );
        })}
      </tbody>
    </Wrapper>
  );
}

export default UserHistory;

const StyledSVG = styled.svg`
  cursor: pointer;
`;

const Preview = styled.div`
  margin-left: 15px;
`;

const Wrapper = styled.table`
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

const Permalink = styled(Link)`
  text-decoration: none;
  padding-left: 20px;

  &:visited {
    color: blue;
    text-decoration: none;
  }
`;

const MiniNumberBoxWrapper = styled.div<{ $disabled?: boolean }>`
  position: relative;
  display: inline-block;
  cursor: ${(p) => (p.$disabled ? 'default' : 'text')};
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

const InnerElement = styled.p<{
  $minfontsize?: string;
  fontSize?: string;
  $maxfontsize?: string;
}>`
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

const MatrixCell = styled.td<{ $row: number; $col: number }>`
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
