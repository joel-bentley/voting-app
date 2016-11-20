import React from 'react'
import { Link } from 'react-router'
import { ListGroup, ListGroupItem } from 'react-bootstrap'

const PollList = ({ polls }) => (
  <ListGroup>
    {
      polls.map((poll, index) => {
        const voteCount = poll.choices.map( choice => choice.votes).reduce((a, b) => (a + b))
        return (
          <Link to={`/${poll.permalink}`}>{({ onClick }) => (
              <ListGroupItem header={poll.title} onClick={onClick} key={`poll-${index}`}>
                Total votes: {voteCount}
              </ListGroupItem>
            )}
          </Link>
        )
      })
    }
  </ListGroup>
)

export default PollList
