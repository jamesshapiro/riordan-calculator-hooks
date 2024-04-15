import React from 'react';

import { DataContext } from '../DataProvider';
import NumberBox from '../NumberBox';

import styled from 'styled-components';

function Sequence({ sequenceId }) {
  const {
    sequenceLength,
    gSequence,
    fSequence,
    handleAddZero,
    handleAugmentSequence,
    handleTruncateSequence,
    handleLeftShift,
  } = React.useContext(DataContext);
  const sequence = sequenceId === 'g' ? gSequence : fSequence;

  const delta = sequenceId === 'f' ? sequenceLength : 0;
  const elements = sequence.slice(0, sequenceLength).map((num, index) => {
    return (
      <td>
        <NumberBox
          value={num}
          index={index + delta}
          key={`${index + delta}-${num}`}
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
