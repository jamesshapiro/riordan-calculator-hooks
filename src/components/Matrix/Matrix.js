import React from 'react';
import { DataContext } from '../DataProvider';
import { UserContext } from '../UserProvider';
import { range } from '../../utils';

import styled from 'styled-components';

import TooltipWrapper from '../TooltipWrapper';

function Matrix({ variant }) {
  const { matrix, matrixCreator, metaMode } = React.useContext(DataContext);
  const { user } = React.useContext(UserContext);
  const [isCopied, setIsCopied] = React.useState(false);

  const handleCopy = (text) => {
    navigator.clipboard.writeText(text);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 1500);
  };

  // function arrayToLatexMatrix(array) {
  //   let latex = '\\begin{bmatrix}\n';
  //   array.forEach((row) => {
  //     latex += row.join(' & ') + ' \\\\\n';
  //   });
  //   latex += '\\end{bmatrix}';
  //   return `\\[\n${latex}\n\\]`;
  // }

  function arrayToLatexMatrix(array) {
    const numColumns = array[0].length; // Number of columns based on the first row
    let latex = '\\begin{bmatrix}\n';

    array.forEach((row) => {
      if (row.length !== numColumns) {
        throw new Error('All rows must have the same number of columns');
      }
      latex += row.join(' & ') + ' \\\\ \n'; // Correct: Join with ' & ' and then add '\\'
    });

    latex += '\\end{bmatrix}';

    return `\\[\n${latex}\n\\]`;
  }

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

  const lowerTriangularEntries = [];
  let entryCount = 0; // Counter to keep track of the number of entries added

  for (let i = 0; i < numRows; i++) {
    for (let j = 0; j <= i; j++) {
      if (entryCount >= 21) {
        // Check if 21 entries have already been added
        break; // Break the inner loop if 21 entries are reached
      }
      lowerTriangularEntries.push(displayMatrix[i][j]);
      entryCount++; // Increment the counter after adding an entry
    }
    if (entryCount >= 21) {
      // Check again to break the outer loop if necessary
      break;
    }
  }

  const lowerTriangularOEISQuery = lowerTriangularEntries.join('%2C');

  const getAntiDiagonalSum = (matrix, row, col, alternating = false) => {
    let sum = 0;
    let value = alternating ? -1 : 1;
    let sign = 1;
    while (row >= 0 && col < matrix[0].length) {
      sum += matrix[row][col] * sign;
      row--;
      col++;
      sign = sign * value;
    }
    return sum;
  };
  const antiDiagonalSums = displayMatrix.map((_, rowIndex) => {
    return getAntiDiagonalSum(displayMatrix, rowIndex, 0);
  });

  const alternatingAntiDiagonalSums = displayMatrix.map((_, rowIndex) => {
    return getAntiDiagonalSum(displayMatrix, rowIndex, 0, true);
  });

  const antiDiagonalSumsOEISQuery = antiDiagonalSums
    .slice(0, numRows)
    .join('%2C');

  const alternatingAntiDiagonalSumsOEISQuery = alternatingAntiDiagonalSums
    .slice(0, numRows)
    .join('%2C');

  const userIsMatrixCreator = user === matrixCreator;
  let shareButton = userIsMatrixCreator ? (
    <StyledShareButton>Share</StyledShareButton>
  ) : null;
  shareButton = null;

  const matrixLaTeX = arrayToLatexMatrix(displayMatrix);

  return (
    <Wrapper $leftmargin={leftMargin}>
      <h1>
        {matrixTitle}{' '}
        {isCopied ? (
          <CopyCelebration> {LaTeXSVG} Copied to Clipboard! 🎉</CopyCelebration>
        ) : (
          <LaTeXButton onClick={() => handleCopy(matrixLaTeX)}>
            {LaTeXSVG}
          </LaTeXButton>
        )}
      </h1>
      <MatrixTable>
        <tbody key='matrixbody'>
          <tr key='oeisrow'>
            <MatrixCell
              style={{ paddingLeft: '15px' }}
              $row={0}
              $col={0}
              key={`0,0`}
            >
              <TooltipWrapper
                message='OEIS Lower Triangular Lookup'
                side='top'
                sideOffset={5}
                arrowshiftX='-30px' // Adjust arrow position
                arrowshiftY='0'
              >
                <a
                  target='_blank'
                  rel='noreferrer'
                  href={`https://oeis.org/search?q=${lowerTriangularOEISQuery}&language=english&go=Search`}
                >
                  {SearchSVG}
                </a>
              </TooltipWrapper>
            </MatrixCell>
            {range(1, displayMatrix[0].length + 1).map((item, colIndex) => {
              const searchEntries = displayMatrix
                .map((row) => row[colIndex])
                .slice(colIndex);
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
                      {SearchSVG}
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
            <MatrixCell
              style={{ paddingLeft: '15px' }}
              $row={0}
              $col={displayMatrix[0].length + 4}
              key={`0,${displayMatrix[0].length + 4}`}
            >
              <TooltipWrapper
                message='OEIS Anti-Diagonal Sums Lookup'
                side='top'
                sideOffset={5}
                arrowshiftX='-10px'
                arrowshiftY='0'
              >
                <a
                  target='_blank'
                  rel='noreferrer'
                  href={`https://oeis.org/search?q=${antiDiagonalSumsOEISQuery}&language=english&go=Search`}
                >
                  {SearchSVG}
                </a>
              </TooltipWrapper>
            </MatrixCell>
            <MatrixCell
              style={{ paddingLeft: '15px' }}
              $row={0}
              $col={displayMatrix[0].length + 5}
              key={`0,${displayMatrix[0].length + 5}`}
            >
              <TooltipWrapper
                message='OEIS Alternating Anti-Diagonal Sums Lookup'
                side='top'
                sideOffset={5}
                arrowshiftX='-10px'
                arrowshiftY='0'
              >
                <a
                  target='_blank'
                  rel='noreferrer'
                  href={`https://oeis.org/search?q=${alternatingAntiDiagonalSumsOEISQuery}&language=english&go=Search`}
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

            console.log(
              `alternatingAntiDiagonalSums=${JSON.stringify(alternatingAntiDiagonalSums)}`
            );
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
                <AntiDiagonalSumsMatrixCell
                  key={`${rowIndex},${displayMatrix[0].length + 5}`}
                >
                  {antiDiagonalSums[rowIndex]}
                </AntiDiagonalSumsMatrixCell>
                <AlternatingAntiDiagonalSumsMatrixCell
                  key={`${rowIndex},${displayMatrix[0].length + 6}`}
                >
                  {alternatingAntiDiagonalSums[rowIndex]}
                </AlternatingAntiDiagonalSumsMatrixCell>
              </tr>
            );
          })}
        </tbody>
      </MatrixTable>
      {/* {shareButton} */}
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

const LaTeXButton = styled.button`
  border: 1px solid black;
  background-color: white;
`;

const LaTeXSVG = (
  <svg
    width='64px'
    height='48px'
    viewBox='0 0 64 48'
    fill='none'
    xmlns='http://www.w3.org/2000/svg'
  >
    <path
      d='M18.525 31.482h-.482c-.192 1.966-.462 4.357-3.855 4.357h-1.562c-.905 0-.944-.136-.944-.772V24.831c0-.655 0-.925 1.812-.925h.636v-.578c-.694.058-2.429.058-3.22.058-.751 0-2.255 0-2.91-.058v.578h.443c1.485 0 1.523.212 1.523.906v10.12c0 .694-.038.907-1.523.907H8v.597h10.005l.52-4.954z'
      fill='#000000'
    />
    <path
      d='M18.198 23.308c-.078-.23-.116-.308-.367-.308-.25 0-.308.077-.385.308l-3.104 7.866c-.135.327-.366.925-1.561.925v.482h2.988v-.482c-.598 0-.964-.27-.964-.656 0-.096.02-.135.058-.27l.655-1.657h3.817l.771 1.966a.65.65 0 0 1 .077.231c0 .386-.732.386-1.099.386v.482h3.798v-.482h-.27c-.906 0-1.002-.135-1.137-.52l-3.277-8.27zm-.771 1.37 1.715 4.356h-3.431l1.716-4.357z'
      fill='#000000'
    />
    <path
      d='M33.639 23.443h-11.74l-.347 4.318h.463c.27-3.103.558-3.74 3.47-3.74.346 0 .848 0 1.04.04.405.076.405.288.405.732v10.12c0 .656 0 .926-2.024.926h-.771v.597c.79-.058 2.737-.058 3.624-.058s2.872 0 3.663.058v-.597h-.771c-2.024 0-2.024-.27-2.024-.926v-10.12c0-.386 0-.656.347-.733.212-.038.732-.038 1.098-.038 2.892 0 3.181.636 3.45 3.74h.483l-.366-4.319z'
      fill='#000000'
    />
    <path
      d='M43.971 35.82h-.482c-.482 2.949-.925 4.356-4.221 4.356h-2.545c-.906 0-.945-.135-.945-.771v-5.128h1.716c1.87 0 2.082.617 2.082 2.255h.482v-5.089h-.482c0 1.639-.212 2.236-2.082 2.236h-1.716v-4.607c0-.636.039-.77.945-.77h2.467c2.95 0 3.451 1.06 3.76 3.739h.481l-.54-4.318H32.097v.578h.444c1.484 0 1.523.212 1.523.906V39.27c0 .694-.039.906-1.523.906h-.444v.597h11.065l.81-4.954z'
      fill='#000000'
    />
    <path
      d='m49.773 29.014 2.641-3.855c.405-.617 1.06-1.234 2.776-1.253v-.578h-4.588v.578c.772.02 1.196.443 1.196.887 0 .192-.039.231-.174.443l-2.198 3.239-2.467-3.702c-.039-.057-.135-.212-.135-.289 0-.231.424-.559 1.234-.578v-.578c-.656.058-2.063.058-2.795.058-.598 0-1.793-.02-2.506-.058v.578h.366c1.06 0 1.426.135 1.793.675l3.527 5.34-3.142 4.645c-.27.386-.848 1.273-2.776 1.273v.597h4.588v-.597c-.886-.02-1.214-.54-1.214-.887 0-.174.058-.25.193-.463l2.718-4.029 3.045 4.588c.039.077.097.154.097.212 0 .232-.424.56-1.253.579v.597c.675-.058 2.082-.058 2.795-.058.81 0 1.696.02 2.506.058v-.597h-.366c-1.003 0-1.407-.097-1.812-.694l-4.049-6.13z'
      fill='#000000'
    />
  </svg>
);

const CopyCelebration = styled.span`
  border: 1px solid black;
  background-color: white;
  padding: 10px;
  font-size: 24px;
  height: 72px;
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

const AntiDiagonalSumsMatrixCell = styled(MatrixCell)`
  background-color: var(--matrix-cell-antidiagonal-sums-background-color);
  color: var(--alternating-rows-sums-font-color);
`;

const AlternatingAntiDiagonalSumsMatrixCell = styled(MatrixCell)`
  background-color: var(
    --matrix-cell-alternating-antidiagonal-sums-background-color
  );
  color: var(--alternating-rows-sums-font-color);
`;
