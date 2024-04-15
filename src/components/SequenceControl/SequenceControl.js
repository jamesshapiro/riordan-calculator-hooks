import React from 'react';

import styled from 'styled-components';

import { DataContext } from '../DataProvider';

function SequenceControl({ sequenceId }) {
  const {
    handleAddZero,
    handleAugmentSequence,
    handleTruncateSequence,
    handleLeftShift,
  } = React.useContext(DataContext);

  return (
    <tr>
      <td>{sequenceId}:</td>
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
    </tr>
  );
}

export default SequenceControl;

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
  padding-left: 5px;
  padding-right: 30px;
  &:not(:last-of-type) {
    border-right: 1px solid var(--number-box-border-color);
  }
`;

const TDWrapper = styled.td`
  cursor: pointer;
  display: block;
  border-radius: 0px;
  background-color: var(--number-box-background-color);

  border: 1px solid var(--number-box-border-color);
  width: fit-content;
`;
