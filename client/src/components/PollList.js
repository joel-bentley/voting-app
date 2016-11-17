import React from 'react'
import { ListGroup, ListGroupItem, Panel } from 'react-bootstrap'

const PollList = ({ headerText, polls, handlePollClick }) => (
  <Panel header={headerText}>
      <ListGroup fill>
        {
          polls.map((poll, index) => {
            const voteCount = poll.choices.map( choice => choice.votes).reduce((a, b) => (a + b))
            return (
              <ListGroupItem header={poll.title} onClick={() => handlePollClick(poll)} key={`poll-${index}`}>
                Total votes: {voteCount}
              </ListGroupItem>
            )
          })
        }
      </ListGroup>
    </Panel>
)

export default PollList
