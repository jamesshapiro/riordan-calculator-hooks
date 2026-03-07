'use client';

import React from 'react';
import UserHistory from '@/components/UserHistory/UserHistory';
import styled from 'styled-components';
import NavBar from '@/components/NavBar/NavBar';
import Header from '@/components/Header/Header';

function History() {
  return (
    <FlexColumnWrapper>
      <NavBar />
      <HeaderDiv>
        <Header />
      </HeaderDiv>
      <UserHistory />
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
  margin-left: 0px;
`;
