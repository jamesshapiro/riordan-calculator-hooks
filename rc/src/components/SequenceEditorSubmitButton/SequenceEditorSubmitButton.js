import React from 'react';
import { DataContext } from '../DataProvider';
import { UserContext } from '../UserProvider';
import styles from './SequenceEditorSubmitButton.module.css';
import { SpinnerInfinity } from 'spinners-react';


function SequenceEditorSubmitButton() {
  const {
    customSequence,
    customSequenceLength,
    addCustomSequence,
    customSequenceTitle,
    setCustomSequenceTitle,
  } = React.useContext(DataContext);
  const { userSequences, setUserSequences } = React.useContext(UserContext);

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
    window.alert('sequence added successfully!');
  }

  return (
    // <StyledSubmitButton onClick={handleCompute}>Compute</StyledSubmitButton>
    <button
      className={styles.styledSubmitButton}
      onClick={() => {
        handleAddSequence();
      }}
    >
      {buttonContents}
    </button>
  );
}

export default SequenceEditorSubmitButton;

