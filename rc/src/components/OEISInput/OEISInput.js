import React, { useState } from 'react';
import styles from './OEISInput.module.css';

const OEISInput = ({ onFetchSequence, isLoading }) => {
  const [inputValue, setInputValue] = useState('');
  const [error, setError] = useState('');

  const handleInputChange = (e) => {
    const value = e.target.value;
    setInputValue(value);
    setError('');

    if (value && !/^\d{1,6}$/.test(value)) {
      setError('Please enter up to 6 digits');
    }
  };

  const handleFetch = () => {
    if (!/^\d{1,6}$/.test(inputValue)) {
      setError('Please enter up to 6 digits');
      return;
    }

    if (inputValue.length < 6) {
      setError('Please enter exactly 6 digits (e.g., 000108)');
      return;
    }

    const oeisId = `A${inputValue}`;
    onFetchSequence(oeisId);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleFetch();
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.inputGroup}>
        <span className={styles.label}>A</span>
        <input
          className={styles.input}
          type='text'
          value={inputValue}
          onChange={handleInputChange}
          onKeyPress={handleKeyPress}
          placeholder='Ex: 000108'
          maxLength={6}
          disabled={isLoading}
        />
        <button
          className={styles.fetchButton}
          onClick={handleFetch}
          disabled={isLoading || !inputValue || inputValue.length < 6 || error}
        >
          {isLoading ? 'Fetching...' : 'Fetch from OEIS'}
        </button>
      </div>
      {error && <div className={styles.errorMessage}>{error}</div>}
    </div>
  );
};

export default OEISInput;
