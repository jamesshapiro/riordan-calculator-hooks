import React from 'react';

import styled from 'styled-components';

import { DataContext } from '../DataProvider';

import TooltipWrapper from '../TooltipWrapper';

function NumberBox({
  value,
  index,
  onSubmit,
  sequenceId,
  sequenceValue,
  isFirst,
  zIndex,
  disabled = false,
}) {
  const [digits, setDigits] = React.useState(value);
  const [isSelected, setIsSelected] = React.useState(false);
  const buttonRef = React.useRef(null);
  const divRef = React.useRef(null);
  const {
    targetBoxIndex,
    setTargetBoxIndex,
    handleSelectSequence,
    tabWasPressed,
    setTabWasPressed,
    handleTruncateSequence,
    handleSequenceChange,
  } = React.useContext(DataContext);

  function handleCloseOption() {
    if (isFirst) {
      handleSequenceChange(sequenceId, sequenceValue.slice(1));
      // handleLeftShift(sequenceId);
    } else {
      handleTruncateSequence();
    }
    handleSelectSequence(sequenceId, 'custom');
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

  // setNumberBoxRefs((oldValue) => {
  //   return {
  //     index: buttonRef,
  //     ...oldValue,
  //   };
  // });

  const bodyStyles = getComputedStyle(document.body);
  const boxLength = bodyStyles
    .getPropertyValue('--number-box-width')
    .replace('px', '');
  const minfontsize = '0.8rem';
  const maxfontsize = '1.1rem';

  const containerWidthPx = parseInt(boxLength);
  const maxWidthPerCharacter =
    (containerWidthPx * 1.4) / digits.toString().length;
  const rootFontSizePx = 16;
  const maxfontsizeRem = `${maxWidthPerCharacter / rootFontSizePx}rem`;

  function handleClick(event) {
    if (!divRef.current) return;
    if (disabled) return;

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
    onSubmit(index, digits);
    handleSelectSequence(sequenceId, 'custom');
  }

  function handleKeyPress(value) {
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

  const handleFocus = (event) => {
    event.target.select();
  };

  const inputNumberBox = (
    <form
      onSubmit={(event) => {
        event.preventDefault();
        setIsSelected(false);
        onSubmit(index, digits);
        handleSelectSequence(sequenceId, 'custom');
      }}
    >
      <StyledInput
        value={digits}
        $minfontsize={minfontsize}
        fontSize={maxfontsizeRem}
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
      fontSize={maxfontsizeRem}
      $maxfontsize={maxfontsize}
      ref={buttonRef}
    >
      {digits}
    </InnerElement>
  );

  const closeBubble =
    false || (isFirst && !disabled) ? (
      <TooltipWrapper
        message='Delete First Term'
        side='top'
        sideOffset={5}
        arrowshiftX='0'
        arrowshiftY='0'
        zidx={zIndex}
      >
        <CloseBubble onClick={handleCloseOption}>
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
            className='lucide lucide-x'
          >
            <path d='M11.25 3.75 L3.75 11.25' />
            <path d='m3.75 3.75 7.5 7.5' />
          </svg>
        </CloseBubble>
      </TooltipWrapper>
    ) : null;

  return (
    <Wrapper
      ref={divRef}
      onClick={(event) => handleClick(event)}
      disabled={disabled}
    >
      <InnerContainer disabled={disabled}>
        {closeBubble}
        {boxContents}
      </InnerContainer>
    </Wrapper>
  );
}

export default NumberBox;

const CloseBubble = styled.div`
  position: absolute;
  background-color: #ffffff;
  border: 1.5px solid hsl(215, 25%, 80%);
  &:hover {
    background-color: hsl(215, 55%, 22%);
    color: white;
    border-color: hsl(215, 55%, 22%);
  }
  border-radius: 50%;
  width: 26px;
  height: 26px;
  cursor: pointer;
  top: -16px;
  left: 37px;
  z-index: ${(p) => p.zidx};
  transition: all 0.15s ease;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const Wrapper = styled.div`
  position: relative;
  display: inline-block;
  cursor: ${(p) => (p.disabled ? 'default' : 'text')};
  background-color: ${(p) =>
    p.disabled
      ? 'var(--number-box-disabled-background-color)'
      : '#ffffff'};
  &:hover {
    background-color: ${(p) =>
      p.disabled
        ? 'var(--number-box-disabled-background-color)'
        : 'hsl(215, 30%, 97%)'};
  }
  border-radius: var(--number-box-border-radius);
  width: fit-content;
  min-width: var(--number-box-width);
  width: 100%;
  height: var(--number-box-height);
  margin: 1px;
  border: 1px solid hsl(215, 25%, 85%);
  z-index: 1;
  transition: border-color 0.15s ease, background-color 0.15s ease;
  font-variant-numeric: tabular-nums;
`;

const InnerContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  color: ${(p) =>
    p.disabled
      ? 'var(--number-box-disabled-font-color)'
      : 'hsl(215, 55%, 25%)'};
  &:hover {
    color: ${(p) =>
      p.disabled
        ? 'var(--number-box-disabled-font-color)'
        : 'hsl(215, 60%, 22%)'};
  }
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

const StyledInput = styled.input`
  color: hsl(215, 55%, 25%);
  font-weight: 500;
  font-size: clamp(
    ${(p) => p.$minfontsize},
    ${(p) => p.fontSize},
    ${(p) => p.$maxfontsize}
  );
  height: 100%;
  width: max(var(--number-box-width), var(--number-box-width));
  margin-left: 2px;
  text-align: center;
  line-height: normal;
  border: 1px solid hsl(215, 50%, 60%);
  background-color: white;
  box-sizing: border-box;
  border-radius: 4px;
  &:focus {
    outline: none;
    border-color: hsl(215, 55%, 50%);
    box-shadow: 0 0 0 2px hsl(215, 55%, 50%, 0.15);
  }
`;
