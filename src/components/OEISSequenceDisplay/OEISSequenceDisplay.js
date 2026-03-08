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
  margin: 12px 0;
  padding: 16px 20px;
  border: 1px solid #e8e4df;
  border-radius: 10px;
  background-color: #ffffff;
  min-width: 300px;
`;

const Title = styled.h3`
  margin: 0 0 10px 0;
  font-size: 0.85rem;
  font-weight: 500;
  color: #1a1612;
  letter-spacing: -0.01em;
`;

const SequenceContainer = styled.div`
  margin-bottom: 14px;
`;

const SequenceText = styled.div`
  font-family: 'SF Mono', 'Fira Code', monospace;
  font-size: 0.8rem;
  color: #6b6560;
  margin-bottom: 6px;
  word-break: break-all;
  line-height: 1.5;
`;

const SequenceInfo = styled.div`
  font-size: 0.75rem;
  color: #9a9088;
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 8px;
`;

const SetButton = styled.button`
  padding: 6px 14px;
  background-color: transparent;
  color: #3c3024;
  border: 1px solid #d4cdc4;
  border-radius: 6px;
  cursor: pointer;
  font-size: 0.8rem;
  font-weight: 500;
  transition: all 0.15s ease;

  &:hover:not(:disabled) {
    background-color: #f0ece7;
    border-color: #b4aa9e;
    color: #1a1612;
  }

  &:disabled {
    background-color: #f0ece8;
    color: #9a9088;
    border-color: #e8e4df;
    cursor: not-allowed;
  }
`;

export default OEISSequenceDisplay;
