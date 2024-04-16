import React from 'react';

import styled from 'styled-components';

import { DataContext } from '../DataProvider';

function NumberBox({
  value,
  index,
  onSubmit,
  sequenceId,
  isFirst,
  isLast,
  children,
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
    handleLeftShift,
  } = React.useContext(DataContext);

  function handleCloseOption() {
    if (isFirst) {
      handleLeftShift(sequenceId);
    } else {
      handleTruncateSequence();
    }
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

    const { offsetWidth: width, offsetHeight: height } = divRef.current;
    const rect = divRef.current.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    if (x > width / 8 && y < height / 8) {
      console.log('Click in upper right quadrant: ignored');
      return; // Ignore the click
    }

    console.log('click!');
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
    const cleaned = value.replace(/[^0-9]/g, '');
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
        minfontsize={minfontsize}
        fontSize={maxfontsizeRem}
        maxfontsize={maxfontsize}
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
      minfontsize={minfontsize}
      fontSize={maxfontsizeRem}
      maxfontsize={maxfontsize}
      ref={buttonRef}
    >
      {digits}
    </InnerElement>
  );

  const closeSymbol = isFirst ? 'X' : '<';
  const closeBubble =
    isLast || isFirst ? (
      <CloseBubble onClick={handleCloseOption}>{closeSymbol}</CloseBubble>
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

export default NumberBox;

const CloseBubble = styled.div`
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
  z-index: 10;
  text-align: center;
  padding-top: 5px;
`;

const Wrapper = styled.div`
  position: relative;
  display: inline-block;
  cursor: text;
  background-color: var(--number-box-background-color);
  &:hover {
    background-color: var(--number-box-hover-background-color);
    color: var(--number-box-hover-font-color);
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
  &:hover {
    color: var(--number-box-hover-font-color);
  }
  width: fit-content;
  height: 100%;
  width: 100%;
`;

const InnerElement = styled.p`
  width: fit-content;
  font-size: clamp(
    ${(p) => p.minfontsize},
    ${(p) => p.fontSize},
    ${(p) => p.maxfontsize}
  );
`;

const StyledInput = styled.input`
  font-family: 'Lato', sans-serif;
  color: hsl(243, 85%, 40%);
  font-size: clamp(
    ${(p) => p.minfontsize},
    ${(p) => p.fontSize},
    ${(p) => p.maxfontsize}
  );
  height: 100%;
  width: max(var(--number-box-width), var(--number-box-width));
  margin-left: 2px;
  text-align: center;
`;
