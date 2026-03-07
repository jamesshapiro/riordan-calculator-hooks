'use client';

import React from 'react';
import { DataContext } from '@/components/DataProvider/DataProvider';
import SequenceEditorNumberBox from '@/components/SequenceEditorNumberBox/SequenceEditorNumberBox';
import SequenceEditorActionBox from '@/components/SequenceEditorActionBox/SequenceEditorActionBox';
import Spacer from '@/components/Spacer/Spacer';
import { motion } from 'framer-motion';
import { range } from '@/utils';
import styled from 'styled-components';

function SequenceEditorSequence({ sequenceValues, name, index = 0 }: any) {
  const { customSequence, setCustomSequence, customSequenceLength } = React.useContext(DataContext);

  function handleNumberChange(idx: number, newValue: string) {
    setCustomSequence((oldSequence: number[]) => {
      const newSequence = [...oldSequence];
      newSequence[idx] = parseInt(newValue);
      return newSequence;
    });
  }

  function handleSequenceChange(newSequence: number[]) { setCustomSequence(newSequence); }

  const elements = customSequence.slice(0, Math.min(customSequenceLength, customSequence.length)).map((num: number, idx: number) => {
    const isLast = idx === customSequenceLength - 1;
    const isFirst = idx === 0;
    const distanceToSequenceEnd = customSequence.length - 1 - idx;
    const damping = isFirst ? 50 : Math.max(100 - 10 * idx, 30);
    const seqZIndex = { zIndex: 10 + idx, position: 'relative' as const };

    return (
      <td key={`${idx}-${num}`}>
        <motion.div layoutId={`${idx}-${distanceToSequenceEnd}-to-last`} key={`${idx}-${distanceToSequenceEnd}-to-last`} style={seqZIndex} transition={{ type: 'spring', stiffness: 300, damping }}>
          <SequenceEditorNumberBox value={num} index={idx} sequenceId={idx} sequenceValue={customSequence} key={`${idx}-${num}`} isFirst={isFirst} isLast={isLast} handleSequenceChange={handleSequenceChange} onSubmit={handleNumberChange} />
        </motion.div>
      </td>
    );
  });

  const prependZeroElement = (
    <td key='prependzero-0' style={{ zIndex: 0 }}>
      <motion.div layoutId={`seqed-${index}-prepend-box`} key={`seqed-${index}-prepend-box`} style={{ zIndex: 0 }} transition={{ type: 'spring', stiffness: 300, damping: 30 }}>
        <SequenceEditorActionBox actionType='prependZero' sequenceId={`seqed-${index}`} sequenceValue={customSequence} key='prependzero-0' enabled={true} />
      </motion.div>
    </td>
  );

  const numAugmentBoxes = Math.max(customSequence.length - customSequenceLength, 0);
  const mysteryBoxes = range(numAugmentBoxes).map((idx: number) => {
    const distanceToSequenceEnd = customSequence.length - customSequenceLength - 1 - idx;
    const opacity = Math.max(1.5 / (idx + 1), 0.15);
    return (
      <td key={`augment-${idx}`} style={{ zIndex: 0, opacity }}>
        <motion.div layoutId={`seqed-${idx}-${distanceToSequenceEnd}-to-last`} key={`seqed-${idx}-${distanceToSequenceEnd}-to-last`} style={{ zIndex: 0 }} initial={{ opacity }} animate={{ opacity }} transition={{ type: 'spring', stiffness: 600, damping: 45 }}>
          <SequenceEditorActionBox actionType='augment' sequenceId={`seqed-${idx}`} sequenceValue={sequenceValues} key='augment-0' />
        </motion.div>
      </td>
    );
  });

  return (<Wrapper><SequenceTitle>{name}</SequenceTitle>{prependZeroElement}<Spacer />{elements}{mysteryBoxes}</Wrapper>);
}

export default SequenceEditorSequence;

const Wrapper = styled.tr`margin-top: 100px; color: var(--number-box-font-color);`;
const SequenceTitle = styled.td`min-width: 160px;`;
