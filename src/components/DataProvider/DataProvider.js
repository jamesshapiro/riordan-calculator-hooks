import React from 'react';

// Note: replace "Data" with the name of the thing being provided.
// For usage, see the "DataContextUser" component.

import useKeydown from '../../hooks/use-keydown.hook';
import { sequences } from '../../data';

import { UserContext } from '../UserProvider';

export const DataContext = React.createContext();

const ENDPOINT = process.env.REACT_APP_MATRIX_URL;
const AUTH_ENDPOINT = process.env.REACT_APP_MATRIX_URL_AUTH;
const API_KEY = process.env.REACT_APP_API_KEY;

function DataProvider({ children }) {
  const [sequenceLength, setSequenceLength] = React.useState(8);
  const [targetBoxIndex, setTargetBoxIndex] = React.useState(-1);
  const [gSequence, setGSequence] = React.useState(sequences[1].sequence);
  const [fSequence, setFSequence] = React.useState([
    0,
    ...sequences[1].sequence.slice(0, -1),
  ]);
  const [mode, setMode] = React.useState('normal');
  const [metaMode, setMetaMode] = React.useState('classic');
  const [matrix, setMatrix] = React.useState(null);
  const [computeWasRequested, setComputeWasRequested] = React.useState(false);
  const [matrixWasFetched, setMatrixWasFetched] = React.useState(false);
  const [currentGSelection, setCurrentGSelection] = React.useState('catalan');
  const [currentFSelection, setCurrentFSelection] = React.useState('catalan');
  const [tabWasPressed, setTabWasPressed] = React.useState(false);
  const [fJustIncreased, setFJustIncreased] = React.useState(false);
  const [gJustIncreased, setGJustIncreased] = React.useState(false);

  const { isAuthenticated, token } = React.useContext(UserContext);

  React.useEffect(() => {
    async function fetchMatrix(
      sequenceLength,
      gSequence,
      fSequence,
      mode,
      metaMode
    ) {
      let fSequenceSubmit = fSequence;
      let gSequenceSubmit = gSequence;
      if (mode === 'bell') {
        fSequenceSubmit = [0].concat(gSequence.slice(0, sequenceLength)).join();
      } else if (mode === 'derivative' && metaMode === 'exponential') {
        const derivative = fSequence.slice(1);
        gSequenceSubmit = derivative.join();
      } else if (mode === 'derivative') {
        const derivative = fSequence.slice(1).map((element, index) => {
          return element * (index + 1);
        });
        gSequenceSubmit = derivative.join();
      } else if (mode === 'appell') {
        const newFSequence = Array(gSequence.length).fill(0);
        newFSequence[1] = 1;
        fSequenceSubmit = newFSequence.join();
      } else if (mode === 'associated') {
        const newGSequence = Array(fSequence.length).fill(0);
        newGSequence[0] = 1;
        gSequenceSubmit = newGSequence.join();
      } else if (mode === 'twobell') {
        let gSquared = Array(gSequence.length).fill(0);
        let i = 0;
        for (i = 0; i < gSquared.length; i++) {
          const array_1 = gSequence.slice(0, i + 1);
          const array_2 = gSequence.slice(0, i + 1).reverse();
          const unreducedProduct = array_1.map((elem, idx) => {
            return elem * array_2[idx];
          });
          gSquared[i] = unreducedProduct.reduce(function (a, b) {
            return a + b;
          }, 0);
          const newFSequence = [0].concat(gSquared);
          fSequenceSubmit = newFSequence.join();
        }
      }
      const payload = {
        g: gSequenceSubmit.slice(0, sequenceLength),
        f: fSequenceSubmit.slice(0, sequenceLength),
      };

      const URL = isAuthenticated ? AUTH_ENDPOINT : ENDPOINT;
      const HEADERS = isAuthenticated
        ? {
            'Content-Type': 'application/json',
            Authorization: token,
          }
        : {
            'Content-Type': 'application/json',
            'x-api-key': API_KEY,
          };

      const request = new Request(URL, {
        method: 'PUT',
        headers: HEADERS,
        body: JSON.stringify(payload),
        timeout: 100000,
      });
      const response = await fetch(request);
      const json = await response.json();
      setMatrix((oldData) => json);
      return json;
    }
    if (computeWasRequested && !matrixWasFetched) {
      fetchMatrix(sequenceLength, gSequence, fSequence, mode, metaMode);
      setComputeWasRequested(false);
      setMatrixWasFetched(true);
    }
  }, [computeWasRequested, matrixWasFetched]);

  function handleCompute() {
    setComputeWasRequested(true);
    setMatrixWasFetched(false);
  }

  function handleAddZero(targetSequence) {
    const setSequence = targetSequence === 'g' ? setGSequence : setFSequence;
    const increasedSetter =
      targetSequence === 'g' ? setGJustIncreased : setFJustIncreased;
    setSequence((oldSequence) => [0, ...oldSequence]);
    increasedSetter(true);
  }

  function handleLeftShift(targetSequence) {
    const setSequence = targetSequence === 'g' ? setGSequence : setFSequence;
    setSequence((oldSequence) => [...oldSequence.slice(1)]);
    if (Math.min(gSequence.length, fSequence.length) < sequenceLength) {
      setSequenceLength(Math.min(gSequence.length, fSequence.length));
    }
    setGJustIncreased(false);
    setFJustIncreased(false);
  }
  function handleSelectSequence(targetSequence, selectedSequence) {
    const setCurrentSelection =
      targetSequence === 'g' ? setCurrentGSelection : setCurrentFSelection;
    setCurrentSelection(selectedSequence);
    if (selectedSequence === 'custom') {
      if (mode !== 'normal') {
        setCurrentGSelection('custom');
        setCurrentFSelection('custom');
      }
      return;
    }
    // const setSequence = targetSequence === 'g' ? setGSequence : setFSequence;
    const sequence = sequences.filter((item) => item.id === selectedSequence)[0]
      .sequence;
    const finalSequence = targetSequence === 'g' ? sequence : [0, ...sequence];
    // setSequence(finalSequence);
    handleSequenceChange(targetSequence, finalSequence, false);
  }

  function handleSequenceChange(sequenceId, newSequence, isCustom = true) {
    const setSequence = sequenceId === 'g' ? setGSequence : setFSequence;
    // const setAlternate = sequenceId === 'g' ? setFSequence : setGSequence;
    if (mode === 'normal') {
      setSequence(newSequence);
      return;
    }
    if (mode === 'bell') {
      setGSequence(newSequence);
      setFSequence([0, ...newSequence]);
      return;
    }
    if (mode === 'appell') {
      setGSequence(newSequence);
    }
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

  function tabFocus(event, bothShiftAndTabWerePressed) {
    const increment = bothShiftAndTabWerePressed ? -1 : 1;
    setTabWasPressed(true);
    setTargetBoxIndex((oldValue) => {
      let result = 0;
      let divisor = sequenceLength * 2;
      let delta = 0;
      if (['bell', 'appell', 'twobell'].includes(mode)) {
        divisor = sequenceLength;
      } else if (['derivative', 'associated'].includes(mode)) {
        divisor = sequenceLength;
        delta = sequenceLength;
      }
      result = (oldValue + increment) % divisor;
      if (result < 0) {
        result += divisor + delta;
      }
      return result;
    });
  }

  // const handleTab = React.useCallback(tabFocus, []);
  useKeydown('Tab', (event, bothShiftAndTabWerePressed) =>
    tabFocus(event, bothShiftAndTabWerePressed)
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
        matrix,
        setMetaMode,
        handleCompute,
        computeWasRequested,
        matrixWasFetched,
        handleSequenceChange,
        currentGSelection,
        currentFSelection,
        tabWasPressed,
        setTabWasPressed,
        fJustIncreased,
        setFJustIncreased,
        gJustIncreased,
        setGJustIncreased,
      }}
    >
      {children}
    </DataContext.Provider>
  );
}

export default DataProvider;
