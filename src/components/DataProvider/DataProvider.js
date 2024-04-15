import React from 'react';

// Note: replace "Data" with the name of the thing being provided.
// For usage, see the "DataContextUser" component.

import useKeydown from '../../hooks/use-keydown.hook';
import { INITIAL_SEQUENCE } from '../../constants';
import { sequences } from '../../data';

export const DataContext = React.createContext();

const ENDPOINT = process.env.REACT_APP_MATRIX_URL;

function DataProvider({ children }) {
  const [sequenceLength, setSequenceLength] = React.useState(11);
  const [targetBoxIndex, setTargetBoxIndex] = React.useState(-1);
  const [gSequence, setGSequence] = React.useState(INITIAL_SEQUENCE.g);
  const [fSequence, setFSequence] = React.useState(INITIAL_SEQUENCE.f);
  const [mode, setMode] = React.useState('normal');
  const [metaMode, setMetaMode] = React.useState('classic');
  const [matrix, setMatrix] = React.useState(null);
  const [computeWasRequested, setComputeWasRequested] = React.useState(false);
  const [matrixWasFetched, setMatrixWasFetched] = React.useState(false);

  React.useEffect(() => {
    async function fetchMatrix(
      sequenceLength,
      gSequence,
      fSequence,
      mode,
      metaMode
    ) {
      console.log('computing...');
      console.log(`sequenceLength: ${sequenceLength}`);
      console.log(`gSequence: ${gSequence}`);
      console.log(`fSequence: ${fSequence}`);
      console.log(`mode: ${mode}`);
      console.log(`metaMode: ${metaMode}`);
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
      console.log(payload);
      const request = new Request(ENDPOINT, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
        timeout: 100000,
      });
      const response = await fetch(request);
      console.log('received response');
      const json = await response.json();
      setMatrix((oldData) => json);
      return json;
    }
    if (computeWasRequested && !matrixWasFetched) {
      fetchMatrix(sequenceLength, gSequence, fSequence, mode, metaMode);
    }
  }, [computeWasRequested, matrixWasFetched]);

  function handleCompute() {
    setComputeWasRequested(true);
    setMatrixWasFetched(false);
  }

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
        matrix,
        setMetaMode,
        handleCompute,
      }}
    >
      {children}
    </DataContext.Provider>
  );
}

export default DataProvider;
