import React from 'react';

import { DataContext } from '../DataProvider';
import { SoundContext } from '../SoundProvider';
import { ChevronLeftIcon, ChevronRightIcon } from '@radix-ui/react-icons';

import Spacer from '../Spacer';
import { range } from '../../utils';

import useSound from 'use-sound';
import clickSound from '../../sounds/click.wav';

import TooltipWrapper from '../TooltipWrapper';

// import * as whooshSfx from '../../../public/sounds/delete-item.wav'; // 'sounds/delete-item.wav';

import styled from 'styled-components';

function WindowControls({ sequenceId }) {
  const { volume } = React.useContext(SoundContext);
  const [playClick] = useSound(clickSound, { volume });
  const {
    sequenceLength,
    gSequence,
    fSequence,
    handleTruncateSequence,
    handleAugmentSequence,
  } = React.useContext(DataContext);

  const sequence = sequenceId === 'g' ? gSequence : fSequence;

  function handleClick(action) {
    action();
    playClick();
  }

  const numElements = Math.min(
    sequenceLength,
    fSequence.length,
    gSequence.length
  );
  const elements = sequence.slice(0, numElements).map((num, index) => {
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
            onClick={() => handleClick(handleTruncateSequence)}
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

  const shorterSequenceLength = Math.min(fSequence.length, gSequence.length);
  const numAugmentBoxes = shorterSequenceLength - sequenceLength;
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
          <Bubble onClick={() => handleClick(handleAugmentSequence)}>
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

export default WindowControls;

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
