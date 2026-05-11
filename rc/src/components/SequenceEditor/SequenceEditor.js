import React from 'react';

import SequenceEditorSequence from '../SequenceEditorSequence';

import { DataContext } from '../DataProvider';
import { UserContext } from '../UserProvider';
import { sequences } from '../../data';

import styles from './SequenceEditor.module.css';
import NavBar from '../NavBar';
import Header from '../Header';
import SequenceEditorSelectTable from '../SequenceEditorSelectTable';
import SequenceEditorWindowControls from '../SequenceEditorWindowControls';
import SequenceEditorSubmitButton from '../SequenceEditorSubmitButton';
import SequenceEditorConfirmDeleteSequenceDialog from '../SequenceEditorConfirmDeleteSequenceDialog';

const AUTH_ENDPOINT = process.env.NEXT_PUBLIC_MATRIX_URL_AUTH || '';

function SequenceEditor() {
  const {
    userSequences,
    userDefaultHiddenSequences,
    setUserDefaultHiddenSequences,
    token,
  } = React.useContext(UserContext);
  const { customSequenceTitle, setCustomSequenceTitle, setCustomSequence } =
    React.useContext(DataContext);
  const [selectedOption, setSelectedOption] = React.useState('default');
  const [oeisId, setOeisId] = React.useState('');

  const updateDefaults = async (sequenceId, displayOption) => {
    const URL =
      AUTH_ENDPOINT + `preset?sequence=${sequenceId}&display=${displayOption}`;
    const HEADERS = {
      'Content-Type': 'application/json',
      Authorization: token,
    };
    const request = new Request(URL, {
      method: 'PUT',
      headers: HEADERS,
      timeout: 100000,
    });
    fetch(request);
  };

  const fetchOEIS = async (oeisId) => {
    const URL = AUTH_ENDPOINT + `oeis?oeis_id=A${oeisId}`;
    const HEADERS = {
      'Content-Type': 'application/json',
      Authorization: token,
    };
    const request = new Request(URL, {
      method: 'GET',
      headers: HEADERS,
      timeout: 100000,
    });
    const response = await fetch(request);
    const json = await response.json();
    console.log(json.sequence);
    setCustomSequence(json.sequence.slice(0, 15));
    setCustomSequenceTitle((oldTitle) => {
      return `${oldTitle}${oldTitle !== '' ? ' ' : ''}(A${oeisId})`;
    });
  };

  function getSequenceDisplay(sequenceTerms) {
    return [...sequenceTerms, '...'].map((term, index) => {
      if (term.toString().length < 6) {
        return (
          <div className={styles.miniNumberBoxWrapper} key={`term-${index}`}>
            <div className={styles.innerContainer}>
              <p className={styles.innerElement}>{term}</p>
            </div>
          </div>
        );
      } else {
        return null;
      }
    });
  }
  const EyeOffSVG = (
    <svg
      className={`${styles.styledSVG} lucide lucide-eye-off`}
      xmlns='http://www.w3.org/2000/svg'
      width='24'
      height='24'
      viewBox='0 0 24 24'
      fill='none'
      stroke='currentColor'
      strokeWidth='2'
      strokeLinecap='round'
      strokeLinejoin='round'
    >
      <path d='M9.88 9.88a3 3 0 1 0 4.24 4.24' />
      <path d='M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68' />
      <path d='M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61' />
      <line x1='2' x2='22' y1='2' y2='22' />
    </svg>
  );

  const EyeOnSVG = (
    <svg
      className={`${styles.styledSVG} lucide lucide-eye`}
      xmlns='http://www.w3.org/2000/svg'
      width='24'
      height='24'
      viewBox='0 0 24 24'
      fill='none'
      stroke='currentColor'
      strokeWidth='2'
      strokeLinecap='round'
      strokeLinejoin='round'
    >
      <path d='M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z' />
      <circle cx='12' cy='12' r='3' />
    </svg>
  );

  const presetTable = (
    <table className={styles.table}>
      <thead>
        <tr>
          <td className={styles.tdWrapper}>Title</td>
          <td className={styles.tdWrapper}>Sequence</td>
          <td className={styles.tdWrapper}>Hide/Show</td>
        </tr>
      </thead>
      <tbody>
        {sequences.map((sequence, index) => {
          const sequenceName = sequence.name;
          const sequenceId = sequence.id;
          const sequenceSequence = sequence.sequence;
          const displayTerms = getSequenceDisplay(
            sequenceSequence.slice(0, 15)
          );
          const hideIconPredicate =
            userDefaultHiddenSequences &&
            Object.keys(userDefaultHiddenSequences).length > 0 &&
            userDefaultHiddenSequences.includes(sequenceId);
          const icon = hideIconPredicate ? EyeOffSVG : EyeOnSVG;
          const hideShowOption = (
            <div
              className={styles.preview}
              onClick={() => {
                if (
                  userDefaultHiddenSequences &&
                  Object.keys(userDefaultHiddenSequences).length > 0 &&
                  userDefaultHiddenSequences.includes(sequenceId)
                ) {
                  updateDefaults(sequenceId, 'true');
                  setUserDefaultHiddenSequences((oldValue) => {
                    const newValue = oldValue.filter(
                      (item) => item !== sequenceId
                    );
                    return newValue;
                  });
                } else {
                  updateDefaults(sequenceId, 'false');
                  setUserDefaultHiddenSequences((oldValue) => {
                    console.log(`oldValue=${JSON.stringify(oldValue)}`);
                    var newValue = [];
                    if (
                      oldValue &&
                      Object.keys(userDefaultHiddenSequences).length > 0
                    ) {
                      newValue = [...oldValue];
                    }
                    newValue.push(sequenceId);
                    return newValue;
                  });
                }
              }}
            >
              {icon}
            </div>
          );
          return (
            <tr key={index}>
              <td className={styles.tdWrapper}>{sequenceName}</td>
              <td className={styles.tdWrapper}>{displayTerms}</td>
              <td className={styles.tdWrapper}>
                {sequence.id !== 'catalan' && hideShowOption}
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );

  const customTable = (
    <table className={styles.table}>
      <thead>
        <tr>
          <td className={styles.tdWrapper}>Title</td>
          <td className={styles.tdWrapper}>Sequence</td>
          <td className={styles.tdWrapper}>Delete?</td>
        </tr>
      </thead>
      <tbody>
        {userSequences.map((sequence, index) => {
          const sequenceName = sequence.name;
          const sequenceId = sequence.id;
          const sequenceSequence = sequence.sequence;
          const displayTerms = getSequenceDisplay(
            sequenceSequence.slice(0, 15)
          );
          return (
            <tr key={index}>
              <td className={styles.tdWrapper}>{sequenceName}</td>
              <td className={styles.tdWrapper}>{displayTerms}</td>
              <td className={styles.tdWrapper}>
                <SequenceEditorConfirmDeleteSequenceDialog id={sequenceId} />
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );

  const titleHeader = (
    <form
      onSubmit={(event) => {
        event.preventDefault();
      }}
    >
      <span className={styles.aspan}>Title: </span>
      <input
        className={styles.titleInput}
        id='title-field'
        value={customSequenceTitle}
        placeholder='Give Your Sequence A Title!'
        onChange={(event) => {
          setCustomSequenceTitle(event.target.value);
        }}
      />
    </form>
  );

  const oeisImport = (
    <form
      onSubmit={(event) => {
        event.preventDefault();
        if (oeisId.length !== 6) {
          window.alert('OEIS ID must be exactly six digits long');
        }
        fetchOEIS(oeisId);
        setOeisId('');
      }}
    >
      <span className={styles.aspan}>A</span>
      <input
        className={styles.titleInput}
        id='oeis-field'
        value={oeisId}
        placeholder='123456 (Optional OEIS ID)'
        onChange={(event) => {
          if (event.target.value !== '' && !/^\d+$/.test(event.target.value)) {
            return;
          }
          if (event.target.value.length > 6) {
            return;
          }
          setOeisId(event.target.value);
        }}
      />
      <button className={styles.styledSubmitButton} type='submit'>Import</button>
    </form>
  );

  const customSequence = (
    <>
      {titleHeader}
      {oeisImport}
      <table className={styles.tableWrapper}>
        <tbody>
          <SequenceEditorWindowControls />
          <SequenceEditorSequence />
        </tbody>
      </table>

      <SequenceEditorSubmitButton />
    </>
  );

  return (
    <div className={styles.flexColumnWrapper}>
      <NavBar />
      <div className={styles.headerDiv}>
        <Header />
      </div>
      <div className={styles.verticalSpace} />
      <SequenceEditorSelectTable
        selectedOption={selectedOption}
        setSelectedOption={setSelectedOption}
      />
      {selectedOption === 'default' && presetTable}
      {selectedOption === 'add' && customSequence}
      {selectedOption === 'custom' && customTable}
    </div>
  );
}

export default SequenceEditor;
