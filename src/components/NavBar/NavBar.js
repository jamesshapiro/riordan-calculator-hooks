import React from 'react';

import styled from 'styled-components';
import { UserContext } from '../UserProvider';


import AuthDialog from '../AuthDialog';
import { Link } from 'react-router-dom';

import UserDropdown from '../UserDropdown';

function NavBar() {
  const { isAuthenticated, user, name, handleLogout } =
    React.useContext(UserContext);

  const LoginLogout = isAuthenticated ? (
    <NavItem onClick={handleLogout}>Logout</NavItem>
  ) : (
    <NavItem>
      <AuthDialog />
    </NavItem>
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
    <FlexWrapper>
      {LoginLogout}

      <NavItem>
        <Link to='/papers'>Papers</Link>
      </NavItem>

      <NavItem>
        <Link to='/about'>About</Link>
      </NavItem>

      {isAuthenticated && (
        <NavItem>
          <UserDropdown>
            {name} {settingsSVG}
          </UserDropdown>
        </NavItem>
      )}
    </FlexWrapper>
  );
}

export default NavBar;

const FlexWrapper = styled.div`
  display: flex;
  flex-direction: row;
  align-self: flex-end;
  gap: 10px;
`;

const NavItem = styled.button`
  background-color: var(--number-box-background-color);
  color: var(--number-box-font-color);
  border-left: 1px solid var(--number-box-border-color);
  border-bottom: 1px solid var(--number-box-border-color);
  border-right: 1px solid var(--number-box-border-color);
  &:hover {
    background-color: var(--number-box-border-color);
    color: white;
  }
  /* width: 100px; */
  display: flex;
  padding: 2px 6px;
  /* height: 50px; */
  align-items: center;
  justify-content: center;
  text-decoration: none;
  color: inherit;

  a {
    text-decoration: none;
    color: inherit;
  }
`;

// --number-box-hover-background-color: hsl(240, 10%, 85%);
// --matrix-cell-background-color: hsl(240, 50%, 93%);

// --action-box-background-color: hsl(240 10% 95% / 50%);
// --action-box-hover-background-color: hsl(240 10% 85% / 50%);
// --action-box-hover-font-color: hsl(240 90% 50% / 50%);
// --action-box-font-color: hsl(240 65% 40% / 50%);
// --action-box-border-color: hsl(240 65% 65% / 50%);
// --bubble-hover-background-color: hsl(240, 100%, 50%);

// --number-box-hover-font-color: hsl(240, 100%, 50%);
// --bubble-hover-border-color: hsl(240, 100%, 90%);
// --number-box-border-radius: 8px;

// --header-color: hsl(240, 85%, 35%);
// --active-button-color: hsl(240, 85%, 35%);
// --hover-button-color: hsl(240, 60%, 55%);
// --mode-button-selected: hsl(240, 85%, 35%);
