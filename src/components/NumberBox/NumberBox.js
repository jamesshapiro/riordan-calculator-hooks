import React from 'react';

import styled from 'styled-components';

function NumberBox({ initialValue, children }) {
  const [digits, setDigits] = React.useState(initialValue);
  const [isSelected, setIsSelected] = React.useState(false);
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
        minFontSize={minFontSize}
        fontSize={maxFontSizeRem}
        maxFontSize={maxFontSize}
        onChange={(event) => setDigits(event.target.value)}
        onBlur={handleBlur}
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
      onClick={handleClick}
    >
      {digits}
    </InnerElement>
  );

  return (
    <Wrapper>
      <InnerContainer>{boxContents}</InnerContainer>
    </Wrapper>
  );
}

export default NumberBox;

const Wrapper = styled.div`
  display: inline-block;
  background-color: hsl(243, 10%, 95%);
  border-radius: 8px;
  width: fit-content;
  min-width: var(--number-box-width);
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
  color: hsl(243, 85%, 65%);
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
