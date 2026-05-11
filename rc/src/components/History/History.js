import React from 'react';
import UserHistory from '../UserHistory';

import NavBar from '../NavBar';
import Header from '../Header';
import styles from './History.module.css';

function History() {
  return (
    <div className={styles.flexColumnWrapper}>
      <NavBar />
      <div className={styles.headerDiv}>
        <Header />
      </div>
      <UserHistory />;
    </div>
  );
}

export default History;
