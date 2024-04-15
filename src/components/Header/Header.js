import React from 'react';
import { DataContext } from '../DataProvider';
import styled from 'styled-components';

function Header() {
  const { randomItem } = React.useContext(DataContext);

  return (
    <>
      <Wrapper>
        <StyledHeader>Riordan Calculator</StyledHeader>
      </Wrapper>
      <span>
        Invisible
        <Invisible>PLACEHOLDER</Invisible>
        placeholder
        <Invisible>DEMO</Invisible>
        Demo
      </span>
      <span>Random Data Context Item: {randomItem}</span>
    </>
  );
}

const Wrapper = styled.header`
  width: 300px;
  margin: 0 auto;
  margin-top: 50px;
  margin-bottom: 1px;
  border: 3px solid black;
  box-shadow: var(--box-shadow-distance) var(--box-shadow-distance) 0 0
    hsl(0, 0%, 25%);
`;

const StyledHeader = styled.h1`
  font-size: 30px;
  color: #333;
  font-weight: 600;
  font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
  color: black;
  background-color: yellow;
`;

const Invisible = styled.span`
  visibility: hidden;
  display: inline;
`;

export default Header;
