import React from 'react';
import styled from 'styled-components';

import { DataContext } from '../DataProvider';

function HSequence() {
  const { matrix, metaMode, hSequence, setHSequence } =
    React.useContext(DataContext);

  if (!matrix) {
    return <></>;
  }

  let parsedMatrix;
  try {
    parsedMatrix = JSON.parse(matrix);
  } catch (e) {
    return <></>;
  }

  const matrixKey =
    metaMode === 'exponential' ? 'exponential' : 'riordan group elem';
  const displayMatrix = parsedMatrix[matrixKey];
  if (!displayMatrix || displayMatrix.length === 0) {
    return <></>;
  }

  const numCols = displayMatrix[0].length;

  function commit(index, value) {
    const next = [...hSequence];
    while (next.length <= index) next.push(0);
    const parsed =
      value === '' || value === '-' ? 0 : parseInt(value, 10);
    next[index] = Number.isNaN(parsed) ? 0 : parsed;
    setHSequence(next);
  }

  return (
    <Wrapper>
      <Title>h-sequence (custom column vector):</Title>
      <Hint>
        Multiplies each matrix row to produce the extra column. Leave entries as
        zero to ignore.
      </Hint>
      <Row>
        {Array.from({ length: numCols }).map((_, idx) => (
          <HBox key={idx}>
            <HInput
              type='text'
              defaultValue={String(hSequence[idx] ?? 0)}
              key={`${idx}-${hSequence[idx] ?? 0}`}
              onFocus={(e) => e.target.select()}
              onBlur={(e) => commit(idx, e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  e.currentTarget.blur();
                }
              }}
              onChange={(e) => {
                let cleaned = e.target.value.replace(/[^0-9-]/g, '');
                if (cleaned.startsWith('-0') && cleaned.length > 2) {
                  cleaned = '-' + cleaned.slice(2);
                } else if (cleaned.startsWith('0') && cleaned.length > 1) {
                  cleaned = cleaned.slice(1);
                }
                if (cleaned.endsWith('-') && cleaned.length > 1) {
                  cleaned = cleaned.slice(0, -1);
                }
                e.target.value = cleaned;
              }}
            />
          </HBox>
        ))}
      </Row>
    </Wrapper>
  );
}

export default HSequence;

const Wrapper = styled.div`
  margin-left: 100px;
  margin-top: 20px;
  margin-bottom: 10px;
`;

const Title = styled.h2`
  font-size: 1.2rem;
  margin: 0 0 4px 0;
  color: var(--header-color);
`;

const Hint = styled.p`
  font-size: 0.85rem;
  color: #555;
  margin: 0 0 8px 0;
`;

const Row = styled.div`
  display: flex;
  flex-direction: row;
  gap: 2px;
`;

const HBox = styled.div`
  background-color: var(--matrix-cell-h-column-background-color);
  border: 1px solid var(--number-box-border-color);
  border-radius: var(--number-box-border-radius);
  min-width: var(--number-box-width);
  height: var(--number-box-height);
  display: flex;
  align-items: center;
  justify-content: center;
`;

const HInput = styled.input`
  width: calc(var(--number-box-width) - 8px);
  height: calc(var(--number-box-height) - 12px);
  border: none;
  background-color: transparent;
  text-align: center;
  font-family: 'Lato', sans-serif;
  font-size: 1rem;
  color: var(--number-box-font-color);

  &:focus {
    outline: 1px solid var(--number-box-hover-font-color);
    background-color: white;
  }
`;
