import React from 'react';
import { DataContext } from '../DataProvider';
import styled from 'styled-components';

function SubmitButton() {
  const { handleCompute } = React.useContext(DataContext);

  return (
    <StyledSubmitButton onClick={handleCompute}>Compute</StyledSubmitButton>
  );
}

export default SubmitButton;

const StyledSubmitButton = styled.button`
  z-index: 10000;
  margin: 0 auto;
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
