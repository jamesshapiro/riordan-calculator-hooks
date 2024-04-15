import React from 'react';

import styled from 'styled-components';

function NumberBox({ children }) {
  const [digits, setDigits] = React.useState(12345);
  const [isSelected, setIsSelected] = React.useState(false);
  const bodyStyles = getComputedStyle(document.body);
  const boxLength = bodyStyles
    .getPropertyValue('--number-box-width')
    .replace('px', '');

  const containerWidthPx = parseInt(boxLength);
  const maxWidthPerCharacter = containerWidthPx / digits.toString().length;
  const rootFontSizePx = 16;
  const maxFontSizeRem = `${maxWidthPerCharacter / rootFontSizePx}rem`;

  function handleClick() {
    setIsSelected(true);
  }
  function handleBlur() {
    setIsSelected(false);
  }

  const inputNumberBox = (
    <form
      onSubmit={(event) => {
        console.log('submitting');
        event.preventDefault();
        setIsSelected(false);
      }}
    >
      <StyledInput
        value={digits}
        fontSize={maxFontSizeRem}
        onChange={(event) => setDigits(event.target.value)}
        onBlur={handleBlur}
        autoFocus
      />
    </form>
  );

  const boxContents = isSelected ? (
    inputNumberBox
  ) : (
    <InnerElement onClick={handleClick}>{digits}</InnerElement>
  );

  return (
    <Wrapper>
      <InnerContainer fontSize={maxFontSizeRem}>{boxContents}</InnerContainer>
    </Wrapper>
  );
}

export default NumberBox;

const Wrapper = styled.div`
  display: inline-block;
  background-color: hsl(243, 10%, 95%);
  border-radius: 8px;
  width: var(--number-box-width);
  height: var(--number-box-height);
  margin: 1px;
  border: 1px solid hsl(243, 85%, 65%);
  /* padding: 10%; */
`;

const InnerContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  font-family: 'Lato', sans-serif;
  color: hsl(243, 85%, 65%);
  font-size: clamp(1rem, ${(p) => p.fontSize}, 3rem);
  width: fit-content;
  height: 100%;
  width: 100%;
`;

const InnerElement = styled.p`
  width: fit-content;
`;

const StyledInput = styled.input`
  font-family: 'Lato', sans-serif;
  color: hsl(243, 85%, 65%);
  font-size: clamp(1rem, ${(p) => p.fontSize}, 3rem);
  width: fit-content;
  height: 100%;
  width: 90%;
  margin-left: 5px;
  text-align: center;
`;
