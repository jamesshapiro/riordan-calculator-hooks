import React from 'react';

import { DataContext } from '../DataProvider';
import NumberBox from '../NumberBox';

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
    return (
      <td>
        <NumberBox
          value={num}
          index={index + delta}
          key={`${index + delta}-${num}`}
          onSubmit={handleNumberChange}
        />
      </td>
    );
  });

  return <Wrapper>{elements}</Wrapper>;
}

export default Sequence;

const Wrapper = styled.tr`
  color: var(--number-box-font-color);
`;
