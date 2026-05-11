import React from 'react';

import styles from './ActionBox.module.css';
import { DataContext } from '../DataProvider';


import TooltipWrapper from '../TooltipWrapper';

function ActionBox({ actionType, sequenceId, sequenceValue, enabled }) {

  const { handleSelectSequence, handleSequenceChange } =
    React.useContext(DataContext);
  const symbol = actionType === 'prependZero' ? '>>' : '?';

  function handleClick() {
    if (actionType === 'prependZero') {
      // handleAddZero(sequenceId);
      handleSequenceChange(sequenceId, [0, ...sequenceValue]);
    }
    handleSelectSequence(sequenceId, 'custom');
  }

  const onClickAction = enabled ? handleClick : null;

  const wrapperClassName = `${styles.wrapper} ${enabled ? styles.wrapperEnabled : styles.wrapperDisabled}`;

  let result = (
    <div className={wrapperClassName} onClick={onClickAction}>
      <div className={styles.innerContainer}>
        <div className={styles.innerContainer}>
          <p className={styles.innerElement}>{symbol}</p>
        </div>
      </div>
    </div>
  );

  if (actionType === 'prependZero') {
    result = (
      <TooltipWrapper
        message='Prepend a Zero'
        side='top'
        sideOffset={5}
        arrowshiftX='0'
        arrowshiftY='0'
      >
        {result}
      </TooltipWrapper>
    );
  }
  if (!enabled && actionType === 'prependZero') {
    result = <></>;
  }
  return result;
}

export default ActionBox;
