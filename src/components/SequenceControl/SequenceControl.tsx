'use client';

import React from 'react';
import styled from 'styled-components';
import { DataContext } from '../DataProvider/DataProvider';
import SequenceComboBox from '../SequenceComboBox/SequenceComboBox';

function SequenceControl({ sequenceId }: { sequenceId: string }) {
  const { mode } = React.useContext(DataContext);
  return (
    <Wrapper $sequenceid={sequenceId} $mode={mode}>
      <td>{sequenceId}:</td>
      <SelectWrapper><SequenceComboBox sequenceId={sequenceId} /></SelectWrapper>
    </Wrapper>
  );
}

export default SequenceControl;

const Wrapper = styled.tr<{ $sequenceid: string; $mode: string }>`
  visibility: ${(p) =>
    (p.$sequenceid === 'f' && ['bell', 'appell', 'twobell'].includes(p.$mode)) ||
    (p.$sequenceid === 'g' && ['derivative', 'associated'].includes(p.$mode))
      ? 'hidden' : 'revert'};
`;

const SelectWrapper = styled.td`
  min-width: 210px; display: relative; flex-direction: column; height: var(--number-box-height);
`;
