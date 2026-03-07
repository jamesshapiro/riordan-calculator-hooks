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
  color: var(--number-box-font-color);
  z-index: 1;
  transform: translateY(56px);
  /* margin-top: 0px; */
  font-family: 'Lato', sans-serif;
  border-right: var(--audio-player-border);
  width: var(--playlists-width);

  text-align: left;
  padding: none;
  padding-top: 5px;
`;
