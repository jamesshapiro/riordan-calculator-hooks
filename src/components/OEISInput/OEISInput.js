import React, { useState } from 'react';
import styled from 'styled-components';

const OEISInput = ({ onFetchSequence, isLoading }) => {
  const [inputValue, setInputValue] = useState('');
  const [error, setError] = useState('');

  const handleInputChange = (e) => {
    const value = e.target.value;
    setInputValue(value);
    setError('');

    if (value && !/^\d{1,6}$/.test(value)) {
      setError('Please enter up to 6 digits');
    }
  };

  const handleFetch = () => {
    if (!/^\d{1,6}$/.test(inputValue)) {
      setError('Please enter up to 6 digits');
      return;
    }

    if (inputValue.length < 6) {
      setError('Please enter exactly 6 digits (e.g., 000108)');
      return;
    }

    const oeisId = `A${inputValue}`;
    onFetchSequence(oeisId);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleFetch();
    }
  };

  return (
    <Container>
      <InputGroup>
        <Label>A</Label>
        <Input
          type='text'
          value={inputValue}
          onChange={handleInputChange}
          onKeyPress={handleKeyPress}
          placeholder='Ex: 000108'
          maxLength={6}
          disabled={isLoading}
        />
        <FetchButton
          onClick={handleFetch}
          disabled={isLoading || !inputValue || inputValue.length < 6 || error}
        >
          {isLoading ? 'Fetching...' : 'Fetch from OEIS'}
        </FetchButton>
      </InputGroup>
      {error && <ErrorMessage>{error}</ErrorMessage>}
    </Container>
  );
};

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  margin: 12px 0;
`;

const InputGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const Label = styled.span`
  font-size: 15px;
  font-weight: 600;
  color: hsl(215, 55%, 25%);
`;

const Input = styled.input`
  width: 80px;
  padding: 8px 12px;
  border: 1px solid hsl(215, 25%, 85%);
  border-radius: 6px;
  font-size: 14px;
  font-family: 'SF Mono', 'Fira Code', monospace;
  color: hsl(215, 55%, 25%);
  transition: border-color 0.15s ease, box-shadow 0.15s ease;

  &:focus {
    outline: none;
    border-color: hsl(215, 55%, 50%);
    box-shadow: 0 0 0 3px hsl(215, 55%, 50%, 0.1);
  }

  &:disabled {
    background-color: hsl(215, 15%, 96%);
    cursor: not-allowed;
  }
`;

const FetchButton = styled.button`
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

const ErrorMessage = styled.div`
  color: hsl(0, 60%, 45%);
  font-size: 12px;
  font-weight: 500;
  margin-top: 6px;
`;

export default OEISInput;
