import React from 'react';

import DataProvider from '../DataProvider';
import UserProvider from '../UserProvider';

import Backdrop from '../Backdrop';
import DeepBackdrop from '../DeepBackdrop';
import SoundProvider from '../SoundProvider';
import History from '../History';

import Home from '../Home';
import About from '../About';
import Sequences from '../Sequences';

import { BrowserRouter as Router, Route, Switch, Link } from 'react-router-dom';

// import { withAuthenticator, Button, Heading } from '@aws-amplify/ui-react';
// import '@aws-amplify/ui-react/styles.css';

function App() {
  return (
    <UserProvider>
      <DataProvider>
        <SoundProvider>
          <Router>
            <DeepBackdrop />
            <Backdrop />
            <Switch>
              <Route exact path='/' component={Home} />
              <Route path='/about' component={About} />
              <Route path='/sequences' component={Sequences} />
              <Route path='/history' component={History} />
            </Switch>
          </Router>
        </SoundProvider>
      </DataProvider>
    </UserProvider>
  );
}

export default App;
