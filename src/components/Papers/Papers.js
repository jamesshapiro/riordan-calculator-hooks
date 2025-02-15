import React from 'react';

import styled from 'styled-components';

import NavBar from '../NavBar';
import Header from '../Header';
import email from '../../../public/riordanpapers.png';

function Papers() {
  return (
    <FlexColumnWrapper>
      <NavBar />
      <HeaderDiv>
        <Header />
      </HeaderDiv>
      <VerticalSpace />
      <P>
        We are now including any Riordan-related papers that you choose to
        submit. Please only submit papers that you can authorize us to
        re-publish.
        <br />
        <br />
        Only papers that credit the Riordan Calculator in the original
        publication are eligible for inclusion on riordancalculator.com. You are
        encouraged to submit your papers to
        <img
          src={email}
          alt='Riordan Papers'
          style={{
            width: '170px',
            display: 'inline',
            transform: 'translate(2px, 4px)',
          }}
        />
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
