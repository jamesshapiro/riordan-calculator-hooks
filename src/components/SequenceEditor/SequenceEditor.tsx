'use client';

import React from 'react';
import SequenceEditorSequence from '@/components/SequenceEditorSequence/SequenceEditorSequence';
import { DataContext } from '@/components/DataProvider/DataProvider';
import { UserContext } from '@/components/UserProvider/UserProvider';
import { sequences } from '@/data';
import styled from 'styled-components';
import NavBar from '@/components/NavBar/NavBar';
import Header from '@/components/Header/Header';
import SequenceEditorSelectTable from '@/components/SequenceEditorSelectTable/SequenceEditorSelectTable';
import SequenceEditorWindowControls from '@/components/SequenceEditorWindowControls/SequenceEditorWindowControls';
import SequenceEditorSubmitButton from '@/components/SequenceEditorSubmitButton/SequenceEditorSubmitButton';
import SequenceEditorConfirmDeleteSequenceDialog from '@/components/SequenceEditorConfirmDeleteSequenceDialog/SequenceEditorConfirmDeleteSequenceDialog';

const AUTH_ENDPOINT = process.env.NEXT_PUBLIC_MATRIX_URL_AUTH;

function SequenceEditor() {
  const { userSequences, userDefaultHiddenSequences, setUserDefaultHiddenSequences, token } = React.useContext(UserContext);
  const { customSequenceTitle, setCustomSequenceTitle, setCustomSequence } = React.useContext(DataContext);
  const [selectedOption, setSelectedOption] = React.useState('default');
  const [oeisId, setOeisId] = React.useState('');

  const updateDefaults = async (sequenceId: string, displayOption: string) => {
    const URL = AUTH_ENDPOINT + `preset?sequence=${sequenceId}&display=${displayOption}`;
    const HEADERS = { 'Content-Type': 'application/json', Authorization: token };
    fetch(new Request(URL!, { method: 'PUT', headers: HEADERS }));
  };

  const fetchOEIS = async (id: string) => {
    const URL = AUTH_ENDPOINT + `oeis?oeis_id=A${id}`;
    const HEADERS = { 'Content-Type': 'application/json', Authorization: token };
    const response = await fetch(new Request(URL!, { method: 'GET', headers: HEADERS }));
    const json = await response.json();
    setCustomSequence(json.sequence.slice(0, 15));
    setCustomSequenceTitle((old: string) => `${old}${old !== '' ? ' ' : ''}(A${id})`);
  };

  function getSequenceDisplay(sequenceTerms: any[]) {
    return [...sequenceTerms, '...'].map((term, index) => {
      if (term.toString().length < 6) return (<MiniNumberBoxWrapper key={`term-${index}`}><InnerContainer><InnerElement>{term}</InnerElement></InnerContainer></MiniNumberBoxWrapper>);
      return null;
    });
  }

  const EyeOffSVG = (<StyledSVG xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2' strokeLinecap='round' strokeLinejoin='round'><path d='M9.88 9.88a3 3 0 1 0 4.24 4.24' /><path d='M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68' /><path d='M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61' /><line x1='2' x2='22' y1='2' y2='22' /></StyledSVG>);
  const EyeOnSVG = (<StyledSVG xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2' strokeLinecap='round' strokeLinejoin='round'><path d='M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z' /><circle cx='12' cy='12' r='3' /></StyledSVG>);

  const presetTable = (
    <Table><thead><tr><TDWrapper>Title</TDWrapper><TDWrapper>Sequence</TDWrapper><TDWrapper>Hide/Show</TDWrapper></tr></thead>
    <tbody>{sequences.map((sequence, index) => {
      const hideIconPredicate = userDefaultHiddenSequences && Object.keys(userDefaultHiddenSequences).length > 0 && userDefaultHiddenSequences.includes(sequence.id);
      const icon = hideIconPredicate ? EyeOffSVG : EyeOnSVG;
      const hideShowOption = (
        <Preview onClick={() => {
          if (hideIconPredicate) { updateDefaults(sequence.id, 'true'); setUserDefaultHiddenSequences((old: string[]) => old.filter((item: string) => item !== sequence.id)); }
          else { updateDefaults(sequence.id, 'false'); setUserDefaultHiddenSequences((old: string[]) => { const nv = old && Object.keys(userDefaultHiddenSequences).length > 0 ? [...old] : []; nv.push(sequence.id); return nv; }); }
        }}>{icon}</Preview>
      );
      return (<tr key={index}><TDWrapper>{sequence.name}</TDWrapper><TDWrapper>{getSequenceDisplay(sequence.sequence.slice(0, 15))}</TDWrapper><TDWrapper>{sequence.id !== 'catalan' && hideShowOption}</TDWrapper></tr>);
    })}</tbody></Table>
  );

  const customTable = (
    <Table><thead><tr><TDWrapper>Title</TDWrapper><TDWrapper>Sequence</TDWrapper><TDWrapper>Delete?</TDWrapper></tr></thead>
    <tbody>{userSequences.map((sequence: any, index: number) => (
      <tr key={index}><TDWrapper>{sequence.name}</TDWrapper><TDWrapper>{getSequenceDisplay(sequence.sequence.slice(0, 15))}</TDWrapper><TDWrapper><SequenceEditorConfirmDeleteSequenceDialog id={sequence.id} /></TDWrapper></tr>
    ))}</tbody></Table>
  );

  const customSequenceView = (
    <>
      <form onSubmit={(e) => e.preventDefault()}>
        <Aspan>Title: </Aspan>
        <TitleInput id='title-field' value={customSequenceTitle} placeholder='Give Your Sequence A Title!' onChange={(e) => setCustomSequenceTitle(e.target.value)} />
      </form>
      <form onSubmit={(e) => { e.preventDefault(); if (oeisId.length !== 6) window.alert('OEIS ID must be exactly six digits long'); fetchOEIS(oeisId); setOeisId(''); }}>
        <Aspan>A</Aspan>
        <TitleInput id='oeis-field' value={oeisId} placeholder='123456 (Optional OEIS ID)' onChange={(e) => { if (e.target.value !== '' && !/^\d+$/.test(e.target.value)) return; if (e.target.value.length > 6) return; setOeisId(e.target.value); }} />
        <StyledSubmitButton type='submit'>Import</StyledSubmitButton>
      </form>
      <TableWrapper><tbody><SequenceEditorWindowControls /><SequenceEditorSequence /></tbody></TableWrapper>
      <SequenceEditorSubmitButton />
    </>
  );

  return (
    <FlexColumnWrapper>
      <NavBar /><HeaderDiv><Header /></HeaderDiv><VerticalSpace />
      <SequenceEditorSelectTable selectedOption={selectedOption} setSelectedOption={setSelectedOption} />
      {selectedOption === 'default' && presetTable}
      {selectedOption === 'add' && customSequenceView}
      {selectedOption === 'custom' && customTable}
    </FlexColumnWrapper>
  );
}

export default SequenceEditor;

const Aspan = styled.span`font-size: 36px;`;
const TitleInput = styled.input`background-color: var(--matrix-header-field); padding: 12px; border: solid 1px var(--number-box-border-color); border-radius: 2px; min-width: 500px; display: inline; margin-top: 50px; margin-bottom: 10px; font-size: 2rem;`;
const StyledSubmitButton = styled.button`z-index: 10000; margin-top: 55px; margin-left: 10px; min-width: 50px; width: fit-content; height: 19px; border: 1px solid var(--submit-button-border); padding: 10px; border-radius: var(--number-box-border-radius); color: white; background-color: var(--submit-button-background); &:hover { background-image: revert; background-color: var(--hover-button-color); color: white; } &:active { background-color: var(--active-button-color); color: white; }`;
const TableWrapper = styled.table`margin-left: -150px; padding-top: 13px;`;
const VerticalSpace = styled.div`min-height: 50px;`;
const HeaderDiv = styled.div`align-self: flex-start; padding-left: 300px;`;
const FlexColumnWrapper = styled.div`padding-left: 35px; display: flex; flex-direction: column; height: 100%; width: 100%; margin-left: 0px;`;
const StyledSVG = styled.svg`cursor: pointer;`;
const Preview = styled.div`margin-left: 15px;`;
const Table = styled.table`background-color: var(--user-history-cell-background); border-collapse: collapse; border: 1.5px solid var(--mini-number-box-border-color); width: fit-content; margin-top: 20px; margin-right: 30px; margin-bottom: 300px;`;
const TDWrapper = styled.td`border: 1px solid var(--mini-number-box-border-color); padding: 8px;`;
const MiniNumberBoxWrapper = styled.div`position: relative; display: inline-block; background-color: var(--mini-number-box-background-color); border-radius: var(--mini-number-box-border-radius); min-width: var(--mini-number-box-width); height: var(--mini-number-box-height); margin: 1px; border: 1px solid var(--mini-number-box-border-color); z-index: 1;`;
const InnerContainer = styled.div`display: flex; justify-content: center; align-items: center; font-family: 'Lato', sans-serif; color: var(--mini-number-box-font-color); width: fit-content; height: 100%; width: 100%;`;
const InnerElement = styled.p`width: fit-content;`;
