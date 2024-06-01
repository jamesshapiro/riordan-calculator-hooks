import React from 'react';
import { DataContext } from '../DataProvider';
import styled from 'styled-components';
import { SpinnerInfinity } from 'spinners-react';
import useSound from 'use-sound';
import submitSound from '../../sounds/compute2.wav';

import { SoundContext } from '../SoundProvider';

function SequenceEditorSubmitButton() {
  const { customSequence, customSequenceLength, addCustomSequence } =
    React.useContext(DataContext);
  const { volume } = React.useContext(SoundContext);
  const [playSubmit] = useSound(submitSound, { volume });

  const buttonContents = 'Add Sequence';

  function handleAddSequence() {
    addCustomSequence(
      customSequence.slice(0, customSequenceLength),
      'dummy title'
    );
  }

  return (
    // <StyledSubmitButton onClick={handleCompute}>Compute</StyledSubmitButton>
    <StyledSubmitButton
      onClick={() => {
        handleAddSequence();
        playSubmit();
      }}
    >
      {buttonContents}
    </StyledSubmitButton>
  );
}

export default SequenceEditorSubmitButton;

const StyledSubmitButton = styled.button`
  z-index: 10000;
  margin-top: 55px;
  margin-left: 200px;
  min-width: 105px;
  width: fit-content;
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
