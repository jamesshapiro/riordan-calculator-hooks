import React from 'react';

import styles from './SequenceEditorSelectTable.module.css';

const OPTIONS = [
  {
    id: 'default',
    name: 'Show/Hide Default Sequences',
  },
  {
    id: 'add',
    name: 'Add Custom Sequence',
  },
  {
    id: 'custom',
    name: 'Manage Custom Sequences',
  },
];

function SequenceEditorSelectTable({ selectedOption, setSelectedOption }) {
  function handleSelect(option) {
    setSelectedOption(option);
  }

  const check = (
    <svg
      className={styles.styledSvg}
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
      <path d='M20 6 9 17l-5-5' />
    </svg>
  );

  function getRuntimesTable() {
    return (
      <table className={styles.table}>
        <tbody className={styles.tBody}>
          {OPTIONS.map((option) => {
            return (
              <tr className={styles.tr}>
                <td className={styles.checkTd}>{selectedOption === option.id ? check : null}</td>
                <td className={styles.td}>
                  <button
                    className={styles.button}
                    id={option.id}
                    onClick={() => handleSelect(option.id)}
                  >
                    {option.name}
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    );
  }

  const table = getRuntimesTable();

  return table;
}

export default SequenceEditorSelectTable;
