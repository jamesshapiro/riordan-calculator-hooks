import React from 'react';

import styled from 'styled-components';
import { DataContext } from '../DataProvider';


import TooltipWrapper from '../TooltipWrapper';

function ActionBox({ actionType, sequenceId, sequenceValue, enabled }) {

  const { handleSelectSequence, handleSequenceChange } =
    React.useContext(DataContext);
  const symbol = actionType === 'prependZero' ? '>>' : '?';

  function handleClick() {
    if (actionType === 'prependZero') {
      // handleAddZero(sequenceId);
      handleSequenceChange(sequenceId, [0, ...sequenceValue]);
    }
    handleSelectSequence(sequenceId, 'custom');
  }

  const onClickAction = enabled ? handleClick : null;

  let result = (
    <Wrapper $enabled={enabled} onClick={onClickAction}>
      <InnerContainer>
        <InnerContainer>
          <InnerElement>{symbol}</InnerElement>
        </InnerContainer>
      </InnerContainer>
    </Wrapper>
  );

  if (actionType === 'prependZero') {
    result = (
      <TooltipWrapper
        message='Prepend a Zero'
        side='top'
        sideOffset={5}
        arrowshiftX='0'
        arrowshiftY='0'
      >
        {result}
      </TooltipWrapper>
    );
  }
  if (!enabled && actionType === 'prependZero') {
    result = <></>;
  }
  return result;
}

export default ActionBox;

const Wrapper = styled.div`
  position: relative;
  display: inline-block;
  cursor: ${(p) => (p.$enabled ? 'pointer' : 'default')};
  background-color: #faf8f6;
  &:hover {
    background-color: ${(p) => (p.$enabled ? '#f0ece7' : '#faf8f6')};
    color: ${(p) => (p.$enabled ? '#1a1612' : '#6b6560')};
  }
  border-radius: 6px;
  width: fit-content;
  min-width: var(--number-box-width);
  width: 100%;
  height: var(--number-box-height);
  margin: 1px;
  border: 1.5px dashed #d4cdc4;
  z-index: 0;
  transition: all 0.15s ease;
`;

const InnerContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  color: #6b6560;
  &:hover {
    color: #1a1612;
  }
  width: 100%;
  height: 100%;
`;

const InnerElement = styled.p`
  width: fit-content;
  font-size: 0.85rem;
`;
