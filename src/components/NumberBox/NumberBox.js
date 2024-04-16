import React from 'react';

import styled from 'styled-components';

import { DataContext } from '../DataProvider';

function NumberBox({ value, index, onSubmit, sequenceId, children }) {
  const [digits, setDigits] = React.useState(value);
  const [isSelected, setIsSelected] = React.useState(false);
  const buttonRef = React.useRef(null);
  const {
    targetBoxIndex,
    setTargetBoxIndex,
    handleSelectSequence,
    setNumberBoxRefs,
    tabWasPressed,
    setTabWasPressed,
  } = React.useContext(DataContext);

  const [notMounting, setNotMounting] = React.useState(false);
  React.useEffect(() => {
    console.log('mounting');
    setNotMounting(true);
  }, []);
  React.useEffect(() => {
    if (targetBoxIndex === index) {
      console.log(`targetBoxIndex: ${targetBoxIndex}`);
      console.log(`index: ${index}`);
      console.log(`notMounting: ${notMounting}`);
    }
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
  const minFontSize = '0.8rem';
  const maxFontSize = '1.1rem';

  const containerWidthPx = parseInt(boxLength);
  const maxWidthPerCharacter =
    (containerWidthPx * 1.4) / digits.toString().length;
  const rootFontSizePx = 16;
  const maxFontSizeRem = `${maxWidthPerCharacter / rootFontSizePx}rem`;

  function handleClick(event) {
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
        minFontSize={minFontSize}
        fontSize={maxFontSizeRem}
        maxFontSize={maxFontSize}
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
      minFontSize={minFontSize}
      fontSize={maxFontSizeRem}
      maxFontSize={maxFontSize}
      ref={buttonRef}
    >
      {digits}
    </InnerElement>
  );

  return (
    <Wrapper onClick={(event) => handleClick(event)}>
      <InnerContainer>{boxContents}</InnerContainer>
    </Wrapper>
  );
}

export default NumberBox;

const Wrapper = styled.div`
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
    ${(p) => p.minFontSize},
    ${(p) => p.fontSize},
    ${(p) => p.maxFontSize}
  );
`;

const StyledInput = styled.input`
  font-family: 'Lato', sans-serif;
  color: hsl(243, 85%, 40%);
  font-size: clamp(
    ${(p) => p.minFontSize},
    ${(p) => p.fontSize},
    ${(p) => p.maxFontSize}
  );
  height: 100%;
  width: max(var(--number-box-width), var(--number-box-width));
  margin-left: 2px;
  text-align: center;
`;
