import React from 'react';

import styled from 'styled-components';
import { DataContext } from '../DataProvider';
import useSound from 'use-sound';
import clickSound from '../../sounds/click.wav';

function ActionBox({ actionType, sequenceId, enabled }) {
  const [playClick] = useSound(clickSound);
  // playWhoosh();

  const { handleAddZero, handleAugmentSequence } =
    React.useContext(DataContext);
  const symbol = actionType === 'prependZero' ? '>>' : '?';

  function handleClick() {
    if (actionType === 'prependZero') {
      handleAddZero(sequenceId);
    } else {
      handleAugmentSequence();
    }
    playClick();
  }

  const onClickAction = enabled ? handleClick : null;

  return (
    <Wrapper enabled={enabled} onClick={onClickAction}>
      <InnerContainer>
        <InnerContainer>
          <InnerElement>{symbol}</InnerElement>
        </InnerContainer>
      </InnerContainer>
    </Wrapper>
  );
}

export default ActionBox;

const Wrapper = styled.div`
  position: relative;
  display: inline-block;
  cursor: ${(p) => (p.enabled ? 'pointer' : 'default')};
  background-color: var(--action-box-background-color);
  &:hover {
    background-color: var(--action-box-hover-background-color);
    color: var(--action-box-hover-font-color);
  }
  border-radius: var(--number-box-border-radius);
  width: fit-content;
  min-width: var(--number-box-width);
  width: 100%;
  height: var(--number-box-height);
  margin: 1px;
  border: 2px dashed var(--action-box-border-color);
  z-index: 0;
  /* padding: 10%; */
`;

const InnerContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  font-family: 'Lato', sans-serif;
  color: var(--action-box-font-color);
  &:hover {
    color: var(--action-box-hover-font-color);
  }
  width: fit-content;
  height: 100%;
  width: 100%;
`;

const InnerElement = styled.p`
  width: fit-content;
  font-size: 1rem;
`;
