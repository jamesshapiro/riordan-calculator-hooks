import React from 'react';

import styles from './SequenceEditorActionBox.module.css';
import { DataContext } from '../DataProvider';

import TooltipWrapper from '../TooltipWrapper';

function SequenceEditorActionBox({
  actionType,
  sequenceId,
  sequenceValue,
  enabled,
}) {

  const { setCustomSequence } = React.useContext(DataContext);
  const symbol = actionType === 'prependZero' ? '>>' : '?';

  function handleClick() {
    if (actionType === 'prependZero') {
      // handleAddZero(sequenceId);
      setCustomSequence([0, ...sequenceValue]);
      // handleSequenceChange(sequenceId, [0, ...sequenceValue]);
    }
  }

  const onClickAction = enabled ? handleClick : null;

  let result = (
    <div
      className={`${styles.wrapper} ${enabled ? styles.wrapperEnabled : styles.wrapperDisabled}`}
      onClick={onClickAction}
    >
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

export default SequenceEditorActionBox;
