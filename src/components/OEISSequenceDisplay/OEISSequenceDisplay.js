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
  margin: 16px 0;
  padding: 16px 20px;
  border: 1px solid hsl(215, 25%, 88%);
  border-radius: 8px;
  background-color: #ffffff;
  min-width: 300px;
  box-shadow: 0 1px 3px hsl(215, 20%, 50%, 0.05);
`;

const Title = styled.h3`
  margin: 0 0 10px 0;
  font-size: 15px;
  font-weight: 600;
  color: hsl(215, 55%, 25%);
`;

const SequenceContainer = styled.div`
  margin-bottom: 14px;
`;

const SequenceText = styled.div`
  font-family: 'SF Mono', 'Fira Code', monospace;
  font-size: 13px;
  color: hsl(215, 20%, 40%);
  margin-bottom: 6px;
  word-break: break-all;
  line-height: 1.6;
`;

const SequenceInfo = styled.div`
  font-size: 12px;
  color: hsl(215, 15%, 55%);
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 10px;
`;

const SetButton = styled.button`
  padding: 8px 16px;
  background-color: hsl(215, 55%, 28%);
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 13px;
  font-weight: 500;
  transition: background-color 0.15s ease;

  &:hover:not(:disabled) {
    background-color: hsl(215, 55%, 38%);
  }

  &:disabled {
    background-color: hsl(215, 15%, 80%);
    cursor: not-allowed;
  }
`;

export default OEISSequenceDisplay;
