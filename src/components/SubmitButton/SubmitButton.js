import React from 'react';
import { DataContext } from '../DataProvider';
import styled from 'styled-components';
import { SpinnerInfinity } from 'spinners-react';
import useSound from 'use-sound';
import submitSound from '../../sounds/compute2.wav';

function SubmitButton() {
  const { handleCompute, computeWasRequested, matrixWasFetched } =
    React.useContext(DataContext);
  const [playSubmit] = useSound(submitSound);

  const buttonContents =
    computeWasRequested && !matrixWasFetched ? (
      <SpinnerInfinity
        size={40}
        thickness={100}
        speed={100}
        color="var(--submit-button-border)"
        secondaryColor="white"
      />
    ) : (
      'Compute'
    );

  return (
    // <StyledSubmitButton onClick={handleCompute}>Compute</StyledSubmitButton>
    <StyledSubmitButton
      onClick={() => {
        handleCompute();
        playSubmit();
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
  width: 65px;
  /* width: fit-content; */
  height: 19px;
  border: 1px solid var(--submit-button-border);
  padding: 10px;
  border-radius: var(--number-box-border-radius);
  color: white;
  background-color: var(--submit-button-background);
  &:hover {
    background-image: revert;
    background-color: var(--hover-button-color);
    color: white;
  }
  &:active {
    background-color: var(--active-button-color);
    color: white;
  }
`;
