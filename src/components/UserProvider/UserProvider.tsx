import React from 'react';
import { Amplify } from 'aws-amplify';
import {
  getCurrentUser,
  signOut,
  signIn,
  signUp,
  fetchUserAttributes,
  confirmSignUp,
  fetchAuthSession,
} from '@aws-amplify/auth';
import useInterval from '../../hooks/use-interval.hook';

import awsExports from '../../aws-exports';

if (awsExports && Object.keys(awsExports).length > 0) {
  Amplify.configure(awsExports);
}

export const UserContext = React.createContext<any>({});

const ENDPOINT = process.env.NEXT_PUBLIC_MATRIX_URL;
const AUTH_ENDPOINT = process.env.NEXT_PUBLIC_MATRIX_URL_AUTH;
const API_KEY = process.env.NEXT_PUBLIC_API_KEY;

function UserProvider({ children }: any) {
  const [isAuthenticated, setIsAuthenticated] = React.useState(false);
  const [authUpdated, setAuthUpdated] = React.useState(0);
  const [user, setUser] = React.useState('');
  const [token, setToken] = React.useState<any>(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = React.useState(false);
  const [userQueries, setUserQueries] = React.useState<any[]>([]);
  const [userSequences, setUserSequences] = React.useState<any[]>([]);
  const [userDefaultHiddenSequences, setUserDefaultHiddenSequences] =
    React.useState<any[]>([]);
  const [infiniteScrollToken, setInfiniteScrollToken] = React.useState(null);
  const [stats, setStats] = React.useState(null);
  const [name, setName] = React.useState('');

  const fetchToken = async () => {
    try {
      const { tokens } = await fetchAuthSession({ forceRefresh: true });
      const idToken = tokens!.idToken!.toString();
      setToken(idToken);
    } catch (err) {
      setIsAuthenticated(false);
    }
  };

  useInterval(fetchToken, isAuthenticated ? 3600000 : null);

  React.useEffect(() => {
    const getUserData = async () => {
      try {
        const { username, userId, signInDetails } = await getCurrentUser();
        const userAttributes = await fetchUserAttributes();
        setIsAuthenticated(true);
        setUser(username);
        setName(userAttributes['given_name'] || '');
        const { tokens } = await fetchAuthSession({ forceRefresh: true });
        const idToken = tokens!.idToken!.toString();
        setToken(idToken);
      } catch (err) {
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
      const HEADERS: any = {
        'Content-Type': 'application/json',
        Authorization: token,
      };
      const request = new Request(URL!, {
        method: 'GET',
        headers: HEADERS,
      });
      const response = await fetch(request);
      const json = await response.json();
      const items = json.Items;
      setUserQueries(items);
    };
    getUserHistory();
  }, [isAuthenticated, user, token]);

  function processUserSequences(sequences: any) {
    if (!sequences || Object.keys(sequences).length === 0) {
      return [];
    }
    return sequences.map((sequence: any) => {
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
      const HEADERS: any = {
        'Content-Type': 'application/json',
        Authorization: token,
      };
      const request = new Request(URL!, {
        method: 'GET',
        headers: HEADERS,
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
      const HEADERS: any = isAuthenticated
        ? {
            'Content-Type': 'application/json',
            Authorization: token,
          }
        : {
            'Content-Type': 'application/json',
            'x-api-key': API_KEY,
          };

      const request = new Request(URL!, {
        method: 'GET',
        headers: HEADERS,
      });
      const response = await fetch(request);
      const json = await response.json();
      setStats(json);
    };
    getStats();
  }, [isAuthenticated, user, token]);

  const deleteQuery = async (queryId: string) => {
    const oldQuery = userQueries.filter((query: any) => {
      return query.MATRIX_SHAREID.S === queryId;
    })[0];
    const oldUlid = oldQuery.MATRIX_ULID.S;
    setUserQueries((oldValue) => {
      return oldValue.filter((query: any) => {
        return query.MATRIX_SHAREID.S !== queryId;
      });
    });
    const URL = AUTH_ENDPOINT + `query?id=${queryId}&ulid=${oldUlid}`;
    const HEADERS: any = {
      'Content-Type': 'application/json',
      Authorization: token,
    };
    const request = new Request(URL!, {
      method: 'DELETE',
      headers: HEADERS,
    });
    const response = await fetch(request);
    const json = await response.json();
  };

  const deleteSequence = async (sequenceId: string) => {
    const oldSequence = userSequences.filter((sequence: any) => {
      return sequence.id === sequenceId;
    })[0];
    const sequenceTitle = oldSequence.name;
    const payload = { title: sequenceTitle };
    const URL = AUTH_ENDPOINT + `sequence`;
    const HEADERS: any = {
      'Content-Type': 'application/json',
      Authorization: token,
    };
    const request = new Request(URL!, {
      method: 'DELETE',
      headers: HEADERS,
      body: JSON.stringify(payload),
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
    } catch (err) {}
  };

  const handleLogin = async (email: string, password: string) => {
    try {
      const input = {
        username: email,
        password: password,
      };
      const response = await signIn(input);
      setAuthUpdated((oldValue) => oldValue + 1);
    } catch (err) {}
  };

  const handleSignUp = async (email: string, password: string, firstname: string, lastname: string) => {
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
    } catch (err) {}
  };

  const handleConfirmSignUp = async (email: string, code: string) => {
    try {
      const { isSignUpComplete, nextStep } = await confirmSignUp({
        username: email,
        confirmationCode: code,
      });
      setAuthUpdated((oldValue) => oldValue + 1);
    } catch (error) {}
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
