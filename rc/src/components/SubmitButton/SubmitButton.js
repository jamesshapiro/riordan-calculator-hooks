import React from 'react';
import { DataContext } from '../DataProvider';
import styles from './SubmitButton.module.css';
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
    <button
      className={styles.styledSubmitButton}
      onClick={() => {
        handleCompute();
      }}
    >
      {buttonContents}
    </button>
  );
}

export default SubmitButton;
