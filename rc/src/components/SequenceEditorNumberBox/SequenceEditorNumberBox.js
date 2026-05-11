import React from 'react';

import styles from './SequenceEditorNumberBox.module.css';

import { DataContext } from '../DataProvider';

import TooltipWrapper from '../TooltipWrapper';

function SequenceEditorNumberBox({
  value,
  index,
  onSubmit,
  sequenceId,
  sequenceValue,
  isFirst,
  zIndex,
  handleSequenceChange,
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
  } = React.useContext(DataContext);

  function handleCloseOption() {
    if (isFirst) {
      handleSequenceChange(sequenceValue.slice(1));
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

  const bodyStyles = typeof window !== 'undefined' ? getComputedStyle(document.body) : null;
  const boxLength = bodyStyles
    ? bodyStyles.getPropertyValue('--number-box-width').replace('px', '')
    : '50';
  const minfontsize = '0.8rem';
  const maxfontsize = '1.1rem';

  const containerWidthPx = parseInt(boxLength);
  const maxWidthPerCharacter =
    (containerWidthPx * 1.4) / digits.toString().length;
  const rootFontSizePx = 16;
  const maxfontsizeRem = `${maxWidthPerCharacter / rootFontSizePx}rem`;

  function handleClick(event) {
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

  const fontSizeClamp = `clamp(${minfontsize}, ${maxfontsizeRem}, ${maxfontsize})`;

  const inputNumberBox = (
    <form
      onSubmit={(event) => {
        event.preventDefault();
        setIsSelected(false);
        onSubmit(index, digits);
        handleSelectSequence(sequenceId, 'custom');
      }}
    >
      <input
        className={styles.styledInput}
        value={digits}
        style={{ fontSize: fontSizeClamp }}
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
    <p
      className={styles.innerElement}
      style={{ fontSize: fontSizeClamp }}
      ref={buttonRef}
    >
      {digits}
    </p>
  );

  const closeBubble =
    false || isFirst ? (
      <TooltipWrapper
        message='Delete First Term'
        side='top'
        sideOffset={5}
        arrowshiftX='0'
        arrowshiftY='0'
        zidx={zIndex}
      >
        <div className={styles.closeBubble} style={{ zIndex: zIndex }} onClick={handleCloseOption}>
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
        </div>
      </TooltipWrapper>
    ) : null;

  return (
    <div className={styles.wrapper} ref={divRef} onClick={(event) => handleClick(event)}>
      <div className={styles.innerContainer}>
        {closeBubble}
        {boxContents}
      </div>
    </div>
  );
}

export default SequenceEditorNumberBox;
