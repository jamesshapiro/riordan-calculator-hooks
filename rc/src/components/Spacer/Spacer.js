import React from 'react';

import styles from './Spacer.module.css';

function Spacer() {
  const id = React.useId();
  return (
    <td key={id}>
      <div className={styles.wrapper}>
        <div className={styles.innerContainer}>
          <div className={styles.innerContainer}>
            <p className={styles.innerElement}></p>
          </div>
        </div>
      </div>
    </td>
  );
}

export default Spacer;
