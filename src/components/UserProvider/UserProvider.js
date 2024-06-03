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

const ENDPOINT = process.env.REACT_APP_MATRIX_URL;
const AUTH_ENDPOINT = process.env.REACT_APP_MATRIX_URL_AUTH;
const API_KEY = process.env.REACT_APP_API_KEY;

function UserProvider({ children }) {
  const [isAuthenticated, setIsAuthenticated] = React.useState(false);
  const [authUpdated, setAuthUpdated] = React.useState(0);
  const [user, setUser] = React.useState('');
  const [token, setToken] = React.useState(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = React.useState(false);
  const [userQueries, setUserQueries] = React.useState([]);
  const [userSequences, setUserSequences] = React.useState([]);
  const [userDefaultHiddenSequences, setUserDefaultHiddenSequences] =
    React.useState([]);
  const [infiniteScrollToken, setInfiniteScrollToken] = React.useState(null);
  const [stats, setStats] = React.useState(null);
  const [name, setName] = React.useState('');

  React.useEffect(() => {
    const getUserData = async () => {
      try {
        const { username, userId, signInDetails } = await getCurrentUser();
        const userAttributes = await fetchUserAttributes();
        setIsAuthenticated(true);
        setUser(username);
        setName(userAttributes['given_name']);
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

  function processUserSequences(sequences) {
    if (!sequences || Object.keys(sequences).length === 0) {
      return [];
    }
    return sequences.map((sequence) => {
      const sequenceName = sequence.SK1.S.split('#')[1];
      const sequenceId = `custom#${sequenceName.replace(/ /g, '_')}`;
      const sequenceValues = JSON.parse(sequence.VALUES.S);
      return {
        name: sequenceName,
        id: sequenceId,
        sequence: sequenceValues,
      };
    });
  }

  React.useEffect(() => {
    const getUserSequenceDefaults = async () => {
      if (!isAuthenticated) return;
      if (!token) return;
      const URL = AUTH_ENDPOINT + 'sequence';
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
      const defaultHiddenSequences = json['default_hidden_sequences'];
      const customSequences = json['custom_sequences'];
      const processed = processUserSequences(customSequences);

      setUserSequences(processed);
      setUserDefaultHiddenSequences(defaultHiddenSequences);
    };
    getUserSequenceDefaults();
  }, [isAuthenticated, user, token]);

  React.useEffect(() => {
    const getStats = async () => {
      if (isAuthenticated && !token) return;
      const URL = isAuthenticated
        ? AUTH_ENDPOINT + `stats`
        : ENDPOINT + `stats`;
      const HEADERS = isAuthenticated
        ? {
            'Content-Type': 'application/json',
            Authorization: token,
          }
        : {
            'Content-Type': 'application/json',
            'x-api-key': API_KEY,
          };

      const request = new Request(URL, {
        method: 'GET',
        headers: HEADERS,
        timeout: 100000,
      });
      // const response = await fetch(request);
      // const json = await response.json();
      // setStats(json);
    };
    getStats();
  }, [isAuthenticated, user, token]);

  const deleteQuery = async (queryId) => {
    const oldQuery = userQueries.filter((query) => {
      return query.MATRIX_SHAREID.S === queryId;
    })[0];
    const oldUlid = oldQuery.MATRIX_ULID.S;
    setUserQueries((oldValue) => {
      return oldValue.filter((query) => {
        return query.MATRIX_SHAREID.S !== queryId;
      });
    });
    const URL = AUTH_ENDPOINT + `query?id=${queryId}&ulid=${oldUlid}`;
    const HEADERS = {
      'Content-Type': 'application/json',
      Authorization: token,
    };
    const request = new Request(URL, {
      method: 'DELETE',
      headers: HEADERS,
      timeout: 100000,
    });
    const response = await fetch(request);
    const json = await response.json();
  };

  const deleteSequence = async (sequenceId) => {
    const oldSequence = userSequences.filter((sequence) => {
      return sequence.id === sequenceId;
    })[0];
    const sequenceTitle = oldSequence.name;
    const payload = { title: sequenceTitle };
    const URL = AUTH_ENDPOINT + `sequence`;
    const HEADERS = {
      'Content-Type': 'application/json',
      Authorization: token,
    };
    const request = new Request(URL, {
      method: 'DELETE',
      headers: HEADERS,
      body: JSON.stringify(payload),
      timeout: 100000,
    });
    const response = await fetch(request);
    const json = await response.json();
  };

  const handleLogout = async () => {
    try {
      await signOut();
      setIsAuthenticated(false);
      setUser('');
      setName('');
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
        stats,
        deleteQuery,
        name,
        userSequences,
        userDefaultHiddenSequences,
        setUserSequences,
        setUserDefaultHiddenSequences,
        deleteSequence,
      }}
    >
      {children}
    </UserContext.Provider>
  );
}

export default UserProvider;
