import React from 'react';

import SequenceEditorSequence from '../SequenceEditorSequence';

import { sequences } from '../../data';

import styled from 'styled-components';

function SequenceEditor() {
  return (
    <Wrapper>
      {sequences.map((sequence, index) => {
        console.log(sequence)
        return (
          <>
            <p></p>
            <SequenceEditorSequence name={sequence.name} key={`seq-${index}`} sequenceValues={sequence.sequence} />
          </>
        )
      })}
    </Wrapper>
)}

export default SequenceEditor;

const Wrapper = styled.div`
  margin-left: 10px;
  margin-top: 10px;
  z-index: 10;
`