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
    </>
  );
}

const Wrapper = styled.header`
  width: 300px;
  margin: 0 auto;
  margin-top: 50px;
  margin-bottom: 1px;
  border: 1px solid var(--number-box-border-color);
  border-radius: 4px;
  padding: 20px;
  background-color: var(--number-box-background-color);
  box-shadow: var(--box-shadow-distance) var(--box-shadow-distance) 0 0
    hsl(0, 0%, 25%);
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
