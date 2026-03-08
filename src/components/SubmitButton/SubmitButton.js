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
  margin-top: 55px;
  margin-left: 10px;
  min-width: 90px;
  height: auto;
  border: 1px solid var(--submit-button-border);
  padding: 10px 20px;
  border-radius: var(--number-box-border-radius);
  color: white;
  font-weight: 600;
  font-size: 14px;
  letter-spacing: 0.02em;
  background-color: var(--submit-button-background);
  transition: background-color 0.15s ease, box-shadow 0.15s ease;
  box-shadow: 0 1px 3px hsl(215, 50%, 20%, 0.15);
  &:hover {
    background-color: var(--hover-button-color);
    color: white;
    box-shadow: 0 2px 6px hsl(215, 50%, 20%, 0.2);
  }
  &:active {
    background-color: var(--active-button-color);
    color: white;
    box-shadow: none;
  }
`;
