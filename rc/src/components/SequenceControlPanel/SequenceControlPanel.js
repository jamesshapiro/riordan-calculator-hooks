import React from 'react';

import styles from './SequenceControlPanel.module.css';
import SequenceControl from '../SequenceControl';

function SequenceControlPanel() {
  return (
    <div className={styles.wrapper}>
      <table>
        <tbody>
          <SequenceControl sequenceId={'g'} />
          <SequenceControl sequenceId={'f'} />
        </tbody>
      </table>
    </div>
  );
}

export default SequenceControlPanel;
