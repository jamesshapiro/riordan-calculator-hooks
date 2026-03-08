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
  border: 1.5px solid #d4cdc4;
  &:hover {
    background-color: #3c3024;
    color: #faf9f7;
    border-color: #3c3024;
  }
  border-radius: 50%;
  width: 24px;
  height: 24px;
  cursor: pointer;
  top: -14px;
  left: 37px;
  z-index: ${(p) => p.zidx};
  display: flex;
  justify-content: center;
  align-items: center;
  transition: all 0.15s ease;
`;

const Wrapper = styled.div`
  position: relative;
  display: inline-block;
  cursor: ${(p) => (p.disabled ? 'default' : 'text')};
  background-color: ${(p) =>
    p.disabled ? '#f0ece8' : '#ffffff'};
  &:hover {
    background-color: ${(p) =>
      p.disabled ? '#f0ece8' : '#f5f0eb'};
  }
  border-radius: 6px;
  width: fit-content;
  min-width: var(--number-box-width);
  width: 100%;
  height: var(--number-box-height);
  margin: 1px;
  border: 1px solid #d4cdc4;
  z-index: 1;
  transition: all 0.15s ease;
`;

const InnerContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  color: ${(p) => (p.disabled ? '#9a9088' : '#3c3024')};
  &:hover {
    color: ${(p) => (p.disabled ? '#9a9088' : '#1a1612')};
  }
  width: 100%;
  height: 100%;
  font-variant-numeric: tabular-nums;
`;

const InnerElement = styled.p`
  width: fit-content;
  font-size: clamp(
    ${(p) => p.$minfontsize},
    ${(p) => p.fontSize},
    ${(p) => p.$maxfontsize}
  );
`;

const StyledInput = styled.input`
  color: #1a1612;
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
  border: 1.5px solid #b4aa9e;
  background-color: #ffffff;
  box-sizing: border-box;
  border-radius: 4px;
  outline: none;
  &:focus {
    border-color: #3c3024;
    box-shadow: 0 0 0 2px rgba(60, 48, 36, 0.1);
  }
`;
