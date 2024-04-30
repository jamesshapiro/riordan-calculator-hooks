import React from 'react';

import styled from 'styled-components';
import { UserContext } from '../UserProvider';

function UserHistory() {
  const { userQueries, isAuthorized } =
    React.useContext(UserContext);
  if (!userQueries || !isAuthorized) {
    return <></>
  }
  return (
    <Wrapper>
      <thead>
        <tr>
        <TDWrapper>Link</TDWrapper>
          <TDWrapper>G</TDWrapper>
          <TDWrapper>F</TDWrapper>
          
        </tr>
      </thead>
      <tbody>
        {userQueries.map((query, index) => (
          <tr key={index}>
            <TDWrapper><a href={`/?${query.MATRIX_SHAREID.S}`}>{query.MATRIX_SHAREID.S}</a></TDWrapper>
            <TDWrapper>{query.G_SEQUENCE.S}</TDWrapper>
            <TDWrapper>{query.F_SEQUENCE.S}</TDWrapper>
            
          </tr>
        ))}
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
`