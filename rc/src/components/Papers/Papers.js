import React from 'react';

import NavBar from '../NavBar';
import Header from '../Header';
import styles from './Papers.module.css';

function Papers() {
  return (
    <div className={styles.flexColumnWrapper}>
      <NavBar />
      <div className={styles.headerDiv}>
        <Header />
      </div>
      <div className={styles.verticalSpace} />
      <p className={styles.p}>
        We are now re-publishing Riordan-related papers on the website!
        <br />
        <br />
        Any papers that credit the Riordan Calculator in their official
        published version are eligible for inclusion on riordancalculator.com.
        You are encouraged to submit your papers to
        <img
          src='/riordanpapers.png'
          alt='Riordan Papers'
          style={{
            width: '170px',
            display: 'inline',
            transform: 'translate(2px, 4px)',
          }}
        />
        <br />
        <br />
        We are currently reviewing submissions.
      </p>
    </div>
  );
}

export default Papers;
