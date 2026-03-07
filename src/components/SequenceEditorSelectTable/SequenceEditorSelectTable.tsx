import React from 'react';

import styled from 'styled-components';

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
    <StyledSVG
      xmlns='http://www.w3.org/2000/svg'
      width='24'
      height='24'
      viewBox='0 0 24 24'
      fill='none'
      stroke='currentColor'
      strokeWidth='2'
      strokeLinecap='round'
      strokeLinejoin='round'
      className='lucide lucide-check'
    >
      <path d='M20 6 9 17l-5-5' />
    </StyledSVG>
  );

  function getRuntimesTable() {
    return (
      <Table>
        <TBody>
          {OPTIONS.map((option) => {
            return (
              <TR>
                <CheckTD>{selectedOption === option.id ? check : null}</CheckTD>
                <TD>
                  <Button
                    id={option.id}
                    onClick={() => handleSelect(option.id)}
                  >
                    {option.name}
                  </Button>
                </TD>
              </TR>
            );
          })}
        </TBody>
      </Table>
    );
  }

  const table = getRuntimesTable();

  return table;
}

export default SequenceEditorSelectTable;

const StyledSVG = styled.svg``;

const Table = styled.table`
  margin-top: 10px;
  margin-left: 10px;
  padding: 20px;
  background-color: white;
  min-width: 300px;
  width: 100px;
  border-radius: 6px;
  border-collapse: collapse;
`;

const TBody = styled.tbody`
  height: 100%;
  width: 100%;
`;

const TR = styled.tr`
  height: 50px;
  display: flex;
  align-items: stretch;
  justify-content: stretch;
  border-top: 1px solid var(--number-box-border-color);
  border-left: 1px solid var(--number-box-border-color);
  border-right: 1px solid var(--number-box-border-color);
  &:last-child {
    border-bottom: 1px solid var(--number-box-border-color);
  }
`;

const CheckTD = styled.td`
  height: 100%;
  width: 10%;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const TD = styled.td`
  height: 100%;
  width: 90%;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const Button = styled.button`
  text-align: center;
  min-height: 100%;
  height: 100%;
  min-width: 100%;
`;
