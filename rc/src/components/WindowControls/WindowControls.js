import React from 'react';

import { DataContext } from '../DataProvider';
import { ChevronLeftIcon, ChevronRightIcon } from '@radix-ui/react-icons';

import Spacer from '../Spacer';
import { range } from '../../utils';


import TooltipWrapper from '../TooltipWrapper';

import styles from './WindowControls.module.css';

function WindowControls({ sequenceId }) {
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
          <div
            className={styles.bubble}
            onClick={() => handleClick(handleTruncateSequence)}
            style={{ marginLeft: 'auto', marginRight: '0' }}
          >
            <ChevronLeftIcon width='18' height='18' />
          </div>
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
          <div
            className={styles.bubble}
            onClick={() => handleClick(handleAugmentSequence)}
            style={{ marginLeft: '0', marginRight: 'auto' }}
          >
            <ChevronRightIcon width='18' height='18' />
          </div>
        </TooltipWrapper>
      ) : (
        ''
      );
    return <td key={`window-augment-${index}`}>{rightArrow}</td>;
  });

  return (
    <tr className={styles.wrapper}>
      {prependZeroElement}
      <Spacer />
      {elements}
      {boxes}
    </tr>
  );
}

export default WindowControls;
