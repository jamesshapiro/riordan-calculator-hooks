import React from "react";

import styled from "styled-components";
import { UserContext } from "../UserProvider";
import { SoundContext } from "../SoundProvider";

import AuthDialog from "../AuthDialog";

function NavBar() {
  const { isAuthenticated, user, handleLogout } = React.useContext(UserContext);
  const { volume, toggleMute } = React.useContext(SoundContext);
  const Hi = isAuthenticated ? `Hi ${user}` : "";
  const LoginLogout = isAuthenticated ? (
    <NavItem onClick={handleLogout}>Logout</NavItem>
  ) : (
    <NavItem>
      <AuthDialog />
    </NavItem>
  );
  const volumeMutedSVG = (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
      class="lucide lucide-volume"
    >
      <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
    </svg>
  );

  const volumeOnSVG = (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
      class="lucide lucide-volume-2"
    >
      <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
      <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
      <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
    </svg>
  );

  return (
    <FlexWrapper>
      <NavItem onClick={toggleMute}>
        {volume === 1 ? volumeOnSVG : volumeMutedSVG}
      </NavItem>
      {LoginLogout}
      <NavItem>About</NavItem>
      {isAuthenticated && Hi}
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
  padding: 10px 20px;
  /* height: 50px; */
  align-items: center;
  justify-content: center;
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
