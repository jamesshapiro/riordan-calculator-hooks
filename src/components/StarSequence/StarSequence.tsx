'use client';

import React from 'react';
import { DataContext } from '@/components/DataProvider/DataProvider';
import Spacer from '@/components/Spacer/Spacer';
import styled from 'styled-components';
import TooltipWrapper from '@/components/TooltipWrapper/TooltipWrapper';

function StarSequence({ variant }: { variant: string }) {
  const { matrix, metaMode } = React.useContext(DataContext);
  if (!matrix) return <></>;
  const parsedMatrix = JSON.parse(matrix);
  const sequence = parsedMatrix[`${variant} seq`];
  const title = `${variant.toUpperCase()}-sequence: `;
  const searchQueryParam = sequence.join('%2C');
  const displayBSequence = parsedMatrix['riordan pseudo'];

  const displayOptions: any = {
    classic: { a: { display: true }, b: { display: displayBSequence }, z: { display: true } },
    exponential: { a: { display: false }, b: { display: false }, z: { display: false } },
  };

  if (!displayOptions[metaMode][variant]['display']) return null;

  const SearchSVG = (
    <StyledSVG xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 16 16' fill='none' stroke='var(--number-box-font-color)' strokeWidth='1.5' strokeLinecap='round' strokeLinejoin='round'>
      <circle cx='7.2' cy='7.2' r='5.33' /><path d='m14 14-2.85-2.85' />
    </StyledSVG>
  );

  const elements = sequence.map((num: number, index: number) => (
    <td key={`star-${index}`}>
      <div><ElemWrapper><InnerContainer><InnerElement>{num}</InnerElement></InnerContainer></ElemWrapper></div>
    </td>
  ));

  const lookupElem = (
    <td key='star-lookup'>
      <div><LookupWrapper><LookupInnerContainer>
        <TooltipWrapper message='OEIS Lookup' side='top' sideOffset={5} arrowshiftX='0' arrowshiftY='0'>
          <a target='_blank' rel='noreferrer' href={`https://oeis.org/search?q=${searchQueryParam}&language=english&go=Search`}>
            <LookupInnerElement>{SearchSVG}</LookupInnerElement>
          </a>
        </TooltipWrapper>
      </LookupInnerContainer></LookupWrapper></div>
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

const StyledSVG = styled.svg`max-width: 100%;`;
const StyledH2 = styled.h2`display: inline;`;
const OuterOuterWrapper = styled.div`margin-top: 30px; margin-left: 195px;`;
const OuterWrapper = styled.tr`margin-top: 10px; min-width: fit-content; color: var(--star-sequence-font-color);`;
const ElemWrapper = styled.div`position: relative; display: inline-block; cursor: default; background-color: var(--number-box-background-color); border-radius: var(--number-box-border-radius); width: fit-content; min-width: var(--number-box-width); width: 100%; height: var(--number-box-height); margin: 1px; border: 1px solid var(--number-box-border-color); z-index: 1;`;
const InnerContainer = styled.div`display: flex; justify-content: center; align-items: center; font-family: 'Lato', sans-serif; color: var(--number-box-font-color); width: fit-content; height: 100%; width: 100%;`;
const InnerElement = styled.p`width: fit-content;`;
const LookupWrapper = styled.div`position: relative; display: inline-block; cursor: default; background-color: var(--number-box-background-color); border-radius: var(--number-box-border-radius); width: fit-content; min-width: var(--number-box-width); width: 100%; height: var(--number-box-height); margin: 1px; border: 1px solid var(--number-box-border-color); z-index: 1; &:hover { background-color: var(--number-box-hover-background-color); }`;
const LookupInnerContainer = styled.div`display: flex; justify-content: center; align-items: center; font-family: 'Lato', sans-serif; color: var(--number-box-font-color); width: fit-content; height: 100%; width: 100%; &:hover { color: var(--number-box-hover-font-color); }`;
const LookupInnerElement = styled.p`width: fit-content;`;
