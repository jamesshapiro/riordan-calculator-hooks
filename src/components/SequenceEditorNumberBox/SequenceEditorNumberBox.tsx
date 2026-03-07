'use client';

import React from 'react';

import styled from 'styled-components';

import { DataContext } from '../DataProvider/DataProvider';

import TooltipWrapper from '../TooltipWrapper/TooltipWrapper';

interface SequenceEditorNumberBoxProps {
  value: number;
  index: number;
  onSubmit: (index: number, value: number) => void;
  sequenceId: number;
  sequenceValue: number[];
  isFirst: boolean;
  zIndex?: number;
  handleSequenceChange: (newSequence: number[]) => void;
}

function SequenceEditorNumberBox({
  value,
  index,
  onSubmit,
  sequenceId,
  sequenceValue,
  isFirst,
  zIndex,
  handleSequenceChange,
}: SequenceEditorNumberBoxProps) {
  const [digits, setDigits] = React.useState<string | number>(value);
  const [isSelected, setIsSelected] = React.useState(false);
  const buttonRef = React.useRef<HTMLParagraphElement>(null);
  const divRef = React.useRef<HTMLDivElement>(null);
  const {
    targetBoxIndex,
    setTargetBoxIndex,
    handleSelectSequence,
    tabWasPressed,
    setTabWasPressed,
    handleTruncateSequence,
  } = React.useContext(DataContext);

  const [maxfontsizeRem, setMaxfontsizeRem] = React.useState('1.1rem');

  React.useEffect(() => {
    if (typeof window !== 'undefined') {
      const bodyStyles = getComputedStyle(document.body);
      const boxLength = bodyStyles
        .getPropertyValue('--number-box-width')
        .replace('px', '');
      const containerWidthPx = parseInt(boxLength) || 40;
      const maxWidthPerCharacter =
        (containerWidthPx * 1.4) / Math.max(String(digits).length, 1);
      const rootFontSizePx = 16;
      setMaxfontsizeRem(`${maxWidthPerCharacter / rootFontSizePx}rem`);
    }
  }, [digits]);

  function handleCloseOption() {
    if (isFirst) {
      handleSequenceChange(sequenceValue.slice(1));
      // handleLeftShift(sequenceId);
    } else {
      handleTruncateSequence();
    }
    handleSelectSequence(String(sequenceId), 'custom');
  }

  const [notMounting, setNotMounting] = React.useState(false);
  React.useEffect(() => {
    setNotMounting(true);
  }, []);
  React.useEffect(() => {
    if (
      targetBoxIndex === index &&
      buttonRef.current &&
      notMounting &&
      tabWasPressed
    ) {
      buttonRef.current.click();
      setTabWasPressed(false);
    }
  }, [targetBoxIndex, index, notMounting, tabWasPressed]);

  const minfontsize = '0.8rem';
  const maxfontsize = '1.1rem';

  function handleClick(event: React.MouseEvent<HTMLDivElement>) {
    if (!divRef.current) return;

    // Set some of the click area off-limits for the close bubble
    const { offsetWidth: width, offsetHeight: height } = divRef.current;
    const rect = divRef.current.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    if (x > width / 8 && y < height / 8) {
      return; // Ignore the click
    }
    setIsSelected(true);
    setTargetBoxIndex(index);
    setNotMounting(true);
  }

  function handleBlur() {
    setIsSelected(false);
    onSubmit(index, parseInt(String(digits), 10) || 0);
    handleSelectSequence(String(sequenceId), 'custom');
  }

  function handleKeyPress(value: string) {
    let cleaned = value.replace(/[^0-9-]/g, '');
    if (cleaned.startsWith('-0') && cleaned.length > 2) {
      cleaned = '-' + cleaned.slice(2);
    } else if (value.startsWith('0') && value.length > 1) {
      cleaned = value.slice(1);
    }
    if (cleaned.endsWith('-') && cleaned.length > 1) {
      cleaned = cleaned.slice(0, -1);
    }
    setDigits(cleaned);
  }

  const handleFocus = (event: React.FocusEvent<HTMLInputElement>) => {
    event.target.select();
  };

  const inputNumberBox = (
    <form
      onSubmit={(event) => {
        event.preventDefault();
        setIsSelected(false);
        onSubmit(index, parseInt(String(digits), 10) || 0);
        handleSelectSequence(String(sequenceId), 'custom');
      }}
    >
      <StyledInput
        value={String(digits)}
        $minfontsize={minfontsize}
        $fontSize={maxfontsizeRem}
        $maxfontsize={maxfontsize}
        onChange={(event) => handleKeyPress(event.target.value)}
        onBlur={handleBlur}
        onFocus={handleFocus}
        autoFocus
      />
    </form>
  );

  const boxContents = isSelected ? (
    inputNumberBox
  ) : (
    <InnerElement
      $minfontsize={minfontsize}
      $fontSize={maxfontsizeRem}
      $maxfontsize={maxfontsize}
      ref={buttonRef}
    >
      {digits}
    </InnerElement>
  );

  const closeBubble =
    false || isFirst ? (
      <TooltipWrapper
        message="Delete First Term"
        side="top"
        sideOffset={5}
        arrowshiftX="0"
        arrowshiftY="0"
        zidx={zIndex}
      >
        <CloseBubble onClick={handleCloseOption} $zidx={zIndex ?? 0}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="15"
            height="15"
            viewBox="0 0 15 15"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="lucide lucide-x"
          >
            <path d="M11.25 3.75 L3.75 11.25" />
            <path d="m3.75 3.75 7.5 7.5" />
          </svg>
        </CloseBubble>
      </TooltipWrapper>
    ) : null;

  return (
    <Wrapper ref={divRef} onClick={(event) => handleClick(event)}>
      <InnerContainer>
        {closeBubble}
        {boxContents}
      </InnerContainer>
    </Wrapper>
  );
}

export default SequenceEditorNumberBox;

const CloseBubble = styled.div<{ $zidx?: number }>`
  position: absolute;
  background-color: var(--number-box-background-color);
  border: 2px dashed var(--action-box-border-color);
  &:hover {
    background-color: var(--bubble-hover-background-color);
    color: white;
    border: 2px dashed var(--bubble-hover-border-color);
  }
  border-radius: 15px;
  width: 30px;
  height: 30px;
  cursor: pointer;
  top: -20px;
  left: 37px;
  z-index: ${(p) => p.$zidx ?? 0};

  display: flex;
  justify-content: center;
  align-items: center;
`;

const Wrapper = styled.div`
  position: relative;
  display: inline-block;
  cursor: 'text';
  background-color: var(--number-box-background-color);
  &:hover {
    background-color: var(--number-box-hover-background-color);
  }
  border-radius: var(--number-box-border-radius);
  width: fit-content;
  min-width: var(--number-box-width);
  width: 100%;
  height: var(--number-box-height);
  margin: 1px;
  border: 1px solid var(--number-box-border-color);
  z-index: 1;
  /* padding: 10%; */
`;

const InnerContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  font-family: 'Lato', sans-serif;
  color: var(--number-box-font-color);
  color: 'var(--number-box-font-color)';
  &:hover {
    color: 'var(--number-box-hover-font-color)';
  }
  width: fit-content;
  height: 100%;
  width: 100%;
`;

const InnerElement = styled.p<{
  $minfontsize?: string;
  $fontSize?: string;
  $maxfontsize?: string;
}>`
  width: fit-content;
  font-size: clamp(
    ${(p) => p.$minfontsize},
    ${(p) => p.$fontSize},
    ${(p) => p.$maxfontsize}
  );
`;

const StyledInput = styled.input<{
  $minfontsize?: string;
  $fontSize?: string;
  $maxfontsize?: string;
}>`
  font-family: 'Lato', sans-serif;
  color: hsl(243, 85%, 40%);
  font-size: clamp(
    ${(p) => p.$minfontsize},
    ${(p) => p.$fontSize},
    ${(p) => p.$maxfontsize}
  );
  height: 100%;
  width: max(var(--number-box-width), var(--number-box-width));
  margin-left: 2px;
  text-align: center;

  line-height: normal;
  border: 1px solid var(--number-box-hover-font-color);
  background-color: white;
  box-sizing: border-box;
`;
