import React from 'react';

import Header from '../Header';

import Sequence from '../Sequence';
import SequenceControlPanel from '../SequenceControlPanel';
import { LayoutGroup } from 'framer-motion';

import ModeComboBox from '../ModeComboBox';
import SubmitButton from '../SubmitButton';
import Matrix from '../Matrix';
import NavBar from '../NavBar';
import WindowControls from '../WindowControls';
import MatrixHeader from '../MatrixHeader';
import ShareDialog from '../ShareDialog';
import StarSequence from '../StarSequence';
import OEISInput from '../OEISInput/OEISInput';
import OEISSequenceDisplay from '../OEISSequenceDisplay/OEISSequenceDisplay';
import HSequence from '../HSequence';

import { DataContext } from '../DataProvider';
import styles from './Home.module.css';

function Home() {
  const {
    fetchOeisSequence,
    oeisSequence,
    oeisSequenceId,
    isOeisLoading,
    oeisError,
    setOeisToF,
    setOeisToG,
    setOeisToH,
  } = React.useContext(DataContext);

  return (
    <div className={styles.flexColumnWrapper}>
      <NavBar />
      <div className={styles.headerDiv}>
        <Header isHome={true} />
      </div>
      <div className={styles.leftDiv}>
        <ModeComboBox />
      </div>
      <div className={styles.oeisContainer}>
        <OEISInput
          onFetchSequence={fetchOeisSequence}
          isLoading={isOeisLoading}
        />
        {oeisError && <div className={styles.errorMessage}>{oeisError}</div>}
        <OEISSequenceDisplay
          sequence={oeisSequence}
          sequenceId={oeisSequenceId}
          onSetToF={setOeisToF}
          onSetToG={setOeisToG}
          onSetToH={setOeisToH}
          isLoading={isOeisLoading}
        />
      </div>
      <MatrixHeader />
      <ShareDialog />
      <div className={styles.flexRowWrapper}>
        <SequenceControlPanel />
        <LayoutGroup>
          <table className={styles.tableWrapper}>
            <tbody>
              <WindowControls />
              <Sequence sequenceId={'g'} />
              <Sequence sequenceId={'f'} />
            </tbody>
          </table>
        </LayoutGroup>
      </div>
      <div className={styles.flexRowWrapper}>
        <div className={styles.leftDiv}>
          <SubmitButton />
        </div>
        <div className={styles.centerDiv}>
          <HSequence />
          <Matrix variant='default' />
        </div>
      </div>
      <div className={styles.flexRowWrapper}>
        <div className={styles.leftDiv}>{/* <SubmitButton /> */}</div>
        <div className={styles.centerDiv}>
          <Matrix variant='inverse' />
        </div>
      </div>
      <div className={styles.flexRowWrapper}>
        <div className={styles.leftDiv}>{/* <SubmitButton /> */}</div>
        <div className={styles.centerDiv}>
          <Matrix variant='stieltjes' />
        </div>
      </div>
      <div className={styles.flexRowWrapper}>
        <div className={styles.leftDiv}>{/* <SubmitButton /> */}</div>
        <div className={styles.centerDiv}>
          <StarSequence variant='a' />
        </div>
      </div>
      <div className={styles.flexRowWrapper}>
        <div className={styles.leftDiv}>{/* <SubmitButton /> */}</div>
        <div className={styles.centerDiv}>
          <StarSequence variant='b' />
        </div>
      </div>
      <div className={styles.flexRowWrapper}>
        <div className={styles.leftDiv}>{/* <SubmitButton /> */}</div>
        <div className={styles.centerDiv}>
          <StarSequence variant='z' />
        </div>
      </div>
    </div>
  );
}

export default Home;
