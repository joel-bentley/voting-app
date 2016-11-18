import React from 'react'
import { ListGroup, ListGroupItem, Panel, ProgressBar } from 'react-bootstrap'

import './PollResults.css'

const PollResults = ({ poll }) => {
  const voteCount = poll.choices.map( choice => choice.votes).reduce((a, b) => (a + b))

  return (
    <Panel header={poll.title}>
      <div>Total votes: {voteCount}</div>
      <ListGroup fill>
        {
          poll.choices.map( (choice, index) => {
            const percentage = Math.floor(100 * (choice.votes / voteCount))
            return (
              <ListGroupItem key={`results-${index}`}>
                <span>{choice.text}</span>
                &nbsp;&nbsp;
                <span>{`(${choice.votes} votes)`}</span>
                <ProgressBar label={percentage + '%'} now={percentage} />
              </ListGroupItem>
            )
          })
        }
      </ListGroup>
    </Panel>
  )
}

export default PollResults
