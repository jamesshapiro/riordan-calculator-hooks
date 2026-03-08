import React from 'react';

import { DataContext } from '../DataProvider';
import Spacer from '../Spacer';

import styled from 'styled-components';
import TooltipWrapper from '../TooltipWrapper';

function StarSequence({ variant }) {
  const { matrix, metaMode } = React.useContext(DataContext);
  if (!matrix) {
    return <></>;
  }
  const parsedMatrix = JSON.parse(matrix);
  const sequence = parsedMatrix[`${variant} seq`];
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
      <td key={`star-${index}`}>
        <div key={`star-${index}`}>
          <Wrapper value={num} key={`star-${index}`}>
            <InnerContainer>
              <InnerElement>{num}</InnerElement>
            </InnerContainer>
          </Wrapper>
        </div>
      </td>
    );
  });

  const lookupElem = (
    <td key={`star-lookup`}>
      <div key={`star-lookup`}>
        <LookupWrapper key={`star-lookup`}>
          <LookupInnerContainer>
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
                <LookupInnerElement>{SearchSVG}</LookupInnerElement>
              </a>
            </TooltipWrapper>
          </LookupInnerContainer>
        </LookupWrapper>
      </div>
    </td>
  );

  return (
    <OuterOuterWrapper>
      <OuterWrapper>
        <StyledH2>{title}</StyledH2>
        <Spacer />
        {lookupElem}
        {elements}
      </OuterWrapper>
    </OuterOuterWrapper>
  );
}

export default StarSequence;

const StyledSVG = styled.svg`
  max-width: 100%;
`;

const SearchSVG = (
  <StyledSVG
    xmlns='http://www.w3.org/2000/svg'
    width='14'
    height='14'
    viewBox='0 0 16 16'
    fill='none'
    stroke='#6b6560'
    strokeWidth='1.5'
    strokeLinecap='round'
    strokeLinejoin='round'
  >
    <circle cx='7.2' cy='7.2' r='5.33' />
    <path d='m14 14-2.85-2.85' />
  </StyledSVG>
);

const StyledH2 = styled.h2`
  display: inline;
  font-size: 0.85rem;
  font-weight: 500;
  color: #1a1612;
  letter-spacing: -0.01em;
`;

const OuterOuterWrapper = styled.div`
  margin-top: 32px;
  background: #ffffff;
  border: 1px solid #e8e4df;
  border-radius: 12px;
  padding: 20px 24px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.04);
`;

const OuterWrapper = styled.tr`
  margin-top: 0;
  min-width: fit-content;
  color: #1a1612;
  display: flex;
  align-items: center;
  gap: 2px;
`;

const Wrapper = styled.div`
  position: relative;
  display: inline-block;
  cursor: default;
  background-color: #faf8f6;
  border-radius: 6px;
  width: fit-content;
  min-width: var(--number-box-width);
  width: 100%;
  height: 38px;
  margin: 1px;
  border: 1px solid #e8e4df;
  z-index: 1;
`;

const InnerContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  color: #3c3024;
  width: 100%;
  height: 100%;
  font-size: 0.85rem;
  font-variant-numeric: tabular-nums;
`;

const InnerElement = styled.p`
  width: fit-content;
  font-size: 0.85rem;
`;

const LookupWrapper = styled.div`
  position: relative;
  display: inline-block;
  cursor: default;
  background-color: #faf8f6;
  border-radius: 6px;
  width: fit-content;
  min-width: var(--number-box-width);
  width: 100%;
  height: 38px;
  margin: 1px;
  border: 1px solid #e8e4df;
  z-index: 1;
  transition: all 0.15s ease;
  &:hover {
    background-color: #f0ece7;
    border-color: #d4cdc4;
  }
`;

const LookupInnerContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  color: #6b6560;
  width: 100%;
  height: 100%;
  &:hover {
    color: #1a1612;
  }
`;

const LookupInnerElement = styled.p`
  width: fit-content;
`;
