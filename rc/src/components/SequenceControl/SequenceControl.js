import React from 'react';

import styles from './SequenceControl.module.css';

import { DataContext } from '../DataProvider';
import SequenceComboBox from '../SequenceComboBox';

function SequenceControl({ sequenceId }) {
  const { mode } = React.useContext(DataContext);

  const isHidden =
    (sequenceId === 'f' && ['bell', 'appell', 'twobell'].includes(mode)) ||
    (sequenceId === 'g' && ['derivative', 'associated'].includes(mode));

  return (
    <tr style={{ visibility: isHidden ? 'hidden' : 'revert' }}>
      <td>{sequenceId}:</td>
      <td className={styles.selectWrapper}>
        <SequenceComboBox sequenceId={sequenceId} />
      </td>
    </tr>
  );
}

export default SequenceControl;
