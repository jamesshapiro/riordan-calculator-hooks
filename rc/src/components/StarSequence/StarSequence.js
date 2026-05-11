import React from 'react';

import { DataContext } from '../DataProvider';
import Spacer from '../Spacer';

import styles from './StarSequence.module.css';
import TooltipWrapper from '../TooltipWrapper';

function StarSequence({ variant }) {
  const { matrix, metaMode, highlightProbe } = React.useContext(DataContext);
  const isHighlighted = highlightProbe === variant;
  if (!matrix) {
    return <></>;
  }
  const parsedMatrix = JSON.parse(matrix);
  const sequence = parsedMatrix[`${variant} seq`];
  if (!sequence) return null;
  const title = `${variant.toUpperCase()}-sequence: `;
  const searchQueryParam = sequence.join('%2C');
  const displayBSequence = parsedMatrix['riordan pseudo'];

  const displayOptions = {
    classic: {
      a: {
        display: true,
      },
      b: {
        display: displayBSequence,
      },
      z: {
        display: true,
      },
    },
    exponential: {
      a: {
        display: false,
      },
      b: {
        display: false,
      },
      z: {
        display: false,
      },
    },
  };

  if (!displayOptions[metaMode][variant]['display']) {
    return;
  }

  const elements = sequence.map((num, index) => {
    return (
      <div key={`star-${index}`}>
        <div className={styles.wrapper}>
          <div className={styles.innerContainer}>
            <p className={styles.innerElement}>{num}</p>
          </div>
        </div>
      </div>
    );
  });

  const SearchSVG = (
    <svg
      xmlns='http://www.w3.org/2000/svg'
      width='16'
      height='16'
      viewBox='0 0 16 16'
      fill='none'
      stroke='var(--number-box-font-color)'
      strokeWidth='1.5'
      strokeLinecap='round'
      strokeLinejoin='round'
      className={`lucide lucide-search ${styles.styledSvg}`}
    >
      <circle cx='7.2' cy='7.2' r='5.33' />
      <path d='m14 14-2.85-2.85' />
    </svg>
  );

  const lookupElem = (
    <div key={`star-lookup`}>
      <div className={styles.lookupWrapper}>
        <div className={styles.lookupInnerContainer}>
          <TooltipWrapper
            message='OEIS Lookup'
            side='top'
            sideOffset={5}
            arrowshiftX='0'
            arrowshiftY='0'
          >
            <a
              target='_blank'
              rel='noreferrer'
              href={`https://oeis.org/search?q=${searchQueryParam}&language=english&go=Search`}
            >
              <p className={styles.lookupInnerElement}>{SearchSVG}</p>
            </a>
          </TooltipWrapper>
        </div>
      </div>
    </div>
  );

  return (
    <div className={`${styles.outerOuterWrapper} ${isHighlighted ? styles.highlighted : ''}`}>
      <div className={styles.outerWrapper}>
        <h2 className={styles.styledH2}>{title}</h2>
        <Spacer />
        {lookupElem}
        {elements}
      </div>
    </div>
  );
}

export default StarSequence;
