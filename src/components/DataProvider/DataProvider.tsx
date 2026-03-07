'use client';

import React from 'react';

import useKeydown from '../../hooks/use-keydown.hook';
import { sequences } from '../../data';

import { UserContext } from '../UserProvider/UserProvider';

export interface DataContextType {
  sequenceLength: number;
  setSequenceLength: React.Dispatch<React.SetStateAction<number>>;
  targetBoxIndex: number;
  setTargetBoxIndex: React.Dispatch<React.SetStateAction<number>>;
  gSequence: number[];
  fSequence: number[];
  mode: string;
  handleAugmentSequence: () => void;
  handleTruncateSequence: () => void;
  handleSelectSequence: (targetSequence: string, selectedSequence: string) => void;
  handleSelectMode: (selectedMode: string) => void;
  metaMode: string;
  matrix: string | null;
  setMetaMode: React.Dispatch<React.SetStateAction<string>>;
  handleCompute: () => void;
  computeWasRequested: boolean;
  matrixWasFetched: boolean;
  handleSequenceChange: (sequenceId: string, newSequence: number[], isCustom?: boolean) => void;
  currentGSelection: string;
  currentFSelection: string;
  tabWasPressed: boolean;
  setTabWasPressed: React.Dispatch<React.SetStateAction<boolean>>;
  fJustIncreased: boolean;
  setFJustIncreased: React.Dispatch<React.SetStateAction<boolean>>;
  gJustIncreased: boolean;
  setGJustIncreased: React.Dispatch<React.SetStateAction<boolean>>;
  matrixId: string;
  matrixCreator: string;
  title: string;
  comment: string;
  createdAt: string;
  creatorName: string;
  shareMatrixId: string;
  customSequence: number[];
  setCustomSequence: React.Dispatch<React.SetStateAction<number[]>>;
  customSequenceLength: number;
  setCustomSequenceLength: React.Dispatch<React.SetStateAction<number>>;
  addCustomSequence: (sequenceValues: number[], sequenceTitle: string) => Promise<void>;
  customSequenceTitle: string;
  setCustomSequenceTitle: React.Dispatch<React.SetStateAction<string>>;
  oeisSequence: number[] | null;
  setOeisSequence: React.Dispatch<React.SetStateAction<number[] | null>>;
  oeisSequenceId: string;
  setOeisSequenceId: React.Dispatch<React.SetStateAction<string>>;
  isOeisLoading: boolean;
  setIsOeisLoading: React.Dispatch<React.SetStateAction<boolean>>;
  oeisError: string;
  setOeisError: React.Dispatch<React.SetStateAction<string>>;
  fetchOeisSequence: (sequenceId: string, token: string | null) => Promise<void>;
  setOeisToF: (sequence: number[]) => void;
  setOeisToG: (sequence: number[]) => void;
}

export const DataContext = React.createContext<DataContextType>({} as DataContextType);

const ENDPOINT = process.env.NEXT_PUBLIC_MATRIX_URL || '';
const AUTH_ENDPOINT = process.env.NEXT_PUBLIC_MATRIX_URL_AUTH || '';
const API_KEY = process.env.NEXT_PUBLIC_API_KEY || '';

function DataProvider({ children }: { children: React.ReactNode }) {
  const [sequenceLength, setSequenceLength] = React.useState(8);
  const [targetBoxIndex, setTargetBoxIndex] = React.useState(-1);
  const [gSequence, setGSequence] = React.useState(sequences[1].sequence);
  const [fSequence, setFSequence] = React.useState([
    0,
    ...sequences[1].sequence.slice(0, -1),
  ]);
  const [mode, setMode] = React.useState('normal');
  const [metaMode, setMetaMode] = React.useState('classic');
  const [matrix, setMatrix] = React.useState<string | null>(null);
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

  const [oeisSequence, setOeisSequence] = React.useState<number[] | null>(null);
  const [oeisSequenceId, setOeisSequenceId] = React.useState('');
  const [isOeisLoading, setIsOeisLoading] = React.useState(false);
  const [oeisError, setOeisError] = React.useState('');

  const { isAuthenticated, isAuthModalOpen, token, userSequences } =
    React.useContext(UserContext);

  const fetchOeisSequence = React.useCallback(async (sequenceId: string, token: string | null) => {
    setIsOeisLoading(true);
    setOeisError('');
    const OEIS_ENDPOINT = process.env.NEXT_PUBLIC_MATRIX_URL || '';
    const URL = OEIS_ENDPOINT + `oeis?oeis_id=${sequenceId}`;
    const HEADERS: Record<string, string> = {
      'Content-Type': 'application/json',
    };
    if (token) {
      HEADERS['Authorization'] = token;
    }
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

  function handleSequenceChange(sequenceId: string, newSequence: number[], isCustom: boolean = true) {
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [handleSequenceChange]
  );

  const setOeisToG = React.useCallback(
    (sequence: number[]) => {
      if (sequence && sequence.length > 0) {
        handleSequenceChange('g', sequence);
        setCurrentGSelection('custom');
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [handleSequenceChange]
  );

  function getDerivativeSequence(fSeq: number[]) {
    if (metaMode === 'exponential') {
      return fSeq.slice(1);
    }
    return fSeq.slice(1).map((elem, idx) => {
      return elem * (idx + 1);
    });
  }

  function getAssociatedSequence(fSeq: number[]) {
    const newGSequence = Array(fSeq.length).fill(0);
    newGSequence[0] = 1;
    return newGSequence;
  }

  function getBellSequence(gSeq: number[]) {
    return [0, ...gSeq];
  }

  function getTwoBellSequence(gSeq: number[]) {
    const gSquared = Array(gSeq.length).fill(0);
    for (let i = 0; i < gSquared.length; i++) {
      const array_1 = gSeq.slice(0, i + 1);
      const array_2 = gSeq.slice(0, i + 1).reverse();
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
      seqLength: number,
      gSeq: number[],
      fSeq: number[],
      modeVal: string,
      metaModeVal: string
    ) {
      const fSequenceSubmit = fSeq;
      const gSequenceSubmit = gSeq;
      const payload = {
        g: gSequenceSubmit.slice(0, seqLength),
        f: fSequenceSubmit.slice(0, seqLength),
        gSequenceId: currentGSelection,
        fSequenceId: currentFSelection,
        sequenceLength: seqLength,
        mode: modeVal,
        metaMode: metaModeVal,
      };

      const URL = isAuthenticated
        ? AUTH_ENDPOINT + 'queries'
        : ENDPOINT + 'queries';
      const HEADERS: Record<string, string> = isAuthenticated
        ? {
            'Content-Type': 'application/json',
            Authorization: token!,
          }
        : {
            'Content-Type': 'application/json',
            'x-api-key': API_KEY,
          };

      const request = new Request(URL, {
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
      const HEADERS: Record<string, string> = isAuthenticated
        ? {
            'Content-Type': 'application/json',
            Authorization: token!,
          }
        : {
            'Content-Type': 'application/json',
            'x-api-key': API_KEY,
          };
      const request = new Request(URL, {
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
        )[0]?.sequence;
        if (result) retrievedGSequence = result;
      }
      if (retrievedFSequenceId !== 'custom') {
        const found = sequences.filter((item) => item.id === retrievedFSequenceId)[0];
        if (found) {
          retrievedFSequence = [0, ...found.sequence];
        }
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
    if (typeof window === 'undefined') return;
    const searchParam = window.location.search;
    if (matrixId === '' && searchParam.length > 1) {
      setMatrixId(searchParam.slice(1));
      if (!matrix) {
        setShareMatrixId(searchParam.slice(1));
      }
    }
  }, []);

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
    const found = allSequences.filter(
      (item) => item.id === selectedSequence
    )[0];
    if (!found) return;
    const sequence = found.sequence;
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

  function tabFocus(_event: KeyboardEvent, bothShiftAndTabWerePressed: boolean) {
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
    const HEADERS = {
      'Content-Type': 'application/json',
      Authorization: token!,
    };
    const payload = { title: sequenceTitle, values: sequenceValues };
    const request = new Request(URL, {
      method: 'PUT',
      headers: HEADERS,
      body: JSON.stringify(payload),
    });
    await fetch(request);
  };

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
