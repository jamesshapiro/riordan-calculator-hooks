import React from 'react';
import { DataContext } from '../DataProvider';
import styles from './SubmitButton.module.css';
import { SpinnerInfinity } from 'spinners-react';


function SubmitButton() {
  const { handleCompute, computeWasRequested, matrixWasFetched, engine, setEngine, discoveryMode } =
    React.useContext(DataContext);

  const buttonContents =
    computeWasRequested && !matrixWasFetched ? (
      <SpinnerInfinity
        size={40}
        thickness={100}
        speed={100}
        color='var(--submit-button-border)'
        secondaryColor='white'
      />
    ) : (
      'Compute'
    );

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
      <button
        className={styles.styledSubmitButton}
        onClick={() => {
          handleCompute();
        }}
      >
        {buttonContents}
      </button>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 4,
          marginTop: 55,
          fontSize: 11,
          fontFamily: 'monospace',
          userSelect: 'none',
        }}
      >
        {['sage', 'cpp', 'cf'].map((eng) => {
          const label = eng === 'sage' ? 'Sage' : eng === 'cpp' ? 'C++' : discoveryMode && eng === 'cf' ? 'CF (Discovery)' : 'CF';
          const isActive = discoveryMode ? eng === 'cf' : engine === eng;
          return (
            <span
              key={eng}
              onClick={() => setEngine(eng)}
              style={{
                color: isActive ? '#fff' : '#888',
                fontWeight: isActive ? 700 : 400,
                cursor: 'pointer',
                padding: '2px 6px',
                borderRadius: 4,
                backgroundColor: isActive
                  ? eng === 'sage' ? 'hsl(270,60%,50%)' : eng === 'cpp' ? 'hsl(240,70%,55%)' : 'hsl(25,90%,50%)'
                  : 'transparent',
                transition: 'all 0.2s',
              }}
            >
              {label}
            </span>
          );
        })}
      </div>
    </div>
  );
}

export default SubmitButton;
