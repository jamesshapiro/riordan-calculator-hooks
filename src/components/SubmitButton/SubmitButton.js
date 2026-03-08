import React from 'react';
import { DataContext } from '../DataProvider';
import styled from 'styled-components';
import { SpinnerInfinity } from 'spinners-react';


function SubmitButton() {
  const { handleCompute, computeWasRequested, matrixWasFetched } =
    React.useContext(DataContext);

  const buttonContents =
    computeWasRequested && !matrixWasFetched ? (
      <SpinnerInfinity
        size={40}
        thickness={100}
        speed={100}
        color='var(--submit-button-border)'
        secondaryColor='white'
      />
    ) : (
      'Compute'
    );

  return (
    // <StyledSubmitButton onClick={handleCompute}>Compute</StyledSubmitButton>
    <StyledSubmitButton
      onClick={() => {
        handleCompute();
      }}
    >
      {buttonContents}
    </StyledSubmitButton>
  );
}

export default SubmitButton;

const StyledSubmitButton = styled.button`
  z-index: 10000;
  margin-top: 8px;
  margin-left: 10px;
  min-width: 88px;
  height: 36px;
  border: 1px solid #1a1612;
  padding: 0 20px;
  border-radius: 8px;
  color: #faf9f7;
  background-color: #1a1612;
  font-size: 0.825rem;
  font-weight: 500;
  letter-spacing: 0.01em;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  &:hover {
    background-color: #3c3024;
    border-color: #3c3024;
    color: #faf9f7;
  }
  &:active {
    background-color: #1a1612;
    transform: scale(0.98);
    color: #faf9f7;
  }
`;
