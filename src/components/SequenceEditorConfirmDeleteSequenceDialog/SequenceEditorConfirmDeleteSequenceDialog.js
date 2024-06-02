import React from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import { Cross2Icon } from '@radix-ui/react-icons';
import './styles.css';
import { UserContext } from '../UserProvider';

import styled from 'styled-components';

const SequenceEditorConfirmDeleteSequenceDialog = ({ id }) => {
  const { setIsAuthModalOpen, deleteSequence, setUserSequences } =
    React.useContext(UserContext);
  const [dialogOpen, setDialogOpen] = React.useState(false);

  function handleDelete(id) {
    setUserSequences((oldValue) => {
      return oldValue.filter((sequence) => {
        return sequence.id !== id;
      });
    });
    deleteSequence(id);
    setDialogOpen(false);
    setIsAuthModalOpen(false);
  }

  const garbageSVG24 = (
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
      className='lucide lucide-trash-2'
    >
      <path d='M3 6h18' />
      <path d='M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6' />
      <path d='M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2' />
      <line x1='10' x2='10' y1='11' y2='17' />
      <line x1='14' x2='14' y1='11' y2='17' />
    </StyledSVG>
  );

  return (
    <Dialog.Root
      onOpenChange={() => {
        setDialogOpen((oldValue) => {
          setIsAuthModalOpen(!oldValue);
          return !oldValue;
        });
      }}
    >
      <Dialog.Trigger asChild>
        <button className='Button violet'>{garbageSVG24}</button>
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className='DialogOverlay' />
        <Dialog.Content className='ConfirmDialogContent'>
          <Dialog.Title className='ConfirmDialogTitle'>
            WARNING: Deletes are permanent.
          </Dialog.Title>
          <div
            style={{
              display: 'flex',
              marginTop: 25,
              justifyContent: 'flex-end',
            }}
          >
            <Dialog.Close asChild>
              <button className='Button red' onClick={() => handleDelete(id)}>
                Delete
              </button>
            </Dialog.Close>
          </div>
          <Dialog.Close asChild>
            <button className='ConfirmIconButton' aria-label='Close'>
              <Cross2Icon />
            </button>
          </Dialog.Close>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};

export default SequenceEditorConfirmDeleteSequenceDialog;

const StyledSVG = styled.svg`
  cursor: pointer;
`;
