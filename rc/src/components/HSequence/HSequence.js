import React from 'react';

import { DataContext } from '../DataProvider';
import styles from './HSequence.module.css';

function HSequence() {
  const { matrix, metaMode, hSequence, setHSequence } =
    React.useContext(DataContext);

  if (!matrix) {
    return <></>;
  }

  let parsedMatrix;
  try {
    parsedMatrix = JSON.parse(matrix);
  } catch (e) {
    return <></>;
  }

  const matrixKey =
    metaMode === 'exponential' ? 'exponential' : 'riordan group elem';
  const displayMatrix = parsedMatrix[matrixKey];
  if (!displayMatrix || displayMatrix.length === 0) {
    return <></>;
  }

  const numCols = displayMatrix[0].length;

  function commit(index, value) {
    const next = [...hSequence];
    while (next.length <= index) next.push(0);
    const parsed =
      value === '' || value === '-' ? 0 : parseInt(value, 10);
    next[index] = Number.isNaN(parsed) ? 0 : parsed;
    setHSequence(next);
  }

  return (
    <div className={styles.wrapper}>
      <h2 className={styles.title}>h-sequence (custom column vector):</h2>
      <p className={styles.hint}>
        Multiplies each matrix row to produce the extra column. Leave entries as
        zero to ignore.
      </p>
      <div className={styles.row}>
        {Array.from({ length: numCols }).map((_, idx) => (
          <div className={styles.hBox} key={idx}>
            <input
              className={styles.hInput}
              type='text'
              defaultValue={String(hSequence[idx] ?? 0)}
              key={`${idx}-${hSequence[idx] ?? 0}`}
              onFocus={(e) => e.target.select()}
              onBlur={(e) => commit(idx, e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  e.currentTarget.blur();
                }
              }}
              onChange={(e) => {
                let cleaned = e.target.value.replace(/[^0-9-]/g, '');
                if (cleaned.startsWith('-0') && cleaned.length > 2) {
                  cleaned = '-' + cleaned.slice(2);
                } else if (cleaned.startsWith('0') && cleaned.length > 1) {
                  cleaned = cleaned.slice(1);
                }
                if (cleaned.endsWith('-') && cleaned.length > 1) {
                  cleaned = cleaned.slice(0, -1);
                }
                e.target.value = cleaned;
              }}
            />
          </div>
        ))}
      </div>
    </div>
  );
}

export default HSequence;
