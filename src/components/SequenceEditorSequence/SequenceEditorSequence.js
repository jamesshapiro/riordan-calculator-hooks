import React from 'react';

import { DataContext } from '../DataProvider';
import NumberBox from '../NumberBox';
import ActionBox from '../ActionBox';
import Spacer from '../Spacer';
import { motion } from 'framer-motion';
import { range } from '../../utils';

// import * as whooshSfx from '../../../public/sounds/delete-item.wav'; // 'sounds/delete-item.wav';

import styled from 'styled-components';

function SequenceEditorSequence({ sequenceValues, name, editable = false, index = 0 }) {
  const {
    sequenceLength,
    gSequence,
    fSequence,
    handleSequenceChange,
    fJustIncreased,
    gJustIncreased,
    mode,
  } = React.useContext(DataContext);
  
  function handleNumberChange(index, newValue) {
    const newSequence = [...sequence];
    const targetIndex = index % sequenceLength;
    newSequence[targetIndex] = parseInt(newValue);
    handleSequenceChange(sequenceId, newSequence);
  }

  const elements = sequenceValues
    .slice(0, Math.min(sequenceLength, fSequence.length, gSequence.length))
    .map((num, index) => {
      const isLast = index === sequenceLength - 1;
      const isFirst = index === 0;
      const distanceToSequenceEnd = sequenceValues.length - 1 - index;

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
      const seqZIndex =
         {
              zIndex: 10 + index,
              position: 'relative',
            }
      const disableNumberBox = !editable
      const delta=0

      return (
        <td key={`${index + delta}-${num}`}>
          <motion.div
            layoutId={`${index}-${distanceToSequenceEnd}-to-last`}
            key={`${index}-${distanceToSequenceEnd}-to-last`}
            initial={true}
            animate={true}
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
              sequenceId={index}
              sequenceValue={sequenceValues}
              key={`${index + delta}-${num}`}
              isFirst={isFirst}
              isLast={isLast}
              onSubmit={handleNumberChange}
              disabled={disableNumberBox}
            />
          </motion.div>
        </td>
      );
    });
  const disablePrepend =
    (['bell', 'appell', 'twobell'].includes(mode) && sequenceId === 'f') ||
    (['derivative', 'associated'].includes(mode) && sequenceId === 'g');
  const delta = 0;
  const prependZeroElement = (
    <td key={`prependzero-${delta}`} style={{ zIndex: 0 }}>
      <motion.div
        layoutId={`seqed-${index}-prepend-box`}
        key={`seqed-${index}-prepend-box`}
        style={{ zIndex: 0 }}
        transition={{
          type: 'spring',
          stiffness: 300,
          damping: 30 + 5 * 0,
        }}
      >
        <ActionBox
          actionType={'prependZero'}
          sequenceId={`seqed-${index}`}
          sequenceValue={sequenceValues}
          key={`prependzero-${delta}`}
          onSubmit={handleNumberChange}
          enabled={!disablePrepend}
        />
      </motion.div>
    </td>
  );

  const shorterSequenceLength = Math.min(fSequence.length, gSequence.length);
  const numAugmentBoxes = shorterSequenceLength - sequenceLength;
  const mysteryBoxes = range(numAugmentBoxes).map((index) => {
    const distanceToSequenceEnd = sequenceValues.length - sequenceLength - 1 - index;
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
          layoutId={`seqed-${index}-${distanceToSequenceEnd}-to-last`}
          key={`seqed-${index}-${distanceToSequenceEnd}-to-last`}
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
          {/* Investigate if this is really necessary anymore */}
          <ActionBox
            actionType={'augment'}
            sequenceId={`seqed-${index}`}
            sequenceValue={sequenceValues}
            key={`augment-${delta}`}
            enabled={false}
          />
        </motion.div>
      </td>
    );
  });

  return (
    <Wrapper>
      <SequenceTitle>{name}</SequenceTitle>
      {prependZeroElement}
      <Spacer />
      {elements}
      {mysteryBoxes}
    </Wrapper>
  );
}

export default SequenceEditorSequence;

const Wrapper = styled.tr`
  color: var(--number-box-font-color);
`;

const SequenceTitle = styled.td`
  min-width: 160px;
`