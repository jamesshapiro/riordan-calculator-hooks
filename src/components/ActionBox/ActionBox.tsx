'use client';

import React from 'react';
import styled from 'styled-components';
import { DataContext } from '../DataProvider/DataProvider';
import TooltipWrapper from '../TooltipWrapper/TooltipWrapper';

function ActionBox({ actionType, sequenceId, sequenceValue, enabled }: {
  actionType: string;
  sequenceId: string;
  sequenceValue: number[];
  enabled: boolean;
}) {
  const { handleSelectSequence, handleSequenceChange } =
    React.useContext(DataContext);
  const symbol = actionType === 'prependZero' ? '>>' : '?';

  function handleClick() {
    if (actionType === 'prependZero') {
      handleSequenceChange(sequenceId, [0, ...sequenceValue]);
    }
    handleSelectSequence(sequenceId, 'custom');
  }

  const onClickAction = enabled ? handleClick : undefined;

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
      <TooltipWrapper message='Prepend a Zero' side='top' sideOffset={5} arrowshiftX='0' arrowshiftY='0'>
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

const Wrapper = styled.div<{ $enabled: boolean }>`
  position: relative;
  display: inline-block;
  cursor: ${(p) => (p.$enabled ? 'pointer' : 'default')};
  background-color: var(--number-box-background-color);
  &:hover {
    background-color: ${(p) => p.$enabled ? 'var(--number-box-hover-background-color)' : 'var(--number-box-background-color)'};
    color: ${(p) => p.$enabled ? 'var(--number-box-hover-font-color)' : 'var(--number-box-font-color)'};
  }
  border-radius: var(--number-box-border-radius);
  width: fit-content;
  min-width: var(--number-box-width);
  width: 100%;
  height: var(--number-box-height);
  margin: 1px;
  border: 2px dashed var(--number-box-border-color);
  z-index: 0;
`;

const InnerContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  font-family: 'Lato', sans-serif;
  color: var(--number-box-font-color);
  &:hover { color: var(--number-box-hover-font-color); }
  width: fit-content;
  height: 100%;
  width: 100%;
`;

const InnerElement = styled.p`
  width: fit-content;
  font-size: 1rem;
`;
