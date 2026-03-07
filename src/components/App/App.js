import React from 'react';

import DataProvider from '../DataProvider';
import UserProvider from '../UserProvider';

import Backdrop from '../Backdrop';
import DeepBackdrop from '../DeepBackdrop';
import History from '../History';

import Home from '../Home';
import About from '../About';
import Papers from '../Papers';
import SequenceEditor from '../SequenceEditor';

import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

function App() {
  return (
    <UserProvider>
      <DataProvider>
          <Router>
            <DeepBackdrop />
            <Backdrop />
            <Routes>
              <Route path='/' element={<Home />} />
              <Route path='/about' element={<About />} />
              <Route path='/papers' element={<Papers />} />
              <Route path='/sequences' element={<SequenceEditor />} />
              <Route path='/history' element={<History />} />
            </Routes>
          </Router>
      </DataProvider>
    </UserProvider>
  );
}

export default App;
