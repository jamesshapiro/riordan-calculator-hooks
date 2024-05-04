import React from 'react';

import styled from 'styled-components';
import { UserContext } from '../UserProvider';

function StatsDisplay() {
  const { stats } = React.useContext(UserContext);
  if (!stats) {
    return <Wrapper>Loading stats...</Wrapper>;
  }

  const overallTotal = stats.overall;
  let statsString = `${overallTotal} matrices computed!`;
  if (stats.individual) {
    statsString = `${overallTotal} matrices computed, ${stats.individual} by you!`;
  }

  return <Wrapper>{statsString}</Wrapper>;
}

export default StatsDisplay;

const Wrapper = styled.div`
  z-index: 1000;
  position: absolute;
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
