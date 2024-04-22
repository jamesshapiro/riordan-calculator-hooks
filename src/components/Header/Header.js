import React from 'react';
import { DataContext } from '../DataProvider';
import styled from 'styled-components';
import { SoundContext } from '../SoundProvider';

import useSound from 'use-sound';
import clickSound from '../../sounds/click2.wav';

function Header() {
  const { metaMode, setMetaMode } = React.useContext(DataContext);
  const isClassicSelected = metaMode === 'classic';
  const { volume } = React.useContext(SoundContext);

  const [playClick] = useSound(clickSound, { volume });

  function handleMetaModeClick(metaMode) {
    playClick();
    setMetaMode(metaMode);
  }

  return (
    <Wrapper>
      <HeaderWrapper>
        <StyledHeader>Riordan Calculator</StyledHeader>
      </HeaderWrapper>
      <StyledButton
        isSelected={isClassicSelected}
        onClick={() => handleMetaModeClick('classic')}
      >
        Classic
      </StyledButton>
      <StyledButton
        isSelected={!isClassicSelected}
        onClick={() => handleMetaModeClick('exponential')}
      >
        Exponential
      </StyledButton>
    </Wrapper>
  );
}

const Wrapper = styled.div`
  /* flex-direction: column; */
`;

const HeaderWrapper = styled.header`
  width: 300px;
  display: inline;

  /* margin-bottom: 1px; */
  border: 1px solid var(--number-box-border-color);
  /* border-radius: 4px; */
  padding: 20px;
  padding-top: 25px;
  border-radius: 3px;
  background-color: var(--number-box-background-color);
  /* box-shadow: var(--box-shadow-distance) var(--box-shadow-distance)
    hsl(0, 0%, 50%); */
`;

const StyledHeader = styled.h1`
  display: inline;
  font-size: 24px;
  font-weight: 500;
  color: var(--header-color);
`;

const StyledButton = styled(({ isSelected, ...props }) => (
  <button {...props} />
))`
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

export default Header;
