import React from 'react';
import * as Tooltip from '@radix-ui/react-tooltip';

import styles from './TooltipWrapper.module.css';

const TooltipWrapper = ({
  children,
  message,
  side,
  sideOffset,
  alignOffset,
  arrowshiftY,
  arrowshiftX,
  omitInfo = false,
}) => {
  const infoSVG = (
    <svg
      xmlns='http://www.w3.org/2000/svg'
      width='15'
      height='15'
      viewBox='0 0 15 15'
      fill='none'
      stroke='currentColor'
      strokeWidth='1.5'
      strokeLinecap='round'
      strokeLinejoin='round'
      className='lucide lucide-info'
    >
      <circle cx='7.5' cy='7.5' r='6.25' />
      <path d='M7.5 10v-2.5' />
      <path d='M7.5 5h.01' />
    </svg>
  );

  const infoSVG2 = (
    <svg
      xmlns='http://www.w3.org/2000/svg'
      className={`lucide lucide-info ${styles.styledSvg}`}
      viewBox='0 0 15 15'
      width='15'
      height='15'
    >
      <circle cx='7.5' cy='7.5' r='6.25' />
      <path d='M7.5 10v-2.5' />
      <path d='M7.5 5h.01' />
    </svg>
  );

  return (
    <Tooltip.Provider>
      <Tooltip.Root>
        <Tooltip.Trigger asChild>{children}</Tooltip.Trigger>
        <Tooltip.Portal>
          <Tooltip.Content
            className='TooltipContent'
            sideOffset={sideOffset}
            alignOffset={alignOffset}
            side={side}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              border: 'none !important',
            }}
          >
            {!omitInfo && infoSVG2}
            {!omitInfo && <div className={styles.spacerDiv} />}
            {message}

            <Tooltip.Arrow
              style={{
                transform: `translate(${arrowshiftX}, ${arrowshiftY})`,
                zIndex: 1,
              }}
              className='TooltipArrow'
            />
          </Tooltip.Content>
        </Tooltip.Portal>
      </Tooltip.Root>
    </Tooltip.Provider>
  );
};

export default TooltipWrapper;
