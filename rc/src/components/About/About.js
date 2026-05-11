import React from 'react';

import styles from './About.module.css';

import NavBar from '../NavBar';
import Header from '../Header';

function About() {
  return (
    <div className={styles.flexColumnWrapper}>
      <NavBar />
      <div className={styles.headerDiv}>
        <Header />
      </div>
      <div className={styles.verticalSpace} />
      <p className={styles.p}>
        The Riordan Calculator was created by{' '}
        <a href='https://jamesshapiro.com'>James Shapiro</a> in consultation
        with his father, Riordan expert{' '}
        <a href='https://en.wikipedia.org/wiki/Louis_Shapiro_(mathematician)'>
          Louis Shapiro
        </a>
        . It was signficantly upgraded in 2024 and is free to use. If this
        website helps you discover new results, I would appreciate if you
        mention it somewhere in your paper so that others can take advantage of
        the calculator. However, this is purely optional.
        <br />
        <br />
        You are encouraged to submit your papers to the new Riordan Calculator
        Papers section of the website! Any papers that credit the Riordan
        Calculator in their official published version are eligible for
        inclusion. Please submit papers to
        <img
          src='/riordanpapers.png'
          alt='Riordan Papers'
          style={{
            width: '170px',
            display: 'inline',
            transform: 'translate(2px, 5px)',
          }}
        />
      </p>
    </div>
  );
}

export default About;
