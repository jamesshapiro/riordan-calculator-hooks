import React from 'react';
import { DataContext } from '../DataProvider';
import styled from 'styled-components';

function Header({ isHome }) {
  const { metaMode, setMetaMode } = React.useContext(DataContext);
  const isClassicSelected = metaMode === 'classic';

  function handleMetaModeClick(metaMode) {
    setMetaMode((oldValue) => {
      return metaMode;
    });
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
          isSelected={isClassicSelected}
          onClick={() => handleMetaModeClick('classic')}
        >
          Classic
        </StyledButton>
      )}
      {isHome && (
        <StyledButton
          isSelected={!isClassicSelected}
          onClick={() => handleMetaModeClick('exponential')}
        >
          Exponential
        </StyledButton>
      )}
    </Wrapper>
  );
}

const Wrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
`;

const HeaderWrapper = styled.header`
  display: inline;
  padding: 14px 20px;
  border: 1px solid #e8e4df;
  border-radius: 8px;
  background-color: #ffffff;
`;

const StyledHeader = styled.h1`
  display: inline;
  font-size: 1.125rem;
  font-weight: 600;
  color: #1a1612;
  letter-spacing: -0.02em;
`;

const StyledLink = styled.a`
  display: inline;
  font-size: 1.125rem;
  font-weight: 600;
  color: #1a1612;
  text-decoration: none;
  letter-spacing: -0.02em;
  &:visited {
    color: #1a1612;
  }
`;

const StyledButton = styled(({ isSelected, ...props }) => (
  <button {...props} />
))`
  font-size: 0.8rem;
  font-weight: 500;
  background-color: ${(p) => (p.isSelected ? '#1a1612' : 'transparent')};
  border: 1px solid ${(p) => (p.isSelected ? '#1a1612' : '#d4cdc4')};
  color: ${(p) => (p.isSelected ? '#faf9f7' : '#6b6560')};
  padding: 7px 16px;
  border-radius: 20px;
  cursor: ${(p) => (!p.isSelected ? 'pointer' : 'default')};
  letter-spacing: 0.01em;
  transition: all 0.2s ease;
  &:first-of-type {
    margin-left: 0;
  }
  &:hover {
    background-color: ${(p) => (!p.isSelected ? '#f0ece7' : '#1a1612')};
    color: ${(p) => (!p.isSelected ? '#1a1612' : '#faf9f7')};
    border-color: ${(p) => (!p.isSelected ? '#b4aa9e' : '#1a1612')};
  }
`;

export default Header;
