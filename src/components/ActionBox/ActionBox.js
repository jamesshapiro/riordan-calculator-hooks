import React from 'react';

import styled from 'styled-components';
import { DataContext } from '../DataProvider';

function ActionBox({ actionType, sequenceId }) {
  const { handleAddZero, handleAugmentSequence } =
    React.useContext(DataContext);
  const symbol = actionType === 'prependZero' ? '>' : '?';

  function handleClick() {
    if (actionType === 'prependZero') {
      handleAddZero(sequenceId);
    } else {
      handleAugmentSequence();
    }
  }

  return (
    <Wrapper onClick={() => handleClick()}>
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
  display: inline-block;
  cursor: pointer;
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