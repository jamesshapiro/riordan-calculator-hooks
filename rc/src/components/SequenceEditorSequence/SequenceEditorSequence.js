import React from 'react';

import { DataContext } from '../DataProvider';
import SequenceEditorNumberBox from '../SequenceEditorNumberBox';
import SequenceEditorActionBox from '../SequenceEditorActionBox';
import Spacer from '../Spacer';
import { motion } from 'framer-motion';
import { range } from '../../utils';

import styled from 'styled-components';

function SequenceEditorSequence({ sequenceValues, name, index = 0 }) {
  // const [sequence, setSequence] = React.useState([
  // 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
  // ]);
  // const [sequenceLength, setSequenceLength] = React.useState(7);

  const { customSequence, setCustomSequence, customSequenceLength } =
    React.useContext(DataContext);

  function handleNumberChange(index, newValue) {
    setCustomSequence((oldSequence) => {
      const newSequence = [...oldSequence];
      newSequence[index] = parseInt(newValue);
      return newSequence;
    });
  }

  function handleSequenceChange(newSequence) {
    setCustomSequence(newSequence);
  }

  const elements = customSequence
    .slice(0, Math.min(customSequenceLength, customSequence.length))
    .map((num, index) => {
      const isLast = index === customSequenceLength - 1;
      const isFirst = index === 0;
      const distanceToSequenceEnd = customSequence.length - 1 - index;

      const damping = isFirst ? 50 : Math.max(100 - 10 * index, 30);
      const seqZIndex = {
        zIndex: 10 + index,
        position: 'relative',
      };
      const delta = 0;

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
            <SequenceEditorNumberBox
              value={num}
              index={index + delta}
              sequenceId={index}
              sequenceValue={customSequence}
              key={`${index + delta}-${num}`}
              isFirst={isFirst}
              isLast={isLast}
              handleSequenceChange={handleSequenceChange}
              onSubmit={handleNumberChange}
            />
          </motion.div>
        </td>
      );
    });
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
        <SequenceEditorActionBox
          actionType={'prependZero'}
          sequenceId={`seqed-${index}`}
          sequenceValue={customSequence}
          key={`prependzero-${delta}`}
          onSubmit={handleNumberChange}
          enabled={true}
        />
      </motion.div>
    </td>
  );

  const numAugmentBoxes = Math.max(
    customSequence.length - customSequenceLength,
    0
  );
  const mysteryBoxes = range(numAugmentBoxes).map((index) => {
    const distanceToSequenceEnd =
      customSequence.length - customSequenceLength - 1 - index;
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
          <SequenceEditorActionBox
            actionType={'augment'}
            sequenceId={`seqed-${index}`}
            sequenceValue={sequenceValues}
            key={`augment-${delta}`}
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
  margin-top: 100px;
  color: var(--number-box-font-color);
`;

const SequenceTitle = styled.td`
  min-width: 160px;
`;
