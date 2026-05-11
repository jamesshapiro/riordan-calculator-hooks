import React from 'react';
import { DataContext } from '../DataProvider';
import Link from 'next/link';
import styles from './Header.module.css';

function Header({ isHome }) {
  const { metaMode, setMetaMode } = React.useContext(DataContext);
  const isClassicSelected = metaMode === 'classic';

  function handleMetaModeClick(metaMode) {
    setMetaMode((oldValue) => {
      return metaMode;
    });
  }

  return (
    <div className={styles.wrapper}>
      <header className={styles.headerWrapper}>
        <h1 className={styles.styledHeader}>
          <Link href='/' className={styles.styledLink}>Riordan Calculator</Link>
        </h1>
      </header>
      {isHome && (
        <button
          className={`${styles.styledButton} ${isClassicSelected ? styles.styledButtonSelected : styles.styledButtonUnselected}`}
          onClick={() => handleMetaModeClick('classic')}
        >
          Classic
        </button>
      )}
      {isHome && (
        <button
          className={`${styles.styledButton} ${!isClassicSelected ? styles.styledButtonSelected : styles.styledButtonUnselected}`}
          onClick={() => handleMetaModeClick('exponential')}
        >
          Exponential
        </button>
      )}
    </div>
  );
}

export default Header;
