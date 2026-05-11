import React from 'react';

import styles from './DeepBackdrop.module.css';
import { DataContext } from '../DataProvider';

function DeepBackdrop() {
  const { matrix } = React.useContext(DataContext);
  const [height, setHeight] = React.useState('100vh');
  const [width, setWidth] = React.useState('100%');

  React.useEffect(() => {
    function handleResize() {
      const totalHeight = document.body.scrollHeight;
      const totalHeightPx = `${totalHeight}px`;
      setHeight(totalHeightPx);

      const totalWidth = Math.max(window.innerWidth, document.body.scrollWidth);
      const totalWidthPx = `${totalWidth}px`;
      setWidth(totalWidthPx);
    }
    handleResize();
    window.addEventListener('resize', handleResize);
    window.addEventListener('scroll', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('scroll', handleResize);
    };
  }, [matrix]);
  return (
    <div
      className={styles.backdrop}
      style={{ minHeight: height, width: width }}
    />
  );
}

export default DeepBackdrop;
