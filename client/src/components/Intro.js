import React from 'react';
import { Jumbotron } from 'react-bootstrap';

import PollList from './PollList';

const Intro = ({ polls }) => (
  <div>
    <Jumbotron
      style={
        { paddingTop: '5px', paddingBottom: '30px', backgroundColor: '#eee' }
      }
    >
      <h1>Voting App</h1>
      <h3>An app for voting on user generated polls</h3>
    </Jumbotron>
    <div className="text-center">
      <h4>Select a poll below to vote.</h4>
      <h4>After voting you will be able to view poll results.</h4>
      <h4>Log in above to create and edit your own polls!</h4>
    </div>
    <br />
    <PollList polls={polls} />
  </div>
);

export default Intro;
