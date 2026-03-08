import React from 'react';

import styled from 'styled-components';
import SequenceControl from '../SequenceControl';

function SequenceControlPanel() {
  return (
    <Wrapper>
      <table>
        <tbody>
          <SequenceControl sequenceId={'g'} />
          <SequenceControl sequenceId={'f'} />
        </tbody>
      </table>
    </Wrapper>
  );
}

export default SequenceControlPanel;

const Wrapper = styled.div`
  color: hsl(215, 45%, 35%);
  z-index: 1;
  transform: translateY(56px);
  width: var(--playlists-width);
  text-align: left;
  padding: none;
  padding-top: 5px;
  font-weight: 500;
`;
