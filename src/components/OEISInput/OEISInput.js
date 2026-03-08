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
  margin: 8px 0;
`;

const InputGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const Label = styled.span`
  font-size: 0.85rem;
  font-weight: 500;
  color: #3c3024;
  font-variant-numeric: tabular-nums;
`;

const Input = styled.input`
  width: 80px;
  padding: 7px 12px;
  border: 1px solid #d4cdc4;
  border-radius: 6px;
  font-size: 0.85rem;
  font-family: 'SF Mono', 'Fira Code', monospace;
  color: #1a1612;
  background: #ffffff;
  transition: border-color 0.15s ease;

  &:focus {
    outline: none;
    border-color: #b4aa9e;
    box-shadow: 0 0 0 3px rgba(60, 48, 36, 0.08);
  }

  &:disabled {
    background-color: #f0ece8;
    cursor: not-allowed;
    color: #9a9088;
  }
`;

const FetchButton = styled.button`
  padding: 7px 16px;
  background-color: #1a1612;
  color: #faf9f7;
  border: 1px solid #1a1612;
  border-radius: 6px;
  cursor: pointer;
  font-size: 0.8rem;
  font-weight: 500;
  letter-spacing: 0.01em;
  transition: all 0.2s ease;

  &:hover:not(:disabled) {
    background-color: #3c3024;
    border-color: #3c3024;
  }

  &:disabled {
    background-color: #d4cdc4;
    border-color: #d4cdc4;
    color: #9a9088;
    cursor: not-allowed;
  }
`;

const ErrorMessage = styled.div`
  color: #c45340;
  font-size: 0.75rem;
  margin-top: 4px;
  font-weight: 500;
`;

export default OEISInput;
