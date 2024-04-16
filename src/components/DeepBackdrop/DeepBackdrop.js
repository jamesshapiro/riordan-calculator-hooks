import React from 'react';

import styled from 'styled-components';
import { DataContext } from '../DataProvider';

function DeepBackdrop() {
  const { matrix } = React.useContext(DataContext);
  const [height, setHeight] = React.useState('100vh');

  React.useEffect(() => {
    function handleResize(newHeight) {
      const totalHeight = document.body.scrollHeight;
      const totalHeightPx = `${totalHeight}px`;
      setHeight(totalHeightPx);
    }
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [matrix]);
  return <StyledBackdrop height={height} />;
}

export default DeepBackdrop;

const StyledBackdrop = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  min-height: ${(p) => p.height};
  width: 100%;
  background-color: var(--background-gradient-bottom);
  z-index: -2000;
`;
