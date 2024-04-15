import React from 'react';

import styled from 'styled-components';

import { DataContext } from '../DataProvider';
import SequenceComboBox from '../SequenceComboBox';

function SequenceControl({ sequenceId }) {
  const {
    mode,
    handleAddZero,
    handleAugmentSequence,
    handleTruncateSequence,
    handleLeftShift,
  } = React.useContext(DataContext);

  return (
    <Wrapper sequenceId={sequenceId} mode={mode}>
      <td>{sequenceId}:</td>
      <SelectWrapper>
        <SequenceComboBox sequenceId={sequenceId} />
      </SelectWrapper>
      <TDWrapper>
        <ButtonWrapper onClick={() => handleAddZero(sequenceId)}>
          +0
        </ButtonWrapper>
        <ButtonWrapper onClick={() => handleLeftShift(sequenceId)}>
          {'<'}
        </ButtonWrapper>
        <ButtonWrapper onClick={handleAugmentSequence}>+</ButtonWrapper>
        <ButtonWrapper onClick={handleTruncateSequence}>-</ButtonWrapper>
      </TDWrapper>
    </Wrapper>
  );
}

export default SequenceControl;

const Wrapper = styled.tr`
  visibility: ${(p) =>
    (p.sequenceId === 'f' && ['bell', 'appell', 'twobell'].includes(p.mode)) ||
    (p.sequenceId === 'g' && ['derivative', 'associated'].includes(p.mode))
      ? 'hidden'
      : 'revert'};
`;

const ButtonWrapper = styled.button`
  cursor: pointer;
  height: var(--number-box-height);
  width: var(--min-button-width);
  &:hover {
    background-color: var(--number-box-hover-background-color);
    color: var(--number-box-hover-font-color);
  }
  &:active {
    background-color: var(--active-button-color);
    color: white;
    transform: scale(1.1);
  }
  padding-left: 10px;
  padding-right: 15px;
  &:not(:last-of-type) {
    border-right: 1px solid var(--number-box-border-color);
  }
`;

const SelectWrapper = styled.td`
  width: 210px;
  display: relative;
  flex-direction: column;
  background-color: var(--select-td-background);
`;

const TDWrapper = styled.td`
  cursor: pointer;
  display: inline-block;
  border-radius: 0px;
  background-color: var(--number-box-background-color);

  border: 1px solid var(--number-box-border-color);
  width: fit-content;
`;
