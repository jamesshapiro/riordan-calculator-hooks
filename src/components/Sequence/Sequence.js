import React from 'react';

import { DataContext } from '../DataProvider';
import NumberBox from '../NumberBox';
import ActionBox from '../ActionBox';
import Spacer from '../Spacer';
import { motion } from 'framer-motion';

// import * as whooshSfx from '../../../public/sounds/delete-item.wav'; // 'sounds/delete-item.wav';

import styled from 'styled-components';

function Sequence({ sequenceId }) {
  const {
    sequenceLength,
    gSequence,
    fSequence,
    handleSequenceChange,
    fJustIncreased,
    gJustIncreased,
  } = React.useContext(DataContext);
  const sequence = sequenceId === 'g' ? gSequence : fSequence;

  function handleNumberChange(index, newValue) {
    const newSequence = [...sequence];
    const targetIndex = index % sequenceLength;
    newSequence[targetIndex] = newValue;
    handleSequenceChange(sequenceId, newSequence);
  }

  const didJustIncrease = sequenceId === 'g' ? gJustIncreased : fJustIncreased;

  const delta = sequenceId === 'f' ? sequenceLength : 0;
  const elements = sequence.slice(0, sequenceLength).map((num, index) => {
    const isLast = index === sequenceLength - 1;
    const isFirst = index === 0;
    const distanceToSequenceEnd = sequence.length - 1 - index;
    const firstInitial = didJustIncrease && isFirst ? { scale: 0 } : null;
    const firstAnimate = didJustIncrease && isFirst ? { scale: 1 } : null;
    if (didJustIncrease && isFirst) {
      console.log(didJustIncrease);
    }
    const firstTiming =
      didJustIncrease && isFirst
        ? {
            scale: {
              delay: 0.5,
              duration: 1,
            },
          }
        : null;
    return (
      <td key={`${index + delta}-${num}`}>
        <motion.div
          layoutId={`${sequenceId}-${distanceToSequenceEnd}-to-last`}
          key={`${sequenceId}-${distanceToSequenceEnd}-to-last`}
          initial={firstInitial} // Start from no size
          animate={firstAnimate}
          transition={{
            type: 'spring',
            stiffness: 300,
            damping: 30 + 5 * index,
            firstTiming,
          }}
        >
          <NumberBox
            value={num}
            index={index + delta}
            sequenceId={sequenceId}
            key={`${index + delta}-${num}`}
            isFirst={isFirst}
            isLast={isLast}
            onSubmit={handleNumberChange}
          />
        </motion.div>
      </td>
    );
  });
  const prependZeroElement = (
    <td key={`prependzero-${delta}`} style={{ zIndex: 0 }}>
      <motion.div
        layoutId={`${sequenceId}-prepend-box`}
        key={`${sequenceId}-prepend-box`}
        style={{ zIndex: 0 }}
        transition={{
          type: 'spring',
          stiffness: 300,
          damping: 30 + 5 * 0,
        }}
      >
        <ActionBox
          actionType={'prependZero'}
          sequenceId={sequenceId}
          key={`prependzero-${delta}`}
          onSubmit={handleNumberChange}
        />
      </motion.div>
    </td>
  );

  const augmentElement =
    sequenceLength < Math.min(fSequence.length, gSequence.length) ? (
      <td key={`augment-${delta}`} style={{ zIndex: 0 }}>
        <motion.div
          layoutId={`${sequenceId}-augment-box`}
          key={`${sequenceId}-augment-box`}
          style={{ zIndex: 0 }}
          transition={{
            type: 'spring',
            stiffness: 300,
            damping: 30 + 5 * sequenceLength,
          }}
        >
          <ActionBox
            actionType={'augment'}
            sequenceId={sequenceId}
            key={`augment-${delta}`}
          />
        </motion.div>
      </td>
    ) : null;

  return (
    <Wrapper>
      {prependZeroElement}
      <Spacer />
      {elements}
      {augmentElement}
    </Wrapper>
  );
}

export default Sequence;

const Wrapper = styled.tr`
  color: var(--number-box-font-color);
`;
