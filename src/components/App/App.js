import React from 'react';

import DataProvider from '../DataProvider';
import UserProvider from '../UserProvider';

import Backdrop from '../Backdrop';
import DeepBackdrop from '../DeepBackdrop';
import SoundProvider from '../SoundProvider';
import History from '../History';

import Home from '../Home';
import About from '../About';
import SequenceEditor from '../SequenceEditor';

import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';

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
            <Routes>
              <Route path='/' element={<Home />} />
              <Route path='/about' element={<About />} />
              <Route path='/sequences' element={<SequenceEditor />} />
              <Route path='/history' element={<History />} />
            </Routes>
          </Router>
        </SoundProvider>
      </DataProvider>
    </UserProvider>
  );
}

export default App;
