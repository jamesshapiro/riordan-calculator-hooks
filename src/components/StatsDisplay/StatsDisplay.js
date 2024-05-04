import React from 'react';

import styled from 'styled-components';
import { UserContext } from '../UserProvider';

function StatsDisplay() {
  const { userQueries, isAuthorized } = React.useContext(UserContext);
  return <Wrapper>Parappa</Wrapper>;
}

export default StatsDisplay;

const Wrapper = styled.div`
  z-index: 1000;
  position: fixed;
  bottom: 0;
  width: 100%;
  background-image: linear-gradient(
    var(--background-gradient-top),
    var(--background-gradient-bottom)
  );
  text-align: center;
  font-family: 'Lato', sans-serif !important;
  font-size: 12px;
  border: 1px solid #aaa;
  padding: 2px;
`;
