import React from 'react';
import * as style from './Header.module.css';

function Header() {
  return (
    <>
      <header
        className={`${style.header} ${true ? style.headerSuccess : ''}`}
      >
        <h1>James Shapiro</h1>

      </header>
      <span>Invisible
      <span className={style.invisiblePlaceholder}>PLACEHOLDER</span>
      placeholder
      <span className={style.invisiblePlaceholder}>DEMO</span>
      Demo</span>
    </>

  );
}

export default Header;
