import React from 'react';
import { DataContext } from '../DataProvider';
import styled from 'styled-components';

function Header() {
  const { metaMode, setMetaMode } = React.useContext(DataContext);
  const isClassicSelected = metaMode === 'classic';

  return (
    <Wrapper>
      <HeaderWrapper>
        <StyledHeader>
          <CalculatorIconSpan>🖩</CalculatorIconSpan> Riordan Calculator{' '}
          <CalculatorIconSpan>🖩</CalculatorIconSpan>
        </StyledHeader>
      </HeaderWrapper>
      <StyledButton
        isSelected={isClassicSelected}
        onClick={() => setMetaMode('classic')}
      >
        Classic
      </StyledButton>
      <StyledButton
        isSelected={!isClassicSelected}
        onClick={() => setMetaMode('exponential')}
      >
        Exponential
      </StyledButton>
    </Wrapper>
  );
}

const Wrapper = styled.div`
  display: block;
  margin: 0 auto;
  margin-left: 400px;
`;

const HeaderWrapper = styled.header`
  width: 300px;
  display: inline;

  /* margin-bottom: 1px; */
  border: 1px solid var(--number-box-border-color);
  /* border-radius: 4px; */
  padding: 20px;
  background-color: var(--number-box-background-color);
  box-shadow: var(--box-shadow-distance) var(--box-shadow-distance)
    hsl(0, 0%, 50%);
`;

const StyledHeader = styled.h1`
  display: inline;
  font-size: 24px;
  font-weight: 500;
  color: var(--header-color);
`;

const StyledButton = styled.button`
  font-size: 16px;
  background-color: ${(p) =>
    p.isSelected ? 'var(--mode-button-selected)' : 'white'};
  border: 1px solid var(--mode-button-selected);
  color: ${(p) => (p.isSelected ? 'white' : 'var(--mode-button-selected)')};
  padding: 10px;
  border-radius: 12px;
  cursor: ${(p) => (!p.isSelected ? 'pointer' : 'default')};
  margin: 3px;
  &:first-of-type {
    margin-left: 30px;
  }
  &:hover {
    background-color: ${(p) =>
      !p.isSelected
        ? 'var(--hover-button-color)'
        : 'var(--active-button-color)'};
    color: white;
  }
`;

const Invisible = styled.span`
  visibility: hidden;
  display: inline;
`;

export default Header;

const CalculatorIconSpan = styled.span`
  display: inline-block;
  position: relative;
  font-size: 40px;
  transform: translateY(2px);
`;
