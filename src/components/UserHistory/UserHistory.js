import React from 'react';

import styled from 'styled-components';
import { UserContext } from '../UserProvider';
import ConfirmDeleteQueryDialog from '../ConfirmDeleteQueryDialog';

import { formatDate } from '../../utils';

function UserHistory() {
  const { userQueries, isAuthorized, deleteQuery } =
    React.useContext(UserContext);
  if (userQueries.length < 1) {
    return <></>;
  }

  const garbageSVG24 = (
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
      className='lucide lucide-trash-2'
    >
      <path d='M3 6h18' />
      <path d='M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6' />
      <path d='M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2' />
      <line x1='10' x2='10' y1='11' y2='17' />
      <line x1='14' x2='14' y1='11' y2='17' />
    </StyledSVG>
  );

  const garbageSVG15 = (
    <StyledSVG
      xmlns='http://www.w3.org/2000/svg'
      width='15'
      height='15'
      viewBox='0 0 15 15'
      fill='none'
      stroke='currentColor'
      strokeWidth='1.33333'
      strokeLinecap='round'
      strokeLinejoin='round'
      className='lucide lucide-trash-2'
    >
      <path d='M2 4h11' />
      <path d='M12.5 4v9.33333c0 .66667-.66667 1.33333-1.33333 1.33333H3.83333C3.16667 15 2.5 14.33333 2.5 13.33333V4' />
      <path d='M5.33333 4V3c0-.66667.66667-1.33333 1.33334-1.33333h2.66666c.66667 0 1.33333.66666 1.33333 1.33333v1' />
      <line x1='6.66667' y1='7.33333' x2='6.66667' y2='11.33333' />
      <line x1='9.33333' y1='7.33333' x2='9.33333' y2='11.33333' />
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
          <TDWrapper>Delete</TDWrapper>
        </tr>
      </thead>
      <tbody>
        {userQueries.map((query, index) => {
          const matrixTitle = query.TITLE ? query.TITLE.S : '(none)';
          const displayGTerms = JSON.stringify(
            JSON.parse(query.G_SEQUENCE.S).slice(0, 7)
          );
          const displayFTerms = JSON.stringify(
            JSON.parse(query.G_SEQUENCE.S).slice(0, 7)
          );
          const matrixId = query.MATRIX_SHAREID.S;
          return (
            <tr key={index}>
              <TDWrapper>
                <Permalink href={`/?${matrixId}`}>Link</Permalink>
              </TDWrapper>
              <TDWrapper>{matrixTitle}</TDWrapper>
              <TDWrapper>{formatDate(query.CREATED_AT.S)}</TDWrapper>
              <TDWrapper>{displayGTerms}</TDWrapper>
              <TDWrapper>{displayFTerms}</TDWrapper>
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

const Wrapper = styled.table`
  background-color: #f1f1f1;
  border: 1px solid black;
  border-collapse: collapse;
  width: 100%;
  margin-top: 200px;
  margin-right: 30px;
`;
const TDWrapper = styled.td`
  border: 1px solid black;
  padding: 8px;
`;

const Permalink = styled.a`
  text-decoration: none;

  &:visited {
    color: blue;
    text-decoration: none;
  }
`;
