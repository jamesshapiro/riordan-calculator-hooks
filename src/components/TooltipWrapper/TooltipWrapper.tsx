'use client';

import React from 'react';
import * as Tooltip from '@radix-ui/react-tooltip';
import './styles.css';
import styled from 'styled-components';

const TooltipWrapper = ({
  children,
  message,
  side,
  sideOffset,
  alignOffset,
  arrowshiftY,
  arrowshiftX,
  omitInfo = false,
}: {
  children: React.ReactNode;
  message: React.ReactNode;
  side?: 'top' | 'right' | 'bottom' | 'left';
  sideOffset?: number;
  alignOffset?: string;
  arrowshiftY?: string;
  arrowshiftX?: string;
  omitInfo?: boolean;
  zidx?: number;
}) => {
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
            {!omitInfo && infoSVG2}
            {!omitInfo && <SpacerDiv />}
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
