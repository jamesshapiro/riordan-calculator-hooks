import React from 'react';

import { DataContext } from '../DataProvider';
import NumberBox from '../NumberBox';

import styled from 'styled-components';

function Sequence({ initialSequence, sequenceId }) {
  const { sequenceLength } = React.useContext(DataContext);
  console.log(sequenceLength);

  const [sequence, setSequence] = React.useState(initialSequence);
  const delta = sequenceId === 'f' ? sequenceLength : 0;
  return (
    <Wrapper>
      <td>{sequenceId}:</td>
      <TDWrapper>
        <ButtonWrapper>+0</ButtonWrapper>
      </TDWrapper>
      <TDSpace />
      {sequence.slice(0, sequenceLength).map((num, index) => {
        return (
          <td>
            <NumberBox initialValue={num} index={index + delta} />
          </td>
        );
      })}
    </Wrapper>
  );
}

export default Sequence;

const Wrapper = styled.tr`
  color: var(--number-box-font-color);
`;

const ButtonWrapper = styled.button``;

const TDWrapper = styled.td`
  border-radius: 0px;
  background-color: var(--number-box-background-color);
  &:hover {
    background-color: var(--number-box-hover-background-color);
    color: var(--number-box-hover-font-color);
  }
  &:active {
    background-color: var(--active-button-color);
    color: white;
    transform: scale(1.1);
  }
  border: 1px solid var(--number-box-border-color);
  min-width: var(--min-cell-width);
  text-align: center;
`;

const TDSpace = styled.td`
  min-width: var(--min-cell-width);
`;
