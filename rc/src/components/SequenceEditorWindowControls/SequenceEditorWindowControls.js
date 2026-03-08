import React from 'react';

import { DataContext } from '../DataProvider';
import { ChevronLeftIcon, ChevronRightIcon } from '@radix-ui/react-icons';

import Spacer from '../Spacer';
import { range } from '../../utils';

import TooltipWrapper from '../TooltipWrapper';

import styled from 'styled-components';

function SequenceEditorWindowControls({}) {

  const { customSequence, customSequenceLength, setCustomSequenceLength } =
    React.useContext(DataContext);

  function handleClick(action) {
    // action();
  }

  const numElements = Math.min(customSequenceLength + 1, customSequence.length);
  //const numElements = customSequence.length;
  const elements = customSequence.slice(0, numElements).map((num, index) => {
    const leftArrow =
      index === numElements - 1 ? (
        <TooltipWrapper
          message='Hide Last Term'
          side='top'
          sideOffset={5}
          arrowshiftX='0'
          arrowshiftY='0'
        >
          <Bubble
            onClick={() => {
              setCustomSequenceLength((oldLength) => oldLength - 1);
              handleClick();
            }}
            $isleft='true'
          >
            <ChevronLeftIcon width='18' height='18' />
          </Bubble>
        </TooltipWrapper>
      ) : (
        ''
      );
    return <td key={`window-${index}-${num}`}>{leftArrow}</td>;
  });
  const prependZeroElement = <td key={`window-first`} style={{ zIndex: 0 }} />;

  const shorterSequenceLength = customSequence.length;
  const numAugmentBoxes = shorterSequenceLength - customSequenceLength;
  const boxes = range(numAugmentBoxes).map((index) => {
    const rightArrow =
      index === 0 ? (
        <TooltipWrapper
          message='Reveal Next Term'
          side='top'
          sideOffset={5}
          arrowshiftX='0'
          arrowshiftY='0'
        >
          <Bubble
            onClick={() => {
              setCustomSequenceLength((oldLength) => oldLength + 1);
              handleClick();
            }}
          >
            <ChevronRightIcon width='18' height='18' />
          </Bubble>
        </TooltipWrapper>
      ) : (
        ''
      );
    return <td key={`window-augment-${index}`}>{rightArrow}</td>;
  });

  return (
    <Wrapper>
      {prependZeroElement}
      <Spacer />
      {elements}
      {boxes}
    </Wrapper>
  );
}

export default SequenceEditorWindowControls;

const Wrapper = styled.tr`
  color: var(--number-box-font-color);
`;

const Bubble = styled.div`
  background-color: var(--number-box-background-color);
  border: 2px solid var(--action-box-border-color);
  &:hover {
    background-color: var(--bubble-hover-background-color);
    color: white;
    border: 2px solid var(--bubble-hover-border-color);
  }
  margin-left: ${(p) => (p.$isleft ? 'auto' : '0')};
  margin-right: ${(p) => (!p.$isleft ? 'auto' : '0')};
  border-radius: 15px;
  width: 30px;
  height: 30px;
  cursor: pointer;
  z-index: 10;

  display: flex;
  justify-content: center;
  align-items: center;
`;
