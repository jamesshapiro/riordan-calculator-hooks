import React from 'react';

import { UserContext } from '../UserProvider';
import { DataContext } from '../DataProvider';
import Link from 'next/link';

import styles from './NavBar.module.css';

import AuthDialog from '../AuthDialog';

import UserDropdown from '../UserDropdown';

function NavBar() {
  const { isAuthenticated, user, name, handleLogout } =
    React.useContext(UserContext);
  const {
    discoveryMode,
    setDiscoveryMode,
    loadDiscovery,
  } = React.useContext(DataContext);

  const LoginLogout = isAuthenticated ? (
    <button className={styles.navItem} onClick={handleLogout}>Logout</button>
  ) : (
    <button className={styles.navItem}>
      <AuthDialog />
    </button>
  );

  const settingsSVG = (
    <svg
      xmlns='http://www.w3.org/2000/svg'
      width='24'
      height='24'
      viewBox='0 0 24 24'
      fill='none'
      stroke='currentColor'
      strokeWidth='2'
      strokeLinecap='round'
      strokeLinejoin='round'
      className='lucide lucide-settings'
    >
      <path d='M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z' />
      <circle cx='12' cy='12' r='3' />
    </svg>
  );

  const volumeMutedSVG = (
    <svg
      xmlns='http://www.w3.org/2000/svg'
      width='24'
      height='24'
      viewBox='0 0 24 24'
      fill='none'
      stroke='currentColor'
      strokeWidth='2'
      strokeLinecap='round'
      strokeLinejoin='round'
      className='lucide lucide-volume'
    >
      <polygon points='11 5 6 9 2 9 2 15 6 15 11 19 11 5' />
    </svg>
  );

  const volumeOnSVG = (
    <svg
      xmlns='http://www.w3.org/2000/svg'
      width='24'
      height='24'
      viewBox='0 0 24 24'
      fill='none'
      stroke='currentColor'
      strokeWidth='2'
      strokeLinecap='round'
      strokeLinejoin='round'
      className='lucide lucide-volume-2'
    >
      <polygon points='11 5 6 9 2 9 2 15 6 15 11 19 11 5' />
      <path d='M15.54 8.46a5 5 0 0 1 0 7.07' />
      <path d='M19.07 4.93a10 10 0 0 1 0 14.14' />
    </svg>
  );

  return (
    <div className={styles.flexWrapper}>
      {LoginLogout}

      <button
        className={styles.navLink}
        onClick={() => {
          if (!discoveryMode) {
            window.location.hash = 'discovery';
            loadDiscovery(0);
          } else {
            window.location.hash = '';
            setDiscoveryMode(false);
          }
        }}
        style={{
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          color: discoveryMode ? '#FFD700' : undefined,
          fontWeight: discoveryMode ? 700 : undefined,
        }}
      >
        Discovery
      </button>

      <Link href='/benchmarks/' className={styles.navLink}>Benchmarks</Link>

      <Link href='/live/' className={styles.navLink}>Live</Link>

      <Link href='/papers/' className={styles.navLink}>Papers</Link>

      <Link href='/about/' className={styles.navLink}>About</Link>

      {isAuthenticated && (
        <button className={styles.navItem}>
          <UserDropdown>
            {name} {settingsSVG}
          </UserDropdown>
        </button>
      )}
    </div>
  );
}

export default NavBar;
