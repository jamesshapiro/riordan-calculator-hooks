'use client';

import React from 'react';
import styled from 'styled-components';
import NavBar from '@/components/NavBar/NavBar';
import Header from '@/components/Header/Header';

function Papers() {
  return (
    <FlexColumnWrapper>
      <NavBar />
      <HeaderDiv>
        <Header />
      </HeaderDiv>
      <VerticalSpace />
      <P>
        We are now re-publishing Riordan-related papers on the website!
        <br />
        <br />
        Any papers that credit the Riordan Calculator in their official
        published version are eligible for inclusion on riordancalculator.com.
        You are encouraged to submit your papers to
        <img
          src='/riordanpapers.png'
          alt='Riordan Papers'
          style={{
            width: '170px',
            display: 'inline',
            transform: 'translate(2px, 4px)',
          }}
        />
        <br />
        <br />
        We are currently reviewing submissions.
      </P>
    </FlexColumnWrapper>
  );
}

export default Papers;

const VerticalSpace = styled.div`
  min-height: 150px;
`;

const P = styled.p`
  a {
    text-decoration: none;
    color: blue;
  }
  border: 1px solid blue;
  background-color: white;
  max-width: 600px;
  padding: 20px;
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
  margin-left: 0px;
`;
