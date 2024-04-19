import React from 'react';
import { Amplify } from 'aws-amplify';
import {
  getCurrentUser,
  signOut,
  signIn,
  signUp,
  // resendSignUpCode,
  fetchUserAttributes,
  confirmSignUp,
  fetchAuthSession,
} from '@aws-amplify/auth';
import awsExports from '../../aws-exports';
Amplify.configure(awsExports);

export const UserContext = React.createContext();

function UserProvider({ children }) {
  const [isAuthenticated, setIsAuthenticated] = React.useState(false);
  const [authUpdated, setAuthUpdated] = React.useState(0);
  const [user, setUser] = React.useState('');
  const [token, setToken] = React.useState(null);
  React.useEffect(() => {
    const getUserData = async () => {
      try {
        const { username, userId, signInDetails } = await getCurrentUser();
        const userAttributes = await fetchUserAttributes();
        setIsAuthenticated(true);
        setUser(userAttributes.given_name);
        const { tokens } = await fetchAuthSession({ forceRefresh: true });
        const idToken = tokens.idToken.toString();
        setToken(idToken);
      } catch (err) {
        console.log(err);
        setIsAuthenticated(false);
      }
    };
    getUserData();
  }, [authUpdated]);

  const handleLogout = async () => {
    try {
      await signOut();
      setIsAuthenticated(false);
      setUser('');
      setAuthUpdated((oldValue) => oldValue + 1);
    } catch (err) {
      console.log(err);
    }
  };

  const handleLogin = async (email, password) => {
    try {
      const input = {
        username: email,
        password: password,
      };
      const response = await signIn(input);
      setAuthUpdated((oldValue) => oldValue + 1);
    } catch (err) {
      console.log(err);
    }
  };

  const handleSignUp = async (email, password, firstname) => {
    try {
      const input = {
        username: email,
        password: password,
        options: {
          userAttributes: {
            email,
            given_name: firstname,
          },
        },
      };
      const signUpResponse = await signUp(input);
    } catch (err) {
      console.log(err);
    }
  };

  const handleConfirmSignUp = async (email, code) => {
    try {
      const { isSignUpComplete, nextStep } = await confirmSignUp({
        username: email,
        confirmationCode: code,
      });
      console.log(`${isSignUpComplete} ${nextStep}`);
      setAuthUpdated((oldValue) => oldValue + 1);
    } catch (error) {
      console.log('error confirming sign up', error);
    }
  };

  return (
    <UserContext.Provider
      value={{
        isAuthenticated,
        setIsAuthenticated,
        user,
        handleLogout,
        handleLogin,
        handleSignUp,
        handleConfirmSignUp,
        token,
      }}
    >
      {children}
    </UserContext.Provider>
  );
}

export default UserProvider;
