import React from 'react';
import styled from 'styled-components';

const OEISSequenceDisplay = ({
  sequence,
  sequenceId,
  onSetToF,
  onSetToG,
  isLoading,
}) => {
  if (!sequence) return null;

  return (
    <Container>
      <Title>OEIS Sequence {sequenceId}</Title>
      <SequenceContainer>
        <SequenceText>
          {sequence.slice(0, 20).join(', ')}
          {sequence.length > 20 && '...'}
        </SequenceText>
        <SequenceInfo>Length: {sequence.length} terms</SequenceInfo>
      </SequenceContainer>
      <ButtonGroup>
        <SetButton onClick={() => onSetToF(sequence)} disabled={isLoading}>
          Set to F Sequence
        </SetButton>
        <SetButton onClick={() => onSetToG(sequence)} disabled={isLoading}>
          Set to G Sequence
        </SetButton>
      </ButtonGroup>
    </Container>
  );
};

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  margin: 15px 0;
  padding: 15px;
  border: 1px solid #ddd;
  border-radius: 6px;
  background-color: #f9f9f9;
  min-width: 300px;
`;

const Title = styled.h3`
  margin: 0 0 10px 0;
  font-size: 16px;
  color: #333;
`;

const SequenceContainer = styled.div`
  margin-bottom: 15px;
`;

const SequenceText = styled.div`
  font-family: monospace;
  font-size: 14px;
  color: #555;
  margin-bottom: 5px;
  word-break: break-all;
`;

const SequenceInfo = styled.div`
  font-size: 12px;
  color: #777;
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 10px;
`;

const SetButton = styled.button`
  padding: 8px 16px;
  background-color: #28a745;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;

  &:hover:not(:disabled) {
    background-color: #218838;
  }

  &:disabled {
    background-color: #ccc;
    cursor: not-allowed;
  }
`;

export default OEISSequenceDisplay;
