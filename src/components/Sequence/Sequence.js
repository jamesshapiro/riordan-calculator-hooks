import React from 'react';

import { DataContext } from '../DataProvider';
import NumberBox from '../NumberBox';
import ActionBox from '../ActionBox';
import Spacer from '../Spacer';
import { motion } from 'framer-motion';
import { range } from '../../utils';

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
    newSequence[targetIndex] = parseInt(newValue);
    handleSequenceChange(sequenceId, newSequence);
  }

  const didJustIncrease = sequenceId === 'g' ? gJustIncreased : fJustIncreased;

  const delta = sequenceId === 'f' ? sequenceLength : 0;
  const elements = sequence
    .slice(0, Math.min(sequenceLength, fSequence.length, gSequence.length))
    .map((num, index) => {
      const isLast = index === sequenceLength - 1;
      const isFirst = index === 0;
      const distanceToSequenceEnd = sequence.length - 1 - index;
      const firstInitial = didJustIncrease && isFirst ? { scale: 0 } : null;
      const firstAnimate = didJustIncrease && isFirst ? { scale: 1 } : null;

      // const firstTiming =
      //   didJustIncrease && isFirst
      //     ? {
      //         scale: {
      //           delay: 10,
      //           duration: 0.1,
      //         },
      //       }
      //     : null;
      const damping = isFirst ? 50 : Math.max(100 - 10 * index, 30);
      const seqZIndex = sequenceId === 'f' ? {
        zIndex: 10 + distanceToSequenceEnd - index,
        position: 'relative',
      } : {};

      return (
        <td key={`${index + delta}-${num}`}>
          <motion.div
            layoutId={`${sequenceId}-${distanceToSequenceEnd}-to-last`}
            key={`${sequenceId}-${distanceToSequenceEnd}-to-last`}
            initial={firstInitial}
            animate={firstAnimate}
            style={seqZIndex}
            // exit={{ opacity: 0, x: '300%' }}
            transition={{
              type: 'spring',
              stiffness: 300,
              // damping: 30 + 3 * index,
              damping: damping,
              // firstTiming,
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
          enabled={true}
        />
      </motion.div>
    </td>
  );

  const shorterSequenceLength = Math.min(fSequence.length, gSequence.length);
  const numAugmentBoxes = shorterSequenceLength - sequenceLength;
  const mysteryBoxes = range(numAugmentBoxes).map((index) => {
    const distanceToSequenceEnd = sequence.length - sequenceLength - 1 - index;
    // const opacity = Math.max(1 - index * 0.25, 0.05);
    const opacity = Math.max(1.5 / (index + 1), 0.15);

    // const initOpacity = { opacity: Math.max(1 - (index - 1) * 0.25, 0.05) };
    // const endOpacity = { opacity: Math.max(1 - index * 0.25, 0.05) };
    const initOpacity = {
      opacity: Math.max(1.5 / (index + 1), 0.15),
    };
    const endOpacity = {
      opacity: Math.max(1.5 / (index + 1), 0.15),
    };

    const opacityTiming = {
      opacity: {
        duration: 0.7,
      },
    };

    return (
      <td key={`augment-${index}`} style={{ zIndex: 0, opacity }}>
        <motion.div
          layoutId={`${sequenceId}-${distanceToSequenceEnd}-to-last`}
          key={`${sequenceId}-${distanceToSequenceEnd}-to-last`}
          style={{ zIndex: 0 }}
          initial={initOpacity}
          animate={endOpacity}
          transition={{
            type: 'spring',
            stiffness: 600,
            // damping: 15 + 5 * (sequenceLength + index),
            damping: 45,
            opacityTiming,
          }}
        >
          <ActionBox
            actionType={'augment'}
            sequenceId={sequenceId}
            key={`augment-${delta}`}
            enabled={false}
          />
        </motion.div>
      </td>
    );
  });

  return (
    <Wrapper>
      {prependZeroElement}
      <Spacer />
      {elements}
      {mysteryBoxes}
    </Wrapper>
  );
}

export default Sequence;

const Wrapper = styled.tr`
  color: var(--number-box-font-color);
`;
