import Header from '../Header';
import React from 'react';

import DataProvider from '../DataProvider';
import NumberBox from '../NumberBox/NumberBox';

import styled from 'styled-components';

function App() {
  return (
    <DataProvider>
      <Wrapper>
        <Header />
        <div>
          <NumberBox />
          <NumberBox />
          <NumberBox />
          <NumberBox />
          <NumberBox />
          <NumberBox />
          <NumberBox />
          <NumberBox />
          <NumberBox />
          <NumberBox />
          <NumberBox />
        </div>
        <div>
          <NumberBox />
          <NumberBox />
          <NumberBox />
          <NumberBox />
          <NumberBox />
          <NumberBox />
          <NumberBox />
          <NumberBox />
          <NumberBox />
          <NumberBox />
          <NumberBox />
        </div>
      </Wrapper>
    </DataProvider>
  );
}

export default App;

const Wrapper = styled.div`
  height: 100%;
`;
