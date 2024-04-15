import React from 'react';

// Note: replace "Data" with the name of the thing being provided.
// For usage, see the "DataContextUser" component.

import useKeydown from '../../hooks/use-keydown.hook';
import { INITIAL_SEQUENCE } from '../../constants';
import { sequences } from '../../data';

export const DataContext = React.createContext();

function DataProvider({ children }) {
  const [sequenceLength, setSequenceLength] = React.useState(11);
  const [targetBoxIndex, setTargetBoxIndex] = React.useState(-1);
  const [gSequence, setGSequence] = React.useState(INITIAL_SEQUENCE.g);
  const [fSequence, setFSequence] = React.useState(INITIAL_SEQUENCE.f);
  const [mode, setMode] = React.useState('normal');
  const [metaMode, setMetaMode] = React.useState('classic');

  function handleAddZero(targetSequence) {
    const setSequence = targetSequence === 'g' ? setGSequence : setFSequence;
    setSequence((oldSequence) => [0, ...oldSequence]);
  }
  function handleLeftShift(targetSequence) {
    const setSequence = targetSequence === 'g' ? setGSequence : setFSequence;
    setSequence((oldSequence) => [...oldSequence.slice(1)]);
    if (Math.min(gSequence.length, fSequence.length) < sequenceLength) {
      setSequenceLength(Math.min(gSequence.length, fSequence.length));
    }
  }
  function handleSelectSequence(targetSequence, selectedSequence) {
    const setSequence = targetSequence === 'g' ? setGSequence : setFSequence;
    const sequence = sequences.filter((item) => item.id === selectedSequence)[0]
      .sequence;
    const finalSequence = targetSequence === 'g' ? sequence : [0, ...sequence];
    setSequence(finalSequence);
  }

  function handleSelectMode(selectedMode) {
    setMode(selectedMode);
    if (selectedMode === 'bell') {
      setFSequence([0, ...gSequence]);
    }
    if (selectedMode === 'appell') {
      const appellArray = new Array(gSequence.length).fill(0);
      appellArray[1] = 1;
      setFSequence(appellArray);
    }
  }

  function handleAugmentSequence() {
    setSequenceLength((oldValue) => oldValue + 1);
  }
  function handleTruncateSequence() {
    setSequenceLength((oldValue) => oldValue - 1);
  }

  function tabFocus(event, shiftWasPressed) {
    const increment = shiftWasPressed ? -1 : 1;
    setTargetBoxIndex((oldValue) => {
      let result = (oldValue + increment) % (sequenceLength * 2);
      if (result < 0) {
        result += sequenceLength * 2;
      }
      return result;
    });
  }

  // const handleTab = React.useCallback(tabFocus, []);
  useKeydown('Tab', (event, shiftWasPressed) =>
    tabFocus(event, shiftWasPressed)
  );

  return (
    <DataContext.Provider
      value={{
        sequenceLength,
        setSequenceLength,
        targetBoxIndex,
        setTargetBoxIndex,
        gSequence,
        fSequence,
        mode,
        handleAddZero,
        handleAugmentSequence,
        handleTruncateSequence,
        handleLeftShift,
        handleSelectSequence,
        handleSelectMode,
        metaMode,
        setMetaMode,
      }}
    >
      {children}
    </DataContext.Provider>
  );
}

export default DataProvider;
