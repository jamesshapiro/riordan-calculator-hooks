'use client';

import React from 'react';
import styled from 'styled-components';
import { DataContext } from '../DataProvider/DataProvider';
import TooltipWrapper from '../TooltipWrapper/TooltipWrapper';

interface NumberBoxProps {
  value: number;
  index: number;
  onSubmit: (index: number, value: string | number) => void;
  sequenceId: string;
  sequenceValue: number[];
  isFirst: boolean;
  isLast?: boolean;
  zIndex?: number;
  disabled?: boolean;
}

function NumberBox({ value, index, onSubmit, sequenceId, sequenceValue, isFirst, zIndex, disabled = false }: NumberBoxProps) {
  const [digits, setDigits] = React.useState<string | number>(value);
  const [isSelected, setIsSelected] = React.useState(false);
  const buttonRef = React.useRef<HTMLParagraphElement>(null);
  const divRef = React.useRef<HTMLDivElement>(null);
  const {
    targetBoxIndex, setTargetBoxIndex, handleSelectSequence,
    tabWasPressed, setTabWasPressed, handleTruncateSequence, handleSequenceChange,
  } = React.useContext(DataContext);

  function handleCloseOption() {
    if (isFirst) {
      handleSequenceChange(sequenceId, sequenceValue.slice(1));
    } else {
      handleTruncateSequence();
    }
    handleSelectSequence(sequenceId, 'custom');
  }

  const [notMounting, setNotMounting] = React.useState(false);
  React.useEffect(() => { setNotMounting(true); }, []);
  React.useEffect(() => {
    if (targetBoxIndex === index && buttonRef.current && notMounting && tabWasPressed) {
      buttonRef.current.click();
      setTabWasPressed(false);
    }
  }, [targetBoxIndex, index, notMounting, tabWasPressed, setTabWasPressed]);

  const [boxLength, setBoxLength] = React.useState(60);
  React.useEffect(() => {
    const bodyStyles = getComputedStyle(document.body);
    const bl = bodyStyles.getPropertyValue('--number-box-width').replace('px', '');
    setBoxLength(parseInt(bl) || 60);
  }, []);

  const minfontsize = '0.8rem';
  const maxfontsize = '1.1rem';
  const containerWidthPx = boxLength;
  const maxWidthPerCharacter = (containerWidthPx * 1.4) / digits.toString().length;
  const rootFontSizePx = 16;
  const maxfontsizeRem = `${maxWidthPerCharacter / rootFontSizePx}rem`;

  function handleClick(event: React.MouseEvent) {
    if (!divRef.current) return;
    if (disabled) return;
    const { offsetWidth: width, offsetHeight: height } = divRef.current;
    const rect = divRef.current.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    if (x > width / 8 && y < height / 8) return;
    setIsSelected(true);
    setTargetBoxIndex(index);
    setNotMounting(true);
  }

  function handleBlur() {
    setIsSelected(false);
    onSubmit(index, digits);
    handleSelectSequence(sequenceId, 'custom');
  }

  function handleKeyPress(val: string) {
    let cleaned = val.replace(/[^0-9-]/g, '');
    if (cleaned.startsWith('-0') && cleaned.length > 2) {
      cleaned = '-' + cleaned.slice(2);
    } else if (val.startsWith('0') && val.length > 1) {
      cleaned = val.slice(1);
    }
    if (cleaned.endsWith('-') && cleaned.length > 1) {
      cleaned = cleaned.slice(0, -1);
    }
    setDigits(cleaned);
  }

  const handleFocus = (event: React.FocusEvent<HTMLInputElement>) => { event.target.select(); };

  const inputNumberBox = (
    <form onSubmit={(event) => { event.preventDefault(); setIsSelected(false); onSubmit(index, digits); handleSelectSequence(sequenceId, 'custom'); }}>
      <StyledInput value={digits} $minfontsize={minfontsize} $fontSize={maxfontsizeRem} $maxfontsize={maxfontsize}
        onChange={(event) => handleKeyPress(event.target.value)} onBlur={handleBlur} onFocus={handleFocus} autoFocus />
    </form>
  );

  const boxContents = isSelected ? inputNumberBox : (
    <InnerElement $minfontsize={minfontsize} $fontSize={maxfontsizeRem} $maxfontsize={maxfontsize} ref={buttonRef}>
      {digits}
    </InnerElement>
  );

  const closeBubble = (isFirst && !disabled) ? (
    <TooltipWrapper message='Delete First Term' side='top' sideOffset={5} arrowshiftX='0' arrowshiftY='0' zidx={zIndex}>
      <CloseBubble onClick={handleCloseOption}>
        <svg xmlns='http://www.w3.org/2000/svg' width='15' height='15' viewBox='0 0 15 15' fill='none' stroke='currentColor' strokeWidth='1.5' strokeLinecap='round' strokeLinejoin='round'>
          <path d='M11.25 3.75 L3.75 11.25' /><path d='m3.75 3.75 7.5 7.5' />
        </svg>
      </CloseBubble>
    </TooltipWrapper>
  ) : null;

  return (
    <Wrapper ref={divRef} onClick={handleClick} $disabled={disabled}>
      <InnerContainer $disabled={disabled}>
        {closeBubble}
        {boxContents}
      </InnerContainer>
    </Wrapper>
  );
}

export default NumberBox;

const CloseBubble = styled.div`
  position: absolute;
  background-color: var(--number-box-background-color);
  border: 2px dashed var(--action-box-border-color);
  &:hover { background-color: var(--bubble-hover-background-color); color: white; border: 2px dashed var(--bubble-hover-border-color); }
  border-radius: 15px; width: 30px; height: 30px; cursor: pointer; top: -20px; left: 37px;
  display: flex; justify-content: center; align-items: center;
`;

const Wrapper = styled.div<{ $disabled: boolean }>`
  position: relative; display: inline-block;
  cursor: ${(p) => (p.$disabled ? 'default' : 'text')};
  background-color: ${(p) => p.$disabled ? 'var(--number-box-disabled-background-color)' : 'var(--number-box-background-color)'};
  &:hover { background-color: ${(p) => p.$disabled ? 'var(--number-box-disabled-background-color)' : 'var(--number-box-hover-background-color)'}; }
  border-radius: var(--number-box-border-radius);
  width: fit-content; min-width: var(--number-box-width); width: 100%;
  height: var(--number-box-height); margin: 1px;
  border: 1px solid var(--number-box-border-color); z-index: 1;
`;

const InnerContainer = styled.div<{ $disabled: boolean }>`
  display: flex; justify-content: center; align-items: center;
  font-family: 'Lato', sans-serif;
  color: ${(p) => p.$disabled ? 'var(--number-box-disabled-font-color)' : 'var(--number-box-font-color)'};
  &:hover { color: ${(p) => p.$disabled ? 'var(--number-box-disabled-font-color)' : 'var(--number-box-hover-font-color)'}; }
  width: fit-content; height: 100%; width: 100%;
`;

const InnerElement = styled.p<{ $minfontsize: string; $fontSize: string; $maxfontsize: string }>`
  width: fit-content;
  font-size: clamp(${(p) => p.$minfontsize}, ${(p) => p.$fontSize}, ${(p) => p.$maxfontsize});
`;

const StyledInput = styled.input<{ $minfontsize: string; $fontSize: string; $maxfontsize: string }>`
  font-family: 'Lato', sans-serif; color: hsl(243, 85%, 40%);
  font-size: clamp(${(p) => p.$minfontsize}, ${(p) => p.$fontSize}, ${(p) => p.$maxfontsize});
  height: 100%; width: max(var(--number-box-width), var(--number-box-width));
  margin-left: 2px; text-align: center; line-height: normal;
  border: 1px solid var(--number-box-hover-font-color); background-color: white; box-sizing: border-box;
`;
