import React from 'react';
import * as Tooltip from '@radix-ui/react-tooltip';
import './styles.css';

import styled from 'styled-components';

const TooltipWrapper = ({
  children,
  message,
  side,
  sideOffset,
  arrowshiftY,
  arrowshiftX,
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
    <StyledSVG
      xmlns='http://www.w3.org/2000/svg'
      className='lucide lucide-info'
      viewBox='0 0 15 15'
      width='15'
      height='15'
    >
      <circle cx='7.5' cy='7.5' r='6.25' />
      <path d='M7.5 10v-2.5' />
      <path d='M7.5 5h.01' />
    </StyledSVG>
  );

  return (
    <Tooltip.Provider>
      <Tooltip.Root>
        <Tooltip.Trigger asChild>{children}</Tooltip.Trigger>
        <Tooltip.Portal>
          <Tooltip.Content
            className='TooltipContent'
            sideOffset={sideOffset}
            side={side}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              border: 'none !important',
            }}
          >
            {infoSVG2}
            <SpacerDiv />
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

const SpacerDiv = styled.div`
  min-width: 5px;
  z-index: -1px;
`;

const StyledSVG = styled.svg`
  fill: none;
  stroke: currentColor;
  stroke-width: 1.5;
  stroke-linecap: round;
  stroke-linejoin: round;
  transform: translateY(-1px);
`;

export default TooltipWrapper;
