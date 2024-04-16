import React from 'react';

import { DataContext } from '../DataProvider';
import NumberBox from '../NumberBox';
import ActionBox from '../ActionBox';
import Spacer from '../Spacer';

import styled from 'styled-components';

function Sequence({ sequenceId }) {
  const { sequenceLength, gSequence, fSequence, handleSequenceChange } =
    React.useContext(DataContext);
  const sequence = sequenceId === 'g' ? gSequence : fSequence;
  function handleNumberChange(index, newValue) {
    const newSequence = [...sequence];
    const targetIndex = index % sequenceLength;
    newSequence[targetIndex] = newValue;
    handleSequenceChange(sequenceId, newSequence);
  }

  const delta = sequenceId === 'f' ? sequenceLength : 0;
  const elements = sequence.slice(0, sequenceLength).map((num, index) => {
    const isLast = index === sequenceLength - 1;
    const isFirst = index === 0;
    return (
      <td key={`${index + delta}-${num}`}>
        <NumberBox
          value={num}
          index={index + delta}
          sequenceId={sequenceId}
          key={`${index + delta}-${num}`}
          isFirst={isFirst}
          isLast={isLast}
          onSubmit={handleNumberChange}
        />
      </td>
    );
  });
  const prependZeroElement = (
    <td key={`prependzero-${delta}`}>
      <ActionBox
        actionType={'prependZero'}
        sequenceId={sequenceId}
        key={`prependzero-${delta}`}
        onSubmit={handleNumberChange}
      />
    </td>
  );

  const augmentElement =
    sequenceLength < Math.min(fSequence.length, gSequence.length) ? (
      <td key={`augment-${delta}`}>
        <ActionBox
          actionType={'augment'}
          sequenceId={sequenceId}
          key={`augment-${delta}`}
          onSubmit={handleNumberChange}
        />
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
