import React from 'react';

import styled from 'styled-components';
import { UserContext } from '../UserProvider';
import { DataContext } from '../DataProvider';

import * as Dialog from '@radix-ui/react-dialog';
import { Cross2Icon } from '@radix-ui/react-icons';
import './styles.css';

const DEFAULT_URL = 'riordancalculator.com';

function ShareDialog() {
  const { isAuthenticated } = React.useContext(UserContext);
  const { matrix, shareMatrixId } = React.useContext(DataContext);
  const [linkIsCopied, setLinkIsCopied] = React.useState(false);
  const dialogTitle = isAuthenticated
    ? 'Copy Link or Send Email:'
    : 'Copy Link';
  if (!matrix) {
    return;
  }

  console.log(`shareMatrixId=${shareMatrixId}`);

  function handleClick(event) {
    const link = `${DEFAULT_URL}/?${shareMatrixId}`;
    navigator.clipboard
      .writeText(link)
      .then(() => {
        console.log('Link copied to clipboard');
        setLinkIsCopied(true);
        setTimeout(() => setLinkIsCopied(false), 2000);
      })
      .catch((err) => {
        console.error('Failed to copy link: ', err);
      });
  }

  function handleSendEmail() {}

  const clipboardSVG = (
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
      className='lucide lucide-clipboard-copy'
    >
      <rect width='8' height='4' x='8' y='2' rx='1' ry='1' />
      <path d='M8 4H6a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-2' />
      <path d='M16 4h2a2 2 0 0 1 2 2v4' />
      <path d='M21 14H11' />
      <path d='m15 10-4 4 4 4' />
    </StyledSVG>
  );

  const linkText = !linkIsCopied ? (
    <>
      {clipboardSVG}
      <>{`${DEFAULT_URL}/?${shareMatrixId}`}</>
    </>
  ) : (
    'Link Copied to Clipboard!'
  );

  const sendMailSVG = (
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
      className='lucide lucide-send-horizontal'
    >
      <path d='m3 3 3 9-3 9 19-9Z' />
      <path d='M6 12h16' />
    </StyledSVG>
  );

  const copyLinkOption = (
    <fieldset className='DialogFieldset'>
      <label className='DialogLabel' htmlFor='copylink'>
        Copy Link:
      </label>

      <button onClick={handleClick} className='DialogParagraph' id='copylink'>
        {linkText}
      </button>
    </fieldset>
  );

  const emailOption = isAuthenticated ? (
    <fieldset className='DialogFieldset'>
      <label className='DialogLabel' htmlFor='email'>
        Recipient Email:
      </label>
      <input
        className='DialogInput'
        id='email'
        placeholder='recipient@university.edu'
      />
    </fieldset>
  ) : (
    <></>
  );
  return (
    <Dialog.Root>
      <Dialog.Trigger asChild>
        <button className='DialogTrigger'>Share</button>
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className='DialogOverlay' />
        <Dialog.Content className='DialogContent'>
          <Dialog.Title className='DialogTitle'>{dialogTitle}</Dialog.Title>
          {copyLinkOption}
          {emailOption}
          <div
            style={{
              display: 'flex',
              marginTop: 25,
              justifyContent: 'flex-end',
            }}
          >
            <Dialog.Close asChild>
              <button className='DialogButton blue'>{sendMailSVG}</button>
            </Dialog.Close>
          </div>
          <Dialog.Close asChild>
            <button className='DialogIconButton' aria-label='Close'>
              <Cross2Icon />
            </button>
          </Dialog.Close>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

export default ShareDialog;

const StyledSVG = styled.svg`
  cursor: pointer;
`;
