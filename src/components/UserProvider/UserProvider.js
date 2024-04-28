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

const AUTH_ENDPOINT = process.env.REACT_APP_MATRIX_URL_AUTH;

function UserProvider({ children }) {
  const [isAuthenticated, setIsAuthenticated] = React.useState(false);
  const [authUpdated, setAuthUpdated] = React.useState(0);
  const [user, setUser] = React.useState('');
  const [token, setToken] = React.useState(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = React.useState(false);
  const [userQueries, setUserQueries] = React.useState([]);
  const [infiniteScrollToken, setInfiniteScrollToken] = React.useState(null);

  React.useEffect(() => {
    const getUserData = async () => {
      try {
        const { username, userId, signInDetails } = await getCurrentUser();
        const userAttributes = await fetchUserAttributes();
        setIsAuthenticated(true);
        setUser(username);
        const { tokens } = await fetchAuthSession({ forceRefresh: true });
        const idToken = tokens.idToken.toString();
        setToken(idToken);
      } catch (err) {
        // console.log(err);
        setIsAuthenticated(false);
      }
    };
    getUserData();
  }, [authUpdated]);

  React.useEffect(() => {
    const getUserHistory = async () => {
      if (!isAuthenticated) return;
      if (!token) return;
      const URL = AUTH_ENDPOINT + 'queries';
      const HEADERS = {
        'Content-Type': 'application/json',
        Authorization: token,
      };
      const request = new Request(URL, {
        method: 'GET',
        headers: HEADERS,
        timeout: 100000,
      });
      const response = await fetch(request);
      const json = await response.json();
      const items = json.Items;
      setUserQueries(items);
    };
    getUserHistory();
  }, [isAuthenticated, user, token]);

  const handleLogout = async () => {
    try {
      await signOut();
      setIsAuthenticated(false);
      setUser('');
      setAuthUpdated((oldValue) => oldValue + 1);
    } catch (err) {
      // console.log(err);
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
      // console.log(err);
    }
  };

  const handleSignUp = async (email, password, firstname, lastname) => {
    try {
      const input = {
        username: email,
        password: password,
        options: {
          userAttributes: {
            email,
            given_name: firstname,
            family_name: lastname,
          },
        },
      };
      const signUpResponse = await signUp(input);
    } catch (err) {
      // console.log(err);
    }
  };

  const handleConfirmSignUp = async (email, code) => {
    try {
      const { isSignUpComplete, nextStep } = await confirmSignUp({
        username: email,
        confirmationCode: code,
      });
      setAuthUpdated((oldValue) => oldValue + 1);
    } catch (error) {
      // console.log('error confirming sign up', error);
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
        isAuthModalOpen,
        setIsAuthModalOpen,
        token,
        userQueries,
      }}
    >
      {children}
    </UserContext.Provider>
  );
}

export default UserProvider;
