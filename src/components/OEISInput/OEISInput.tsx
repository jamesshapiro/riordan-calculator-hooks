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
  margin: 10px 0;
`;

const InputGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const Label = styled.span`
  font-size: 16px;
  font-weight: 500;
  color: #333;
`;

const Input = styled.input`
  width: 80px;
  padding: 8px 12px;
  border: 2px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
  font-family: monospace;

  &:focus {
    outline: none;
    border-color: #007bff;
  }

  &:disabled {
    background-color: #f5f5f5;
    cursor: not-allowed;
  }
`;

const FetchButton = styled.button`
  padding: 8px 16px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;

  &:hover:not(:disabled) {
    background-color: #0056b3;
  }

  &:disabled {
    background-color: #ccc;
    cursor: not-allowed;
  }
`;

const ErrorMessage = styled.div`
  color: #dc3545;
  font-size: 12px;
  margin-top: 4px;
`;

export default OEISInput;
