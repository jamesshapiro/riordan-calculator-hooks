import React from 'react';

import { DataContext } from '../DataProvider';
import { ChevronLeftIcon, ChevronRightIcon } from '@radix-ui/react-icons';

import Spacer from '../Spacer';
import { range } from '../../utils';

import TooltipWrapper from '../TooltipWrapper';

import styles from './SequenceEditorWindowControls.module.css';

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
          <div
            className={styles.bubble}
            onClick={() => {
              setCustomSequenceLength((oldLength) => oldLength - 1);
              handleClick();
            }}
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
          <div
            className={styles.bubble}
            onClick={() => {
              setCustomSequenceLength((oldLength) => oldLength + 1);
              handleClick();
            }}
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

export default SequenceEditorWindowControls;

