import React from 'react';
import { DataContext } from '../DataProvider';
import styled from 'styled-components';

function Header() {
  return (
    <>
      <Wrapper>
        <StyledHeader>Riordan Calculator</StyledHeader>
      </Wrapper>
    </>
  );
}

const Wrapper = styled.header`
  width: 300px;
  margin: 0 auto;
  margin-bottom: 1px;
  border: 1px solid var(--number-box-border-color);
  /* border-radius: 4px; */
  padding: 20px;
  background-color: var(--number-box-background-color);
  box-shadow: var(--box-shadow-distance) var(--box-shadow-distance)
    hsl(0, 0%, 50%);
`;

const StyledHeader = styled.h1`
  font-size: 24px;
  font-weight: 500;
  color: var(--header-color);
`;

const Invisible = styled.span`
  visibility: hidden;
  display: inline;
`;

export default Header;
