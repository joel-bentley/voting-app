import React from 'react'
import { Jumbotron } from 'react-bootstrap'

import PollList from './PollList'

const Intro = ({ polls }) => (
  <div>
    <Jumbotron>
      <h1>Voting App</h1>
      <h3>An app for voting on user generated polls</h3>
    </Jumbotron>

    <br />
    <h4>Select a poll below to vote on:</h4>
    <br />
    <PollList polls={polls} />

  </div>
)

export default Intro
