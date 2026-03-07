'use client';

import React from 'react';
import styled from 'styled-components';
import { UserContext } from '@/components/UserProvider/UserProvider';
import AuthDialog from '@/components/AuthDialog/AuthDialog';
import Link from 'next/link';
import UserDropdown from '@/components/UserDropdown/UserDropdown';

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

  return (
    <FlexWrapper>
      {LoginLogout}
      <NavItem>
        <Link href='/papers'>Papers</Link>
      </NavItem>
      <NavItem>
        <Link href='/about'>About</Link>
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
  display: flex;
  padding: 2px 6px;
  align-items: center;
  justify-content: center;
  text-decoration: none;
  color: inherit;
  a {
    text-decoration: none;
    color: inherit;
  }
`;
