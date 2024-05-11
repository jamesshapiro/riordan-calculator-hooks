import Header from '../Header';
import React from 'react';

import DataProvider from '../DataProvider';
import UserProvider from '../UserProvider';

import Sequence from '../Sequence';
import SequenceControlPanel from '../SequenceControlPanel';
import UserHistory from '../UserHistory/UserHistory';

import { LayoutGroup } from 'framer-motion';

import styled from 'styled-components';
import ModeComboBox from '../ModeComboBox';
import SubmitButton from '../SubmitButton';
import Matrix from '../Matrix';
import Backdrop from '../Backdrop';
import DeepBackdrop from '../DeepBackdrop';
import NavBar from '../NavBar';
import WindowControls from '../WindowControls';
import MatrixHeader from '../MatrixHeader';
import SoundProvider from '../SoundProvider';
import StatsDisplay from '../StatsDisplay';
import ShareDialog from '../ShareDialog';
import StarSequence from '../StarSequence';
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

const BottomSpace = styled.div`
  height: 100px;
`;

const HeaderDiv = styled.div`
  align-self: flex-start;
  padding-left: 300px;
`;

const LeftDiv = styled.div`
  align-self: flex-start;
`;

const CenterDiv = styled.div`
  align-self: flex-start;
`;

const FlexColumnWrapper = styled.div`
  padding-left: 35px;
  display: flex;
  flex-direction: column;
  height: 100%;
  width: 100%;
  align-items: center;
  /* background-color: hsl(240, 40%, 90%); */
  margin-left: 0px;
`;

const FlexRowWrapper = styled.div`
  display: flex;
  flex-direction: row;
  align-self: flex-start;
`;

const TableWrapper = styled.table`
  margin-left: 10px;
  padding-top: 13px;
`;
