import React from 'react';

import * as Dialog from '@radix-ui/react-dialog';
import { Cross2Icon } from '@radix-ui/react-icons';
import './styles.css';
import { UserContext } from '../UserProvider';
import * as Tabs from '@radix-ui/react-tabs';

const AuthDialog = () => {
  const [email, setEmail] = React.useState('');
  const [firstname, setFirstname] = React.useState('');
  const [lastname, setLastname] = React.useState('');
  const [password, setPassword] = React.useState('');
  const { handleLogin, handleSignUp, handleConfirmSignUp, setIsAuthModalOpen } =
    React.useContext(UserContext);
  const [dialogOpen, setDialogOpen] = React.useState(false);
  const [code, setCode] = React.useState('');
  const [awaitingConfirmation, setAwaitingConfirmation] = React.useState(false);

  function handleLoginAttempt() {
    handleLogin(email, password);
    setDialogOpen(false);
    setIsAuthModalOpen(false);
  }

  function handleSignUpAttempt() {
    handleSignUp(email, password, firstname, lastname);
    setAwaitingConfirmation(true);
  }

  function handleConfirmSignUpAttempt() {
    handleConfirmSignUp(email, code);
    setAwaitingConfirmation(false);
    setTimeout(() => {
      handleLogin(email, password);
    }, 1000);
    setDialogOpen(false);
    setIsAuthModalOpen(false);
  }

  const signUpForm = (
    <>
      <p className='Text'>Create an account!</p>
      <Dialog.Description className='DialogDescription'></Dialog.Description>
      <fieldset className='Fieldset'>
        <label className='Label' htmlFor='email'>
          Email
        </label>
        <input
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className='Input'
          id='email'
          type='email'
        />
      </fieldset>
      <fieldset className='Fieldset'>
        <label className='Label' htmlFor='firstname'>
          First Name
        </label>
        <input
          value={firstname}
          onChange={(e) => setFirstname(e.target.value)}
          className='Input'
          id='firstname'
          type='text'
        />
      </fieldset>
      <fieldset className='Fieldset'>
        <label className='Label' htmlFor='lastname'>
          Last Name
        </label>
        <input
          value={lastname}
          onChange={(e) => setLastname(e.target.value)}
          className='Input'
          id='lastname'
          type='text'
        />
      </fieldset>
      <fieldset className='Fieldset'>
        <label className='Label' htmlFor='password'>
          Password
        </label>
        <input
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className='Input'
          id='password'
          type='password'
        />
      </fieldset>
      <div
        style={{
          display: 'flex',
          marginTop: 20,
          justifyContent: 'flex-end',
        }}
      >
        <button onClick={handleSignUpAttempt} className='Button green'>
          Sign Up
        </button>
      </div>
    </>
  );

  const confirmForm = (
    <>
      <p className='Text'>{`Enter Confirmation Code Sent to ${email}`}</p>
      <Dialog.Description className='DialogDescription'></Dialog.Description>
      <fieldset className='Fieldset'>
        <label className='Label' htmlFor='code'>
          Confirmation Code
        </label>
        <input
          value={code}
          onChange={(e) => setCode(e.target.value)}
          className='Input'
          id='code'
          type='text'
        />
      </fieldset>
      <div
        style={{
          display: 'flex',
          marginTop: 20,
          justifyContent: 'flex-end',
        }}
      >
        <button onClick={handleConfirmSignUpAttempt} className='Button green'>
          Confirm
        </button>
      </div>
    </>
  );

  const signUpTabContent = awaitingConfirmation ? confirmForm : signUpForm;

  return (
    <Dialog.Root
      open={dialogOpen}
      onOpenChange={() => {
        setDialogOpen((oldValue) => {
          setIsAuthModalOpen(!oldValue);
          return !oldValue;
        });
      }}
    >
      <Dialog.Trigger asChild>
        <button className='Button violet'>Login</button>
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className='DialogOverlay' />
        <Dialog.Content className='DialogContent' asChild>
          <Tabs.Root className='TabsRoot' defaultValue='tab1'>
            <Tabs.List className='TabsList' aria-label='Manage your account'>
              <Tabs.Trigger className='TabsTrigger' value='tab1'>
                Log In
              </Tabs.Trigger>
              <Tabs.Trigger className='TabsTrigger' value='tab2'>
                Sign Up
              </Tabs.Trigger>
            </Tabs.List>
            <Tabs.Content className='TabsContent' value='tab1'>
              <p className='Text'>Your username is your email.</p>
              <fieldset className='Fieldset'>
                <label className='Label' htmlFor='email'>
                  Email
                </label>
                <input
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className='Input'
                  id='email'
                  type='email'
                />
              </fieldset>
              <fieldset className='Fieldset'>
                <label className='Label' htmlFor='password'>
                  Password
                </label>
                <input
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className='Input'
                  id='password'
                  type='password'
                />
              </fieldset>
              <div
                style={{
                  display: 'flex',
                  marginTop: 20,
                  justifyContent: 'flex-end',
                }}
              >
                <button onClick={handleLoginAttempt} className='Button green'>
                  Log In
                </button>
              </div>
            </Tabs.Content>
            <Tabs.Content className='TabsContent' value='tab2'>
              {signUpTabContent}
            </Tabs.Content>
          </Tabs.Root>
          {/* <Dialog.Title className="DialogTitle">Login</Dialog.Title>
          <Dialog.Description className="DialogDescription">
            Log in or create an account if you don't already have one!
          </Dialog.Description>
          <fieldset className="Fieldset">
            <label className="Label" htmlFor="email">
              Email
            </label>
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="Input"
              id="email"
              type="email"
            />
          </fieldset>
          <fieldset className="Fieldset">
            <label className="Label" htmlFor="password">
              Password
            </label>
            <input
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="Input"
              id="password"
              type="password"
            />
          </fieldset>
          <div
            style={{
              display: 'flex',
              marginTop: 25,
              justifyContent: 'flex-end',
            }}
          >
            <Dialog.Close asChild>
              <button onClick={handleLoginAttempt} className="Button mauve">
                Log in
              </button>
            </Dialog.Close>
          </div>
          <Dialog.Close asChild>
            <button className="IconButton" aria-label="Close">
              <Cross2Icon />
            </button>
          </Dialog.Close> */}
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};
export default AuthDialog;
