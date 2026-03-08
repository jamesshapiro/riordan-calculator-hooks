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
  opacity: 0.55;
  transition: opacity 0.15s ease;
  &:hover {
    opacity: 1;
  }
`;

// const SearchSVG = (
//   <StyledSVG
//     xmlns='http://www.w3.org/2000/svg'
//     width='12'
//     height='12'
//     viewBox='0 0 12 12'
//     fill='none'
//     stroke='var(--number-box-font-color)'
//     strokeWidth='1.5'
//     strokeLinecap='round'
//     strokeLinejoin='round'
//     className='lucide lucide-search'
//   >
//     <circle cx='5.5' cy='5.5' r='4' />
//     <path d='m10.5 10.5-2.15-2.15' />
//   </StyledSVG>
// );

const SearchSVG = (
  <StyledSVG
    xmlns='http://www.w3.org/2000/svg'
    width='16'
    height='16'
    viewBox='0 0 16 16'
    fill='none'
    stroke='hsl(215, 45%, 40%)'
    strokeWidth='1.5'
    strokeLinecap='round'
    strokeLinejoin='round'
    className='lucide lucide-search'
  >
    <circle cx='7.2' cy='7.2' r='5.33' />
    <path d='m14 14-2.85-2.85' />
  </StyledSVG>
);

const StyledH2 = styled.h2`
  display: inline;
  font-size: 16px;
  font-weight: 600;
  letter-spacing: -0.01em;
`;

const OuterOuterWrapper = styled.div`
  margin-top: 36px;
  margin-left: 195px;
`;

const OuterWrapper = styled.tr`
  margin-top: 10px;
  min-width: fit-content;
  color: var(--star-sequence-font-color);
`;

const Wrapper = styled.div`
  position: relative;
  display: inline-block;
  cursor: default;
  background-color: #ffffff;
  border-radius: var(--number-box-border-radius);
  width: fit-content;
  min-width: var(--number-box-width);
  width: 100%;
  height: var(--number-box-height);
  margin: 1px;
  border: 1px solid hsl(215, 25%, 88%);
  z-index: 1;
  font-variant-numeric: tabular-nums;
`;

const InnerContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  color: hsl(215, 55%, 30%);
  width: fit-content;
  height: 100%;
  width: 100%;
`;

const InnerElement = styled.p`
  width: fit-content;
  font-weight: 500;
  font-size: clamp(
    ${(p) => p.$minfontsize},
    ${(p) => p.fontSize},
    ${(p) => p.$maxfontsize}
  );
`;

const LookupWrapper = styled.div`
  position: relative;
  display: inline-block;
  cursor: default;
  background-color: #ffffff;
  border-radius: var(--number-box-border-radius);
  width: fit-content;
  min-width: var(--number-box-width);
  width: 100%;
  height: var(--number-box-height);
  margin: 1px;
  border: 1px solid hsl(215, 25%, 88%);
  z-index: 1;
  transition: background-color 0.15s ease;
  &:hover {
    background-color: hsl(215, 30%, 96%);
  }
`;

const LookupInnerContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  color: hsl(215, 45%, 40%);
  width: fit-content;
  height: 100%;
  width: 100%;
  &:hover {
    color: hsl(215, 60%, 30%);
  }
`;

const LookupInnerElement = styled.p`
  width: fit-content;
  font-size: clamp(
    ${(p) => p.$minfontsize},
    ${(p) => p.fontSize},
    ${(p) => p.$maxfontsize}
  );
`;
