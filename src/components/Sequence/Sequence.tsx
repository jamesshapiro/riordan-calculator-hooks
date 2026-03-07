'use client';

import React from 'react';
import { DataContext } from '@/components/DataProvider/DataProvider';
import NumberBox from '@/components/NumberBox/NumberBox';
import ActionBox from '@/components/ActionBox/ActionBox';
import Spacer from '@/components/Spacer/Spacer';
import { motion } from 'framer-motion';
import { range } from '@/utils';
import styled from 'styled-components';

function Sequence({ sequenceId }: { sequenceId: string }) {
  const { sequenceLength, gSequence, fSequence, handleSequenceChange, fJustIncreased, gJustIncreased, mode } = React.useContext(DataContext);
  const sequence = sequenceId === 'g' ? gSequence : fSequence;

  function handleNumberChange(index: number, newValue: string) {
    const newSequence = [...sequence];
    const targetIndex = index % sequenceLength;
    newSequence[targetIndex] = parseInt(newValue);
    handleSequenceChange(sequenceId, newSequence);
  }

  const sequenceValue = sequenceId === 'g' ? gSequence : fSequence;
  const didJustIncrease = sequenceId === 'g' ? gJustIncreased : fJustIncreased;
  const delta = sequenceId === 'f' ? sequenceLength : 0;

  const elements = sequence.slice(0, Math.min(sequenceLength, fSequence.length, gSequence.length)).map((num: number, index: number) => {
    const isLast = index === sequenceLength - 1;
    const isFirst = index === 0;
    const distanceToSequenceEnd = sequence.length - 1 - index;
    const firstInitial = didJustIncrease && isFirst ? { scale: 0 } : undefined;
    const firstAnimate = didJustIncrease && isFirst ? { scale: 1 } : undefined;
    const damping = isFirst ? 50 : Math.max(100 - 10 * index, 30);
    const seqZIndex = sequenceId === 'f' ? { zIndex: 10 + distanceToSequenceEnd - index, position: 'relative' as const } : {};
    const disableNumberBox = (['bell', 'appell', 'twobell'].includes(mode) && sequenceId === 'f') || (['derivative', 'associated'].includes(mode) && sequenceId === 'g');

    return (
      <td key={`${index + delta}-${num}`}>
        <motion.div layoutId={`${sequenceId}-${distanceToSequenceEnd}-to-last`} key={`${sequenceId}-${distanceToSequenceEnd}-to-last`} initial={firstInitial} animate={firstAnimate} style={seqZIndex} transition={{ type: 'spring', stiffness: 300, damping }}>
          <NumberBox value={num} index={index + delta} sequenceId={sequenceId} sequenceValue={sequenceValue} key={`${index + delta}-${num}`} isFirst={isFirst} isLast={isLast} onSubmit={handleNumberChange} disabled={disableNumberBox} />
        </motion.div>
      </td>
    );
  });

  const disablePrepend = (['bell', 'appell', 'twobell'].includes(mode) && sequenceId === 'f') || (['derivative', 'associated'].includes(mode) && sequenceId === 'g');
  const prependZeroElement = (
    <td key={`prependzero-${delta}`} style={{ zIndex: 0 }}>
      <motion.div layoutId={`${sequenceId}-prepend-box`} key={`${sequenceId}-prepend-box`} style={{ zIndex: 0 }} transition={{ type: 'spring', stiffness: 300, damping: 30 }}>
        <ActionBox actionType='prependZero' sequenceId={sequenceId} sequenceValue={sequenceValue} key={`prependzero-${delta}`} onSubmit={handleNumberChange} enabled={!disablePrepend} />
      </motion.div>
    </td>
  );

  const shorterSequenceLength = Math.min(fSequence.length, gSequence.length);
  const numAugmentBoxes = shorterSequenceLength - sequenceLength;
  const mysteryBoxes = range(numAugmentBoxes).map((index: number) => {
    const distanceToSequenceEnd = sequence.length - sequenceLength - 1 - index;
    const opacity = Math.max(1.5 / (index + 1), 0.15);
    return (
      <td key={`augment-${index}`} style={{ zIndex: 0, opacity }}>
        <motion.div layoutId={`${sequenceId}-${distanceToSequenceEnd}-to-last`} key={`${sequenceId}-${distanceToSequenceEnd}-to-last`} style={{ zIndex: 0 }} initial={{ opacity }} animate={{ opacity }} transition={{ type: 'spring', stiffness: 600, damping: 45 }}>
          <ActionBox actionType='augment' sequenceId={sequenceId} sequenceValue={sequenceValue} key={`augment-${delta}`} enabled={false} />
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
