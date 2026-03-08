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
  background-color: ${(p) => p.$enabled ? '#ffffff' : 'hsl(215, 15%, 96%)'};
  &:hover {
    background-color: ${(p) =>
      p.$enabled
        ? 'hsl(215, 30%, 95%)'
        : 'hsl(215, 15%, 96%)'};
    color: ${(p) =>
      p.$enabled
        ? 'hsl(215, 60%, 30%)'
        : 'hsl(215, 30%, 55%)'};
  }
  border-radius: var(--number-box-border-radius);
  width: fit-content;
  min-width: var(--number-box-width);
  width: 100%;
  height: var(--number-box-height);
  margin: 1px;
  border: 1.5px dashed hsl(215, 25%, 82%);
  z-index: 0;
  transition: all 0.15s ease;
`;

const InnerContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  color: hsl(215, 30%, 55%);
  &:hover {
    color: hsl(215, 55%, 30%);
  }
  width: fit-content;
  height: 100%;
  width: 100%;
`;

const InnerElement = styled.p`
  width: fit-content;
  font-size: 0.9rem;
  font-weight: 500;
`;
