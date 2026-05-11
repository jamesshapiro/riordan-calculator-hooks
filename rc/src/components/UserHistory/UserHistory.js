import React from 'react';

import styles from './UserHistory.module.css';
import Link from 'next/link';
import { UserContext } from '../UserProvider';
import ConfirmDeleteQueryDialog from '../ConfirmDeleteQueryDialog';

import TooltipWrapper from '../TooltipWrapper';

import { formatDate } from '../../utils';

function UserHistory() {
  const { userQueries, deleteQuery } = React.useContext(UserContext);
  if (userQueries.length < 1) {
    return <></>;
  }

  function getSequenceDisplay(sequenceTerms) {
    return [...sequenceTerms, '...'].map((term, index) => {
      return (
        <div className={styles.miniNumberBoxWrapper} key={`term-${index}`}>
          <div className={styles.innerContainer}>
            <p className={styles.innerElement}>{term}</p>
          </div>
        </div>
      );
    });
  }

  const linkSVG24 = (
    <svg
      xmlns='http://www.w3.org/2000/svg'
      width='24'
      height='24'
      viewBox='0 0 24 24'
      fill='none'
      stroke='currentColor'
      strokeWidth='2'
      strokeLinecap='round'
      strokeLinejoin='round'
      className={`lucide lucide-link ${styles.styledSvg}`}
    >
      <path d='M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71' />
      <path d='M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71' />
    </svg>
  );

  const SearchSVG = (
    <svg
      xmlns='http://www.w3.org/2000/svg'
      width='24'
      height='24'
      viewBox='0 0 24 24'
      fill='none'
      stroke='currentColor'
      strokeWidth='2'
      strokeLinecap='round'
      strokeLinejoin='round'
      className={`lucide lucide-eye ${styles.styledSvg}`}
    >
      <path d='M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z' />
      <circle cx='12' cy='12' r='3' />
    </svg>
  );

  function getMatrixCellStyle(row, col) {
    const style = {};
    if (col === 0 || row === 0) {
      style.backgroundColor = 'var(--select-td-background)';
      style.backgroundImage = 'revert';
    } else if (row > 0 && col > row) {
      style.backgroundColor = 'var(--matrix-cell-background-color)';
      style.backgroundImage = 'var(--box-gradient)';
      style.color = 'var(--number-box-font-color)';
    } else {
      style.backgroundColor = 'black';
      style.backgroundImage = 'revert';
      style.color = 'white';
    }
    return style;
  }

  return (
    <table className={styles.wrapper}>
      <thead>
        <tr>
          <td className={styles.tdWrapper}>Permalink</td>
          <td className={styles.tdWrapper}>Title</td>
          <td className={styles.tdWrapper}>Date</td>
          <td className={styles.tdWrapper}>G</td>
          <td className={styles.tdWrapper}>F</td>
          <td className={styles.tdWrapper}>Preview</td>
          <td className={styles.tdWrapper}>Delete</td>
        </tr>
      </thead>
      <tbody>
        {userQueries.map((query, index) => {
          const displayMatrix = JSON.parse(query['MATRIX_DATA']['S'])[
            'riordan group elem'
          ];

          const matrixElem = (
            <table className={styles.matrixTable}>
              <tbody key='matrixbody'>
                {displayMatrix.map((row, rowIndex) => {
                  return (
                    <tr key={`row${rowIndex}`}>
                      {row.map((num, colIndex) => {
                        return (
                          <td
                            className={styles.matrixCell}
                            style={getMatrixCellStyle(rowIndex + 1, colIndex + 1)}
                            key={`${rowIndex},${colIndex + 1}`}
                          >
                            {num}
                          </td>
                        );
                      })}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          );
          const previewElem = (
            <TooltipWrapper
              message={matrixElem}
              side='top'
              sideOffset={5}
              alignOffset='-500px'
              arrowshiftX='0'
              arrowshiftY='0'
              omitInfo={true}
            >
              {SearchSVG}
            </TooltipWrapper>
          );

          const matrixTitle = query.TITLE ? query.TITLE.S : '(none)';
          const displayGTerms = getSequenceDisplay(
            JSON.parse(query.G_SEQUENCE.S).slice(0, 10)
          );
          const displayFTerms = getSequenceDisplay(
            JSON.parse(query.F_SEQUENCE.S).slice(0, 10)
          );
          const matrixId = query.MATRIX_SHAREID.S;
          return (
            <tr key={index}>
              <td className={styles.tdWrapper}>
                <Link className={styles.permalink} href={`/?${matrixId}`} passHref legacyBehavior={false}>{linkSVG24}</Link>
              </td>
              <td className={styles.tdWrapper}>{matrixTitle}</td>
              <td className={styles.tdWrapper}>{formatDate(query.CREATED_AT.S)}</td>
              <td className={styles.tdWrapper}>{displayGTerms}</td>
              <td className={styles.tdWrapper}>{displayFTerms}</td>
              <td className={styles.tdWrapper}>
                <div className={styles.preview}>{previewElem}</div>
              </td>
              <td className={styles.tdWrapper}>
                <ConfirmDeleteQueryDialog
                  matrixId={matrixId}
                  deleteQuery={deleteQuery}
                />
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}

export default UserHistory;
