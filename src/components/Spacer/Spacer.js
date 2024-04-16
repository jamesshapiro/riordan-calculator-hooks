import React from 'react';

import styled from 'styled-components';

function Spacer() {
  const id = React.useId();
  return (
    <td key={id}>
      <Wrapper>
        <InnerContainer>
          <InnerContainer>
            <InnerElement></InnerElement>
          </InnerContainer>
        </InnerContainer>
      </Wrapper>
    </td>
  );
}

export default Spacer;

const Wrapper = styled.div`
  display: inline-block;
  cursor: none;
  background-color: transparent;
  min-width: var(--spacer-width);
  width: 100%;
  height: var(--number-box-height);
`;

const InnerContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: fit-content;
  height: 100%;
  width: 100%;
`;

const InnerElement = styled.p`
  width: fit-content;
  font-size: 1rem;
`;
