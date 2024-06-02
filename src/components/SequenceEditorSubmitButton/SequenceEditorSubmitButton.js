import React from 'react';
import { DataContext } from '../DataProvider';
import { UserContext } from '../UserProvider';
import styled from 'styled-components';
import { SpinnerInfinity } from 'spinners-react';
import useSound from 'use-sound';
import submitSound from '../../sounds/compute2.wav';

import { SoundContext } from '../SoundProvider';

function SequenceEditorSubmitButton() {
  const {
    customSequence,
    customSequenceLength,
    addCustomSequence,
    customSequenceTitle,
    setCustomSequenceTitle,
  } = React.useContext(DataContext);
  const { userSequences, setUserSequences } = React.useContext(UserContext);
  const { volume } = React.useContext(SoundContext);
  const [playSubmit] = useSound(submitSound, { volume });

  const buttonContents = 'Add Sequence';

  function handleAddSequence() {
    if (customSequenceTitle.length === 0) {
      window.alert('Sequence must have a title!');
      return;
    }
    const existingSequenceTitles = userSequences.map(
      (sequence) => sequence.name
    );
    if (existingSequenceTitles.includes(customSequenceTitle)) {
      window.alert(
        'Sequence names must be unique. Choose a different title for your sequence!'
      );
      return;
    }
    const prefixValues = customSequence.slice(0, customSequenceLength);
    addCustomSequence(prefixValues, customSequenceTitle);
    setUserSequences((oldValue) => {
      return [
        ...oldValue,
        { name: customSequenceTitle, id: 'dummy_id', sequence: prefixValues },
      ];
    });
    setCustomSequenceTitle('');
    playSubmit();
    window.alert('sequence added successfully!');
  }

  return (
    // <StyledSubmitButton onClick={handleCompute}>Compute</StyledSubmitButton>
    <StyledSubmitButton
      onClick={() => {
        handleAddSequence();
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
