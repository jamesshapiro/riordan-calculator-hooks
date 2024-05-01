import React from 'react';

import styled from 'styled-components';
import { UserContext } from '../UserProvider';

import { formatDate } from '../../utils';

function UserHistory() {
  const { userQueries, isAuthorized } = React.useContext(UserContext);
  if (userQueries.length < 1) {
    return <></>;
  }
  return (
    <Wrapper>
      <thead>
        <tr>
          <TDWrapper>Permalink</TDWrapper>
          <TDWrapper>Date</TDWrapper>
          <TDWrapper>G</TDWrapper>
          <TDWrapper>F</TDWrapper>
        </tr>
      </thead>
      <tbody>
        {userQueries.map((query, index) => {
          return (
            <tr key={index}>
              <TDWrapper>
                <Permalink href={`/?${query.MATRIX_SHAREID.S}`}>Link</Permalink>
              </TDWrapper>
              <TDWrapper>{formatDate(query.CREATED_AT.S)}</TDWrapper>
              <TDWrapper>{query.G_SEQUENCE.S}</TDWrapper>
              <TDWrapper>{query.F_SEQUENCE.S}</TDWrapper>
            </tr>
          );
        })}
      </tbody>
    </Wrapper>
  );
}

export default UserHistory;

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
