import React from 'react';
import { DataContext } from '../DataProvider';
import { range } from '../../utils';

import styled from 'styled-components';

const StyledSVG = styled.svg`
  &:visited {
    --link-color: : var(--number-box-font-color);
  }
`;

const SearchSVG = (
  <StyledSVG
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="var(--number-box-font-color)"
    stroke-width="2"
    stroke-linecap="round"
    stroke-linejoin="round"
    class="lucide lucide-search"
  >
    <circle cx="11" cy="11" r="8" />
    <path d="m21 21-4.3-4.3" />
  </StyledSVG>
);

function Matrix() {
  const { matrix } = React.useContext(DataContext);
  if (!matrix) {
    return <></>;
  }
  const parsedMatrix = JSON.parse(matrix);
  const riordanGroupElem = parsedMatrix['riordan group elem'];

  return (
    <>
      <MatrixTable>
        <tbody>
          <tr>
            {range(0, riordanGroupElem[0].length + 1).map((item, colIndex) => {
              const searchEntries = riordanGroupElem
                .map((row) => row[colIndex - 1])
                .slice(colIndex - 1);
              const searchQueryParam = searchEntries.join('%2C');
              return (
                <MatrixCell
                  style={{ paddingLeft: '15px' }}
                  row={0}
                  col={colIndex}
                >
                  <a
                    target="_blank"
                    rel="noreferrer"
                    href={`https://oeis.org/search?q=${searchQueryParam}&language=english&go=Search`}
                  >
                    {colIndex > 0 ? SearchSVG : ''}
                  </a>
                </MatrixCell>
              );
            })}
          </tr>
          {riordanGroupElem.map((row, rowIndex) => {
            const searchEntries = riordanGroupElem[rowIndex].slice(
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
                  <a
                    target="_blank"
                    rel="noreferrer"
                    href={`https://oeis.org/search?q=${searchQueryParam}&language=english&go=Search`}
                  >
                    {SearchSVG}
                  </a>
                </MatrixCell>
                {row.map((num, colIndex) => {
                  return (
                    <MatrixCell row={rowIndex + 1} col={colIndex + 1}>
                      {num}
                    </MatrixCell>
                  );
                })}
              </tr>
            );
          })}
        </tbody>
      </MatrixTable>
    </>
  );
}

export default Matrix;

const MatrixTable = styled.table`
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
    p.col == 0 || p.row == 0
      ? 'var(--select-td-background)'
      : p.row > 0 && p.col > p.row
        ? 'black'
        : 'var(--matrix-cell-background-color)'};

  background-image: ${(p) =>
    p.col == 0 || p.row == 0
      ? 'revert'
      : p.col > p.row
        ? 'revert'
        : 'var(--box-gradient)'};
  color: ${(p) =>
    p.row > 0 && p.col > p.row ? 'white' : 'var(--number-box-font-color)'};
`;
