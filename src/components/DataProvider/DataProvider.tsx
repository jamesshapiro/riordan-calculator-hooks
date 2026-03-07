import React from 'react';

import useKeydown from '../../hooks/use-keydown.hook';
import { sequences } from '../../data';

import { UserContext } from '../UserProvider';
import { useRouter } from 'next/router';

export const DataContext = React.createContext<any>({});

const ENDPOINT = process.env.NEXT_PUBLIC_MATRIX_URL;
const AUTH_ENDPOINT = process.env.NEXT_PUBLIC_MATRIX_URL_AUTH;
const API_KEY = process.env.NEXT_PUBLIC_API_KEY;

function DataProvider({ children }: any) {
  const [sequenceLength, setSequenceLength] = React.useState(8);
  const [targetBoxIndex, setTargetBoxIndex] = React.useState(-1);
  const [gSequence, setGSequence] = React.useState(sequences[1].sequence);
  const [fSequence, setFSequence] = React.useState([
    0,
    ...sequences[1].sequence.slice(0, -1),
  ]);
  const [mode, setMode] = React.useState('normal');
  const [metaMode, setMetaMode] = React.useState('classic');
  const [matrix, setMatrix] = React.useState<any>(null);
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
  const [shareMatrixId, setShareMatrixId] = React.useState('');
  const [createdAt, setCreatedAt] = React.useState('');
  const [creatorName, setCreatorName] = React.useState('');
  const [customSequenceTitle, setCustomSequenceTitle] = React.useState('');
  const [customSequence, setCustomSequence] = React.useState([
    1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
  ]);
  const [customSequenceLength, setCustomSequenceLength] = React.useState(10);

  const [oeisSequence, setOeisSequence] = React.useState<any>(null);
  const [oeisSequenceId, setOeisSequenceId] = React.useState('');
  const [isOeisLoading, setIsOeisLoading] = React.useState(false);
  const [oeisError, setOeisError] = React.useState('');

  const { isAuthenticated, isAuthModalOpen, token, userSequences } =
    React.useContext(UserContext);

  const router = useRouter();

  const fetchOeisSequence = React.useCallback(async (sequenceId: string, token: string) => {
    setIsOeisLoading(true);
    setOeisError('');
    const URL = process.env.NEXT_PUBLIC_MATRIX_URL + `oeis?oeis_id=${sequenceId}`;
    const HEADERS: any = {
      'Content-Type': 'application/json',
      Authorization: token,
    };
    const request = new Request(URL, {
      method: 'GET',
      headers: HEADERS,
    });

    try {
      const response = await fetch(request);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      const sequence = data.sequence;

      if (sequence) {
        const sequenceData = sequence.slice(0, 15);

        if (sequenceData) {
          setOeisSequence(sequenceData);
          setOeisSequenceId(sequenceId);
        } else {
          throw new Error('No sequence data found');
        }
      } else {
        throw new Error('Sequence not found');
      }
    } catch (error: any) {
      console.error('Error fetching OEIS sequence:', error);
      setOeisError(error.message || 'Failed to fetch sequence');
      setOeisSequence(null);
      setOeisSequenceId('');
    } finally {
      setIsOeisLoading(false);
    }
  }, []);

  function handleSequenceChange(sequenceId: string, newSequence: number[], isCustom = true) {
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

  const setOeisToF = React.useCallback(
    (sequence: number[]) => {
      if (sequence && sequence.length > 0) {
        handleSequenceChange('f', sequence);
        setCurrentFSelection('custom');
      }
    },
    [handleSequenceChange]
  );

  const setOeisToG = React.useCallback(
    (sequence: number[]) => {
      if (sequence && sequence.length > 0) {
        handleSequenceChange('g', sequence);
        setCurrentGSelection('custom');
      }
    },
    [handleSequenceChange]
  );

  function getDerivativeSequence(fSequence: number[]) {
    if (metaMode === 'exponential') {
      return fSequence.slice(1);
    }
    return fSequence.slice(1).map((elem, idx) => {
      return elem * (idx + 1);
    });
  }

  function getAssociatedSequence(fSequence: number[]) {
    const newGSequence = Array(fSequence.length).fill(0);
    newGSequence[0] = 1;
    return newGSequence;
  }

  function getBellSequence(gSequence: number[]) {
    return [0, ...gSequence];
  }

  function getTwoBellSequence(gSequence: number[]) {
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
      sequenceLength: number,
      gSequence: number[],
      fSequence: number[],
      mode: string,
      metaMode: string
    ) {
      let fSequenceSubmit: any = fSequence;
      let gSequenceSubmit: any = gSequence;
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
      const HEADERS: any = isAuthenticated
        ? {
            'Content-Type': 'application/json',
            Authorization: token,
          }
        : {
            'Content-Type': 'application/json',
            'x-api-key': API_KEY,
          };

      const request = new Request(URL!, {
        method: 'PUT',
        headers: HEADERS,
        body: JSON.stringify(payload),
      });
      const response = await fetch(request);
      const json = await response.json();
      setMatrix(json);
      const parsedJson = JSON.parse(json);
      const shareId = parsedJson['shareid'];
      setShareMatrixId(shareId);
      return json;
    }
    if (computeWasRequested && !matrixWasFetched) {
      fetchMatrix(sequenceLength, gSequence, fSequence, mode, metaMode);
      setComputeWasRequested(false);
      setMatrixWasFetched(true);
    }
  }, [computeWasRequested, matrixWasFetched]);

  React.useEffect(() => {
    async function fetchPrecomputedMatrix(matrixIdentifier: string) {
      const URL = isAuthenticated
        ? AUTH_ENDPOINT + `query?id=${matrixIdentifier}`
        : ENDPOINT + `query?id=${matrixIdentifier}`;
      const HEADERS: any = isAuthenticated
        ? {
            'Content-Type': 'application/json',
            Authorization: token,
          }
        : {
            'Content-Type': 'application/json',
            'x-api-key': API_KEY,
          };
      const request = new Request(URL!, {
        method: 'GET',
        headers: HEADERS,
      });
      const response = await fetch(request);
      const json = await response.json();
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

  React.useEffect(() => {
    if (!router.isReady) return;
    const searchParam = router.asPath.includes('?')
      ? router.asPath.split('?')[1]
      : '';
    if (matrixId === '' && searchParam.length > 0) {
      setMatrixId(searchParam);
      if (!matrix) {
        setShareMatrixId(searchParam);
      }
    }
  }, [router.isReady, router.asPath]);

  function handleCompute() {
    setComputeWasRequested(true);
    setMatrixWasFetched(false);
  }

  function handleSelectSequence(targetSequence: string, selectedSequence: string) {
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
    const allSequences = [...sequences, ...userSequences];
    const sequence = allSequences.filter(
      (item: any) => item.id === selectedSequence
    )[0].sequence;
    const finalSequence = targetSequence === 'g' ? sequence : [0, ...sequence];
    handleSequenceChange(targetSequence, finalSequence, false);
  }

  function handleSelectMode(selectedMode: string) {
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

  function tabFocus(event: any, bothShiftAndTabWerePressed: boolean) {
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

  const addCustomSequence = async (sequenceValues: number[], sequenceTitle: string) => {
    const URL = AUTH_ENDPOINT + `sequence`;
    const HEADERS: any = {
      'Content-Type': 'application/json',
      Authorization: token,
    };
    const payload = { title: sequenceTitle, values: sequenceValues };
    const request = new Request(URL!, {
      method: 'PUT',
      headers: HEADERS,
      body: JSON.stringify(payload),
    });
    const response = await fetch(request);
    const json = await response.json();
  };

  useKeydown('Tab', !isAuthModalOpen, (event: any, bothShiftAndTabWerePressed: boolean) => {
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
        handleAugmentSequence,
        handleTruncateSequence,
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
        shareMatrixId,
        customSequence,
        setCustomSequence,
        customSequenceLength,
        setCustomSequenceLength,
        addCustomSequence,
        customSequenceTitle,
        setCustomSequenceTitle,
        oeisSequence,
        setOeisSequence,
        oeisSequenceId,
        setOeisSequenceId,
        isOeisLoading,
        setIsOeisLoading,
        oeisError,
        setOeisError,
        fetchOeisSequence,
        setOeisToF,
        setOeisToG,
      }}
    >
      {children}
    </DataContext.Provider>
  );
}

export default DataProvider;
