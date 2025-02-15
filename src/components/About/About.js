import React from 'react';

import styled from 'styled-components';

import NavBar from '../NavBar';
import Header from '../Header';
import email from '../../../public/riordanpapers.png';

function About() {
  return (
    <FlexColumnWrapper>
      <NavBar />
      <HeaderDiv>
        <Header />
      </HeaderDiv>
      <VerticalSpace />
      <P>
        The Riordan Calculator was created by{' '}
        <a href='https://jamesshapiro.com'>James Shapiro</a> in consultation
        with his father, Riordan expert{' '}
        <a href='https://en.wikipedia.org/wiki/Louis_Shapiro_(mathematician)'>
          Louis Shapiro
        </a>
        . It was signficantly upgraded in 2024 and is free to use. If this
        website helps you discover new results, I would appreciate if you
        mention it somewhere in your paper so that others can take advantage of
        the calculator. However, this is purely optional.
        <br />
        <br />
        You are encouraged to submit your papers to the new Riordan Calculator
        Papers section of the website! Any papers that credit the Riordan
        Calculator in their official published version are eligible for
        inclusion. Please submit papers to
        <img
          src={email}
          alt='Riordan Papers'
          style={{
            width: '170px',
            display: 'inline',
            transform: 'translate(2px, 5px)',
          }}
        />
      </P>
    </FlexColumnWrapper>
  );
}

export default About;

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
