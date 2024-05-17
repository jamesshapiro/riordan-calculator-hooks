import React from 'react';
import UserHistory from '../UserHistory';

import styled from 'styled-components';
import NavBar from '../NavBar';
import Header from '../Header';

function History() {
  return (
    <FlexColumnWrapper>
      <NavBar />
      <HeaderDiv>
        <Header />
      </HeaderDiv>
      <UserHistory />;
    </FlexColumnWrapper>
  );
}

export default History;

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
