import React from 'react';
import styles from './OEISSequenceDisplay.module.css';

const OEISSequenceDisplay = ({
  sequence,
  sequenceId,
  onSetToF,
  onSetToG,
  onSetToH,
  isLoading,
}) => {
  if (!sequence) return null;

  return (
    <div className={styles.container}>
      <h3 className={styles.title}>OEIS Sequence {sequenceId}</h3>
      <div className={styles.sequenceContainer}>
        <div className={styles.sequenceText}>
          {sequence.slice(0, 20).join(', ')}
          {sequence.length > 20 && '...'}
        </div>
        <div className={styles.sequenceInfo}>Length: {sequence.length} terms</div>
      </div>
      <div className={styles.buttonGroup}>
        <button className={styles.setButton} onClick={() => onSetToF(sequence)} disabled={isLoading}>
          Set to F Sequence
        </button>
        <button className={styles.setButton} onClick={() => onSetToG(sequence)} disabled={isLoading}>
          Set to G Sequence
        </button>
        {onSetToH && (
          <button className={styles.setButton} onClick={() => onSetToH(sequence)} disabled={isLoading}>
            Set to H Sequence
          </button>
        )}
      </div>
    </div>
  );
};

export default OEISSequenceDisplay;
