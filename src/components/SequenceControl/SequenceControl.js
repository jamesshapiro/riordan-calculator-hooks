import React from 'react';

import styled from 'styled-components';

import { DataContext } from '../DataProvider';
import SequenceComboBox from '../SequenceComboBox';

function SequenceControl({ sequenceId }) {
  const { mode } = React.useContext(DataContext);

  return (
    <Wrapper $sequenceid={sequenceId} mode={mode}>
      <td>{sequenceId}:</td>
      <SelectWrapper>
        <SequenceComboBox sequenceId={sequenceId} />
      </SelectWrapper>
    </Wrapper>
  );
}

export default SequenceControl;

const Wrapper = styled.tr`
  visibility: ${(p) =>
    (p.$sequenceid === 'f' && ['bell', 'appell', 'twobell'].includes(p.mode)) ||
    (p.$sequenceid === 'g' && ['derivative', 'associated'].includes(p.mode))
      ? 'hidden'
      : 'revert'};
`;

const SelectWrapper = styled.td`
  min-width: 210px;
  display: relative;
  flex-direction: column;
  /* background-color: var(--select-td-background); */
  height: var(--number-box-height);
`;
