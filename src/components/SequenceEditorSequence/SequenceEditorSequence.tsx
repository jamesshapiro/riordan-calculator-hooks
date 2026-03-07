'use client';

import React from 'react';

import { DataContext } from '../DataProvider/DataProvider';
import SequenceEditorNumberBox from '../SequenceEditorNumberBox/SequenceEditorNumberBox';
import SequenceEditorActionBox from '../SequenceEditorActionBox/SequenceEditorActionBox';
import Spacer from '../Spacer/Spacer';
import { motion } from 'framer-motion';
import { range } from '../../utils';

import styled from 'styled-components';

interface SequenceEditorSequenceProps {
  sequenceValues?: number[];
  name?: string;
  index?: number;
}

function SequenceEditorSequence({
  sequenceValues,
  name,
  index = 0,
}: SequenceEditorSequenceProps) {
  const { customSequence, setCustomSequence, customSequenceLength } =
    React.useContext(DataContext);

  function handleNumberChange(index: number, newValue: number) {
    setCustomSequence((oldSequence) => {
      const newSequence = [...oldSequence];
      newSequence[index] = newValue;
      return newSequence;
    });
  }

  function handleSequenceChange(newSequence: number[]) {
    setCustomSequence(newSequence);
  }

  const elements = customSequence
    .slice(0, Math.min(customSequenceLength, customSequence.length))
    .map((num, index) => {
      const isFirst = index === 0;
      const distanceToSequenceEnd = customSequence.length - 1 - index;

      const damping = isFirst ? 50 : Math.max(100 - 10 * index, 30);
      const seqZIndex = {
        zIndex: 10 + index,
        position: 'relative' as const,
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
            transition={{
              type: 'spring',
              stiffness: 300,
              damping: damping,
            }}
          >
            <SequenceEditorNumberBox
              value={num}
              index={index + delta}
              sequenceId={index}
              sequenceValue={customSequence}
              key={`${index + delta}-${num}`}
              isFirst={isFirst}
              handleSequenceChange={handleSequenceChange}
              onSubmit={handleNumberChange}
              zIndex={10 + index}
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
          actionType="prependZero"
          sequenceId={`seqed-${index}`}
          sequenceValue={customSequence}
          key={`prependzero-${delta}`}
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
    const opacity = Math.max(1.5 / (index + 1), 0.15);

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
            damping: 45,
            ...opacityTiming,
          }}
        >
          <SequenceEditorActionBox
            actionType="augment"
            sequenceId={`seqed-${index}`}
            sequenceValue={sequenceValues ?? customSequence}
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
