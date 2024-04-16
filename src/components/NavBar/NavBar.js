import React from 'react';

import styled from 'styled-components';

function NavBar() {
  return (
    <FlexWrapper>
      <NavItem>Mute/Unmute</NavItem>
      <NavItem>Login</NavItem>
      <NavItem>About</NavItem>
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
