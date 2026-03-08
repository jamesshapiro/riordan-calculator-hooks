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
  border: none;
  padding: 0;
  background-color: transparent;
`;

const StyledHeader = styled.h1`
  display: inline;
  font-size: 22px;
  font-weight: 700;
  color: hsl(215, 60%, 22%);
  letter-spacing: -0.02em;
`;

const StyledLink = styled.a`
  display: inline;
  font-size: 22px;
  font-weight: 700;
  color: hsl(215, 60%, 22%);
  text-decoration: none;
  letter-spacing: -0.02em;
  &:visited {
    color: hsl(215, 60%, 22%);
  }
`;

const StyledButton = styled(({ isSelected, ...props }) => (
  <button {...props} />
))`
  font-size: 13px;
  font-weight: 500;
  background-color: ${(p) =>
    p.isSelected ? 'hsl(215, 55%, 22%)' : '#ffffff'};
  border: 1px solid ${(p) =>
    p.isSelected ? 'hsl(215, 55%, 22%)' : 'hsl(215, 25%, 82%)'};
  color: ${(p) => (p.isSelected ? 'white' : 'hsl(215, 40%, 40%)')};
  padding: 8px 16px;
  border-radius: 6px;
  cursor: ${(p) => (!p.isSelected ? 'pointer' : 'default')};
  transition: all 0.15s ease;
  &:first-of-type {
    margin-left: 0;
  }
  &:hover {
    background-color: ${(p) =>
      !p.isSelected
        ? 'hsl(215, 50%, 35%)'
        : 'hsl(215, 55%, 22%)'};
    color: white;
    border-color: ${(p) =>
      !p.isSelected
        ? 'hsl(215, 50%, 35%)'
        : 'hsl(215, 55%, 22%)'};
  }
`;

export default Header;
