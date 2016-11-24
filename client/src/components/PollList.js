import React from 'react'
import { Link } from 'react-router'
import { Button, Glyphicon, ListGroup, ListGroupItem, Modal} from 'react-bootstrap'

import './PollList.css'

const handleEditIconClick = () => {
  //`/mypolls/edit/${permalink}`
  console.log('handleEditIconClick')
}

const handleDeleteIconClick = () => {
  console.log('handleDeleteIconClick')
}

// Make PollList into

const PollList = ({ polls, handlePollDelete }) => (
  <ListGroup>
    {
      polls.map((poll, index) => {
        const voteCount = poll.choices.map( choice => choice.votes).reduce((a, b) => (a + b))

        return (
          <div key={`poll-${index}`}>

            <Link to={`/polls/${poll.permalink}`}>{({ onClick }) => (
                <ListGroupItem header={poll.title} onClick={onClick}>
                  Total votes: {voteCount}
                </ListGroupItem>
              )}
            </Link>

            {
              poll.myPoll ? (
                <span className="poll-edit-buttons">
                  <Button bsStyle="warning" onClick={() => handleEditIconClick(poll.permalink)}>
                    <Glyphicon glyph="pencil" title="Click here to edit this poll"  />
                  </Button>
                  &nbsp;&nbsp;&nbsp;
                  <Button bsStyle="danger" onClick={() => handleDeleteIconClick(poll.permalink)}>
                    <Glyphicon glyph="remove" title="Click here to remove this poll" />
                  </Button>
                </span>
              ) : (
                <div style={{ height: '27px' }}></div>
              )
            }

          </div>
        )
      })
    }
  </ListGroup>
)

export default PollList
