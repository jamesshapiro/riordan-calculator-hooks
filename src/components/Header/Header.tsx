'use client';

import React from 'react';
import Link from 'next/link';
import { DataContext } from '../DataProvider/DataProvider';
import styled from 'styled-components';

function Header({ isHome }: { isHome?: boolean }) {
  const { metaMode, setMetaMode } = React.useContext(DataContext);
  const isClassicSelected = metaMode === 'classic';

  function handleMetaModeClick(newMetaMode: string) {
    setMetaMode(() => newMetaMode);
  }

  return (
    <Wrapper>
      <HeaderWrapper>
        <StyledHeader>
          <StyledLink href='/'>Riordan Calculator</StyledLink>
        </StyledHeader>
      </HeaderWrapper>
      {isHome && (
        <StyledButton
          $isSelected={isClassicSelected}
          onClick={() => handleMetaModeClick('classic')}
        >
          Classic
        </StyledButton>
      )}
      {isHome && (
        <StyledButton
          $isSelected={!isClassicSelected}
          onClick={() => handleMetaModeClick('exponential')}
        >
          Exponential
        </StyledButton>
      )}
    </Wrapper>
  );
}

const Wrapper = styled.div``;

const HeaderWrapper = styled.header`
  width: 300px;
  display: inline;
  border: 1px solid var(--number-box-border-color);
  padding: 20px;
  padding-top: 25px;
  border-radius: 3px;
  background-color: var(--number-box-background-color);
`;

const StyledHeader = styled.h1`
  display: inline;
  font-size: 24px;
  font-weight: 500;
  color: var(--header-color);
`;

const StyledLink = styled(Link)`
  display: inline;
  font-size: 24px;
  font-weight: 500;
  color: var(--header-color);
  text-decoration: none;
  &:visited {
    color: var(--header-color);
  }
`;

const StyledButton = styled.button<{ $isSelected: boolean }>`
  font-size: 16px;
  background-color: ${(p) =>
    p.$isSelected ? 'var(--mode-button-selected)' : 'white'};
  border: 1px solid var(--mode-button-selected);
  color: ${(p) => (p.$isSelected ? 'white' : 'var(--mode-button-selected)')};
  padding: 10px;
  border-radius: 12px;
  cursor: ${(p) => (!p.$isSelected ? 'pointer' : 'default')};
  margin: 3px;
  &:first-of-type {
    margin-left: 30px;
  }
  &:hover {
    background-color: ${(p) =>
      !p.$isSelected
        ? 'var(--hover-button-color)'
        : 'var(--active-button-color)'};
    color: white;
  }
`;

export default Header;
