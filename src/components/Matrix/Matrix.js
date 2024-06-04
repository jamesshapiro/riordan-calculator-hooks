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
  const matrices = {
    classic: {
      default: {
        id: 'riordan group elem',
        title: 'Riordan Group Element',
        leftMargin: '0',
      },
      inverse: {
        id: 'riordan group inverse',
        title: 'Riordan Group Inverse',
        leftMargin: '96px',
      },
      stieltjes: {
        id: 'stieltjes',
        title: 'Stieltjes/Production Matrix',
        leftMargin: '96px',
      },
    },
    exponential: {
      default: {
        id: 'exponential',
        title: 'Exponential Riordan Group Element',
        leftMargin: '0',
      },
      inverse: {
        id: 'riordan group inverse',
        title: 'Riordan Group Inverse',
        leftMargin: '96px',
      },
      stieltjes: {
        id: 'exponentialstieltjes',
        title: 'Stieltjes/Projection Matrix',
        leftMargin: '96px',
      },
    },
  };
  let displayMatrix = parsedMatrix[matrices[metaMode][variant]['id']];
  if (!displayMatrix) {
    return <></>;
  }
  let matrixTitle = matrices[metaMode][variant]['title'];
  const leftMargin = matrices[metaMode][variant]['leftMargin'];

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
  const numRows = displayMatrix.length;
  const numCols = displayMatrix[0].length;

  const zeroEV = displayMatrix.map((row) => {
    const newVector = Array.from({ length: row.length }, (_, i) => i);
    const unreducedProduct = row.map((elem, idx) => {
      return elem * newVector[idx];
    });
    return unreducedProduct.reduce(function (a, b) {
      return a + b;
    }, 0);
  });

  const oneEV = displayMatrix.map((row) => {
    const newVector = Array.from({ length: row.length }, (_, i) => i + 1);
    const unreducedProduct = row.map((elem, idx) => {
      return elem * newVector[idx];
    });
    return unreducedProduct.reduce(function (a, b) {
      return a + b;
    }, 0);
  });
  const rowSumsOEISQuery = (
    numCols < numRows ? rowSums.slice(0, -1) : rowSums
  ).join('%2C');
  const alternatingRowSumsOEISQuery = (
    numCols < numRows ? alternatingRowSums.slice(0, -1) : alternatingRowSums
  ).join('%2C');
  const zeroEVOEISQuery = (
    numCols < numRows ? zeroEV.slice(0, -1) : zeroEV
  ).join('%2C');
  const oneEVOEISQuery = (numCols < numRows ? oneEV.slice(0, -1) : oneEV).join(
    '%2C'
  );

  const userIsMatrixCreator = user === matrixCreator;
  let shareButton = userIsMatrixCreator ? (
    <StyledShareButton>Share</StyledShareButton>
  ) : null;
  shareButton = null;

  return (
    <Wrapper $leftmargin={leftMargin}>
      <h1>{matrixTitle}</h1>
      <MatrixTable>
        <tbody key='matrixbody'>
          <tr key='oeisrow'>
            {range(0, displayMatrix[0].length + 1).map((item, colIndex) => {
              const searchEntries = displayMatrix
                .map((row) => row[colIndex - 1])
                .slice(colIndex - 1);
              const searchQueryParam = searchEntries.join('%2C');
              return (
                <MatrixCell
                  style={{ paddingLeft: '15px' }}
                  $row={0}
                  $col={colIndex}
                  key={`0,${colIndex}`}
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
              $row={0}
              $col={displayMatrix[0].length}
              key={`0,${displayMatrix[0].length}`}
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
              $row={0}
              $col={displayMatrix[0].length + 1}
              key={`0,${displayMatrix[0].length + 1}`}
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
            <MatrixCell
              style={{ paddingLeft: '15px' }}
              $row={0}
              $col={displayMatrix[0].length + 2}
              key={`0,${displayMatrix[0].length + 2}`}
            >
              <TooltipWrapper
                message='OEIS Zero-Indexed Expected Value Lookup'
                side='top'
                sideOffset={5}
                arrowshiftX='-10px'
                arrowshiftY='0'
              >
                <a
                  target='_blank'
                  rel='noreferrer'
                  href={`https://oeis.org/search?q=${zeroEVOEISQuery}&language=english&go=Search`}
                >
                  {SearchSVG}
                </a>
              </TooltipWrapper>
            </MatrixCell>
            <MatrixCell
              style={{ paddingLeft: '15px' }}
              $row={0}
              $col={displayMatrix[0].length + 3}
              key={`0,${displayMatrix[0].length + 3}`}
            >
              <TooltipWrapper
                message='OEIS One-Indexed Expected Value Lookup'
                side='top'
                sideOffset={5}
                arrowshiftX='-10px'
                arrowshiftY='0'
              >
                <a
                  target='_blank'
                  rel='noreferrer'
                  href={`https://oeis.org/search?q=${oneEVOEISQuery}&language=english&go=Search`}
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
            const lastRowIdx = rowSums.length - 1;
            return (
              <tr key={`row${rowIndex}`}>
                <MatrixCell
                  style={{ paddingLeft: '15px' }}
                  $row={rowIndex}
                  $col={0}
                  key={`${rowIndex},0`}
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
                    <MatrixCell
                      $row={rowIndex + 1}
                      $col={colIndex + 1}
                      key={`${rowIndex},${colIndex + 1}`}
                    >
                      {num}
                    </MatrixCell>
                  );
                })}
                <RowSumsMatrixCell
                  key={`${rowIndex},${displayMatrix[0].length + 1}`}
                >
                  {rowIndex < lastRowIdx || numRows === numCols
                    ? rowSums[rowIndex]
                    : ''}
                </RowSumsMatrixCell>
                <AlternatingRowSumsMatrixCell
                  key={`${rowIndex},${displayMatrix[0].length + 2}`}
                >
                  {rowIndex < lastRowIdx || numRows === numCols
                    ? alternatingRowSums[rowIndex]
                    : ''}
                </AlternatingRowSumsMatrixCell>
                <ZeroEVMatrixCell
                  key={`${rowIndex},${displayMatrix[0].length + 3}`}
                >
                  {rowIndex < lastRowIdx || numRows === numCols
                    ? zeroEV[rowIndex]
                    : ''}
                </ZeroEVMatrixCell>
                <OneEVMatrixCell
                  key={`${rowIndex},${displayMatrix[0].length + 4}`}
                >
                  {rowIndex < lastRowIdx || numRows === numCols
                    ? oneEV[rowIndex]
                    : ''}
                </OneEVMatrixCell>
              </tr>
            );
          })}
        </tbody>
      </MatrixTable>
      {shareButton}
    </Wrapper>
  );
}

export default Matrix;

const Wrapper = styled.div`
  margin-top: 40px;
  margin-left: ${(p) => p.$leftmargin};
`;

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
    p.$col === 0 || p.$row === 0
      ? 'var(--select-td-background)'
      : p.$row > 0 && p.$col > p.$row
        ? 'var(--matrix-cell-background-color)'
        : 'black'};

  background-image: ${(p) =>
    p.$col === 0 || p.$row === 0
      ? 'revert'
      : p.$col > p.$row
        ? 'var(--box-gradient)'
        : 'revert'};
  color: ${(p) =>
    p.$row > 0 && p.$col > p.$row ? 'var(--number-box-font-color)' : 'white'};
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

const ZeroEVMatrixCell = styled(MatrixCell)`
  background-color: var(--matrix-cell-zero-ev-background-color);
  color: var(--alternating-rows-sums-font-color);
`;

const OneEVMatrixCell = styled(MatrixCell)`
  background-color: var(--matrix-cell-one-ev-background-color);
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
