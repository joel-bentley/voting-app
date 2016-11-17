import React from 'react'
import { ListGroup, ListGroupItem, Panel } from 'react-bootstrap'

const PollEdit = ({ headerText, polls, handlePollClick }) => (
  <Panel header={headerText}>
      <ListGroup fill>
        {
          polls.map(poll => (
            <ListGroupItem header={poll.title} onClick={() => handlePollClick(poll)}>
              Total Votes: {poll.voteCount}
            </ListGroupItem>
          ))
        }
      </ListGroup>
    </Panel>
)

export default PollEdit
