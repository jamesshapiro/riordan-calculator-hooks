import React from 'react';
import { DataContext } from '../DataProvider';
import { UserContext } from '../UserProvider';
import { range } from '../../utils';

import styled from 'styled-components';

import TooltipWrapper from '../TooltipWrapper';

const StyledSVG = styled.svg`
  &:visited {
    --link-color: : var(--number-box-font-color);
  }
  display: block;
  max-width: 100%;
`;

const SearchSVG = (
  <StyledSVG
    xmlns='http://www.w3.org/2000/svg'
    width='24'
    height='24'
    viewBox='0 0 24 24'
    fill='none'
    stroke='var(--number-box-font-color)'
    strokeWidth='2'
    strokeLinecap='round'
    strokeLinejoin='round'
    className='lucide lucide-search'
  >
    <circle cx='11' cy='11' r='8' />
    <path d='m21 21-4.3-4.3' />
  </StyledSVG>
);

function Matrix({ variant }) {
  const { matrix, matrixCreator, metaMode } = React.useContext(DataContext);
  const { isAuthenticated, user, token } = React.useContext(UserContext);
  if (!matrix) {
    return <></>;
  }
  const parsedMatrix = JSON.parse(matrix);
  console.log(parsedMatrix);
  const matrices = {
    classic: {
      default: { id: 'riordan group elem', title: 'Riordan Group Element' },
      stieltjes: { id: 'stieltjes', title: 'Stieltjes/Projection Matrix' },
    },
    exponential: {
      default: {
        id: 'exponential',
        title: 'Exponential Riordan Group Element',
      },
      stieltjes: {
        id: 'exponentialstieltjes',
        title: 'Stieltjes/Projection Matrix',
      },
    },
  };
  let displayMatrix = parsedMatrix[matrices[metaMode][variant]['id']];
  let matrixTitle = matrices[metaMode][variant]['title'];

  const rowSums = displayMatrix.map((row) => {
    return row.reduce(function (a, b) {
      return a + b;
    }, 0);
  });

  const alternatingRowSums = displayMatrix.map((row) => {
    const newVector = new Array(row.length).fill(1);
    for (let idx in newVector) {
      if (idx % 2 === 1) {
        newVector[idx] = -1;
      }
    }
    const unreducedProduct = row.map((elem, idx) => {
      return elem * newVector[idx];
    });
    return unreducedProduct.reduce(function (a, b) {
      return a + b;
    }, 0);
  });
  const rowSumsOEISQuery = rowSums.join('%2C');
  const alternatingRowSumsOEISQuery = alternatingRowSums.join('%2C');
  const userIsMatrixCreator = user === matrixCreator;
  let shareButton = userIsMatrixCreator ? (
    <StyledShareButton>Share</StyledShareButton>
  ) : null;
  shareButton = null;

  return (
    <>
      <h1>{matrixTitle}</h1>
      <MatrixTable>
        <tbody>
          <tr>
            {range(0, displayMatrix[0].length + 1).map((item, colIndex) => {
              const searchEntries = displayMatrix
                .map((row) => row[colIndex - 1])
                .slice(colIndex - 1);
              const searchQueryParam = searchEntries.join('%2C');
              return (
                <MatrixCell
                  style={{ paddingLeft: '15px' }}
                  row={0}
                  col={colIndex}
                >
                  <TooltipWrapper
                    message='OEIS Column Lookup'
                    side='top'
                    sideOffset={5}
                    arrowshiftX='-10px'
                    arrowshiftY='0'
                  >
                    <a
                      target='_blank'
                      rel='noreferrer'
                      href={`https://oeis.org/search?q=${searchQueryParam}&language=english&go=Search`}
                    >
                      {colIndex > 0 ? SearchSVG : ''}
                    </a>
                  </TooltipWrapper>
                </MatrixCell>
              );
            })}
            <MatrixCell
              style={{ paddingLeft: '15px' }}
              row={0}
              col={displayMatrix[0].length}
            >
              <TooltipWrapper
                message='OEIS Row Sums Lookup'
                side='top'
                sideOffset={5}
                arrowshiftX='-10px'
                arrowshiftY='0'
              >
                <a
                  target='_blank'
                  rel='noreferrer'
                  href={`https://oeis.org/search?q=${rowSumsOEISQuery}&language=english&go=Search`}
                >
                  {SearchSVG}
                </a>
              </TooltipWrapper>
            </MatrixCell>
            <MatrixCell
              style={{ paddingLeft: '15px' }}
              row={0}
              col={displayMatrix[0].length + 1}
            >
              <TooltipWrapper
                message='OEIS Alternating Row Sums Lookup'
                side='top'
                sideOffset={5}
                arrowshiftX='-10px'
                arrowshiftY='0'
              >
                <a
                  target='_blank'
                  rel='noreferrer'
                  href={`https://oeis.org/search?q=${alternatingRowSumsOEISQuery}&language=english&go=Search`}
                >
                  {SearchSVG}
                </a>
              </TooltipWrapper>
            </MatrixCell>
          </tr>
          {displayMatrix.map((row, rowIndex) => {
            const searchEntries = displayMatrix[rowIndex].slice(
              0,
              rowIndex + 1
            );
            const searchQueryParam = searchEntries.join('%2C');
            return (
              <tr>
                <MatrixCell
                  style={{ paddingLeft: '15px' }}
                  row={rowIndex}
                  col={0}
                >
                  <TooltipWrapper
                    message='OEIS Row Lookup'
                    side='left'
                    sideOffset={5}
                    arrowshiftX='0'
                    arrowshiftY='0'
                  >
                    <a
                      target='_blank'
                      rel='noreferrer'
                      href={`https://oeis.org/search?q=${searchQueryParam}&language=english&go=Search`}
                    >
                      {SearchSVG}
                    </a>
                  </TooltipWrapper>
                </MatrixCell>
                {row.map((num, colIndex) => {
                  return (
                    <MatrixCell row={rowIndex + 1} col={colIndex + 1}>
                      {num}
                    </MatrixCell>
                  );
                })}
                <RowSumsMatrixCell>{rowSums[rowIndex]}</RowSumsMatrixCell>
                <AlternatingRowSumsMatrixCell>
                  {alternatingRowSums[rowIndex]}
                </AlternatingRowSumsMatrixCell>
              </tr>
            );
          })}
        </tbody>
      </MatrixTable>
      {shareButton}
    </>
  );
}

export default Matrix;

const MatrixTable = styled.table`
  margin-left: 100px;
  margin-top: 20px;
  border-spacing: 0px;
  border-collapse: collapse;
`;

const MatrixRow = styled.tr``;

const MatrixCell = styled.td`
  border: 1px solid var(--number-box-border-color);
  min-width: 60px;
  height: 50px;
  text-align: center;
  background-color: ${(p) =>
    p.col === 0 || p.row === 0
      ? 'var(--select-td-background)'
      : p.row > 0 && p.col > p.row
        ? 'var(--matrix-cell-background-color)'
        : 'black'};

  background-image: ${(p) =>
    p.col === 0 || p.row === 0
      ? 'revert'
      : p.col > p.row
        ? 'var(--box-gradient)'
        : 'revert'};
  color: ${(p) =>
    p.row > 0 && p.col > p.row ? 'var(--number-box-font-color)' : 'white'};
`;

const RowSumsMatrixCell = styled(MatrixCell)`
  background-color: var(--matrix-cell-row-sums-background-color);
  background-image: var(--row-sums-box-gradient);
  color: var(--rows-sums-font-color);
`;

const AlternatingRowSumsMatrixCell = styled(MatrixCell)`
  background-color: var(--matrix-cell-alternating-row-sums-background-color);
  background-image: var(--alternating-row-sums-box-gradient);
  color: var(--alternating-rows-sums-font-color);
`;

const StyledShareButton = styled.button`
  z-index: 10000;
  margin-top: 55px;
  margin-left: 10px;
  width: 65px;
  text-align: center;
  /* width: fit-content; */
  height: 19px;
  border: 1px solid var(--submit-button-border);
  padding: 10px;
  border-radius: var(--number-box-border-radius);
  color: white;
  background-color: var(--submit-button-background);
  &:hover {
    background-image: revert;
    background-color: var(--hover-button-color);
    color: white;
  }
  &:active {
    background-color: var(--active-button-color);
    color: white;
  }
`;
