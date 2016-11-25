import React from 'react'
import { Link } from 'react-router'
import { Button, Glyphicon, ListGroup, ListGroupItem } from 'react-bootstrap'

import './PollList.css'


const PollList = ({ polls }) => (
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
                  <Link to={`/mypolls/edit/${poll.permalink}`}>{({ onClick }) => (
                      <Button bsStyle="warning" className="poll-edit-btn" onClick={onClick}>
                        <Glyphicon glyph="pencil" title="Click here to edit this poll"  />
                      </Button>
                    )}
                  </Link>
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
