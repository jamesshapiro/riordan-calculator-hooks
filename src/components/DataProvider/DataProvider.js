import React from 'react';

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
  const [matrixCreator, setMatrixCreator] = React.useState('');
  const [title, setTitle] = React.useState('');
  const [comment, setComment] = React.useState('');
  const [matrixId, setMatrixId] = React.useState('');
  const [createdAt, setCreatedAt] = React.useState('');
  const [creatorName, setCreatorName] = React.useState('');

  const { isAuthenticated, isAuthModalOpen, token } =
    React.useContext(UserContext);

  function getDerivativeSequence(fSequence) {
    if (metaMode === 'exponential') {
      return fSequence.slice(1);
    }
    return fSequence.slice(1).map((elem, idx) => {
      return elem * (idx + 1);
    });
  }

  function getAssociatedSequence(fSequence) {
    const newGSequence = Array(fSequence.length).fill(0);
    newGSequence[0] = 1;
    return newGSequence;
  }

  function getBellSequence(gSequence) {
    return [0, ...gSequence];
  }

  function getTwoBellSequence(gSequence) {
    const gSquared = Array(gSequence.length).fill(0);
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
    }
    return [0, ...gSquared];
  }

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
      // if (mode === 'bell') {
      //   fSequenceSubmit = [0].concat(gSequence.slice(0, sequenceLength)).join();
      // } else if (mode === 'derivative' && metaMode === 'exponential') {
      //   const derivative = fSequence.slice(1);
      //   gSequenceSubmit = derivative.join();
      // } else if (mode === 'appell') {
      //   const newFSequence = Array(gSequence.length).fill(0);
      //   newFSequence[1] = 1;
      //   fSequenceSubmit = newFSequence.join();
      // } else if (mode === 'associated') {
      //   const newGSequence = Array(fSequence.length).fill(0);
      //   newGSequence[0] = 1;
      //   gSequenceSubmit = newGSequence.join();
      // } else if (mode === 'twobell') {
      //   let gSquared = Array(gSequence.length).fill(0);
      //   let i = 0;
      //   for (i = 0; i < gSquared.length; i++) {
      //     const array_1 = gSequence.slice(0, i + 1);
      //     const array_2 = gSequence.slice(0, i + 1).reverse();
      //     const unreducedProduct = array_1.map((elem, idx) => {
      //       return elem * array_2[idx];
      //     });
      //     gSquared[i] = unreducedProduct.reduce(function (a, b) {
      //       return a + b;
      //     }, 0);
      //     const newFSequence = [0].concat(gSquared);
      //     fSequenceSubmit = newFSequence.join();
      //   }
      // }
      const payload = {
        g: gSequenceSubmit.slice(0, sequenceLength),
        f: fSequenceSubmit.slice(0, sequenceLength),
        gSequenceId: currentGSelection,
        fSequenceId: currentFSelection,
        sequenceLength: sequenceLength,
        mode,
        metaMode,
      };

      const URL = isAuthenticated
        ? AUTH_ENDPOINT + 'queries'
        : ENDPOINT + 'queries';
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

  React.useEffect(() => {
    async function fetchPrecomputedMatrix(matrixIdentifier) {
      const URL = isAuthenticated
        ? AUTH_ENDPOINT + `query?id=${matrixIdentifier}`
        : ENDPOINT + `query?id=${matrixIdentifier}`;
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
        method: 'GET',
        headers: HEADERS,
        timeout: 100000,
      });
      const response = await fetch(request);
      const json = await response.json();
      // setMatrix((oldData) => json);
      const retrievedGSequenceId = json['G_SEQUENCE_ID']['S'];
      const retrievedFSequenceId = json['F_SEQUENCE_ID']['S'];
      const retrievedSequenceLength = parseInt(json['SEQUENCE_LENGTH']['S']);
      let retrievedGSequence = JSON.parse(json['G_SEQUENCE']['S']);
      let retrievedFSequence = JSON.parse(json['F_SEQUENCE']['S']);

      setCreatedAt(json['CREATED_AT']['S']);
      setCreatorName(json['CREATOR_NAME']['S']);
      setSequenceLength(retrievedSequenceLength);
      setCurrentGSelection(retrievedGSequenceId);
      setCurrentFSelection(retrievedFSequenceId);
      setMatrixCreator(json['CREATED_BY']['S']);
      if (json['TITLE']) {
        setTitle(json['TITLE']['S']);
      }
      if (json['COMMENT']) {
        setComment(json['COMMENT']['S']);
      }

      if (retrievedGSequenceId !== 'custom') {
        const result = sequences.filter(
          (item) => item.id === retrievedGSequenceId
        )[0].sequence;
        retrievedGSequence = result;
      }
      if (retrievedFSequenceId !== 'custom') {
        retrievedFSequence = [
          0,
          ...sequences.filter((item) => item.id === retrievedFSequenceId)[0]
            .sequence,
        ];
      }

      let maxSequenceLength = Math.max(
        retrievedGSequence.length,
        retrievedFSequence.length
      );
      if (maxSequenceLength === retrievedSequenceLength) {
        maxSequenceLength += 7;
      }
      if (retrievedGSequence.length < maxSequenceLength) {
        const zeroesToAdd = Array(
          maxSequenceLength - retrievedGSequence.length
        ).fill(0);
        retrievedGSequence = [...retrievedGSequence, ...zeroesToAdd];
      }
      if (retrievedFSequence.length < maxSequenceLength) {
        const zeroesToAdd = Array(
          maxSequenceLength - retrievedFSequence.length
        ).fill(0);
        retrievedFSequence = [...retrievedFSequence, ...zeroesToAdd];
      }

      setGSequence(retrievedGSequence);
      setFSequence(retrievedFSequence);
      setMode(json['MODE']['S']);
      setMetaMode(json['METAMODE']['S']);
      setMatrix(json['MATRIX_DATA']['S']);

      return json;
    }
    if (matrixId) {
      fetchPrecomputedMatrix(matrixId);
    }
  }, [matrixId, token]);

  // get ? search params from the URL and print them
  const searchParam = window.location.search;
  if (matrixId === '' && searchParam.length > 1) {
    setMatrixId(searchParam.slice(1));
  }

  function handleCompute() {
    setComputeWasRequested(true);
    setMatrixWasFetched(false);
  }

  // Note incorporate functionality back into handleSequenceChange
  // function handleAddZero(targetSequence) {
  //   const setSequence = targetSequence === 'g' ? setGSequence : setFSequence;
  //   const increasedSetter =
  //     targetSequence === 'g' ? setGJustIncreased : setFJustIncreased;
  //   setSequence((oldSequence) => {
  //     handleSequenceChange(targetSequence, [0, ...oldSequence]);
  //   });
  //   increasedSetter(true);
  // }

  // Note incorporate functionality back into handleSequenceChange
  // function handleLeftShift(targetSequence) {
  //   const setSequence = targetSequence === 'g' ? setGSequence : setFSequence;
  //   setSequence((oldSequence) => [...oldSequence.slice(1)]);
  //   if (Math.min(gSequence.length, fSequence.length) < sequenceLength) {
  //     setSequenceLength(Math.min(gSequence.length, fSequence.length));
  //   }
  //   setGJustIncreased(false);
  //   setFJustIncreased(false);
  // }

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
    const oldSequence = sequenceId === 'g' ? gSequence : fSequence;
    const increasedSetter =
      sequenceId === 'g' ? setGJustIncreased : setFJustIncreased;
    if (newSequence.length > oldSequence.length) {
      increasedSetter(true);
    } else {
      setGJustIncreased(false);
      setFJustIncreased(false);
    }
    // const setAlternate = sequenceId === 'g' ? setFSequence : setGSequence;
    if (mode === 'normal') {
      setSequence(newSequence);
    } else if (mode === 'bell') {
      setGSequence(newSequence);
      const bellSequence = getBellSequence(newSequence);
      setFSequence(bellSequence);
    } else if (mode === 'appell') {
      setGSequence(newSequence);
    } else if (mode === 'derivative') {
      setFSequence(newSequence);
      const derivativeSequence = getDerivativeSequence(newSequence);
      setGSequence(derivativeSequence);
    } else if (mode === 'associated') {
      setFSequence(newSequence);
      const associatedSequence = getAssociatedSequence(newSequence);
      setGSequence(associatedSequence);
    }
    if (mode === 'twobell') {
      setGSequence(newSequence);
      const twoBellSequence = getTwoBellSequence(newSequence);
      setFSequence(twoBellSequence);
    }
  }

  function handleSelectMode(selectedMode) {
    setMode(selectedMode);
    if (selectedMode === 'bell') {
      setFSequence(getBellSequence(gSequence));
    } else if (selectedMode === 'appell') {
      const appellArray = new Array(gSequence.length).fill(0);
      appellArray[1] = 1;
      setFSequence(appellArray);
    } else if (selectedMode === 'derivative') {
      const derivativeSequence = getDerivativeSequence(fSequence);
      setGSequence(derivativeSequence);
    } else if (selectedMode === 'associated') {
      const associatedSequence = getAssociatedSequence(fSequence);
      setGSequence(associatedSequence);
    } else if (selectedMode === 'twobell') {
      const twoBellSequence = getTwoBellSequence(gSequence);
      setFSequence(twoBellSequence);
    }
  }

  function handleAugmentSequence() {
    setSequenceLength((oldValue) => oldValue + 1);
    setGJustIncreased(false);
    setFJustIncreased(false);
  }
  function handleTruncateSequence() {
    setSequenceLength((oldValue) => oldValue - 1);
    setGJustIncreased(false);
    setFJustIncreased(false);
  }

  function tabFocus(event, bothShiftAndTabWerePressed) {
    if (isAuthModalOpen) {
      return;
    }
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
      } else if (result < divisor) {
        result += delta;
      }
      if (result === sequenceLength && result > 0) {
        result += 1;
      }
      return result;
    });
  }

  // const handleTab = React.useCallback(tabFocus, []);
  useKeydown('Tab', !isAuthModalOpen, (event, bothShiftAndTabWerePressed) => {
    if (!isAuthModalOpen) {
      tabFocus(event, bothShiftAndTabWerePressed);
    }
  });

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
        // handleAddZero,
        handleAugmentSequence,
        handleTruncateSequence,
        // handleLeftShift,
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
        matrixId,
        matrixCreator,
        title,
        comment,
        createdAt,
        creatorName,
      }}
    >
      {children}
    </DataContext.Provider>
  );
}

export default DataProvider;
