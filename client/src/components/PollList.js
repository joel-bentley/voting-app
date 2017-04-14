import React from 'react';
import { Link } from 'react-router';
import { Button, Glyphicon, ListGroup, ListGroupItem } from 'react-bootstrap';

import './PollList.css';

const PollList = ({ polls }) => (
  <ListGroup>
    {polls &&
      polls.map((poll, index) => {
        const voteCount = poll.choices.length
          ? poll.choices.map(choice => choice.votes).reduce((a, b) => a + b)
          : 0;

        return (
          <div key={`poll-${index}`}>
            <Link to={`/polls/${poll.pollId}`}>
              {({ onClick }) => (
                <ListGroupItem
                  header={poll.title ? poll.title : '?'}
                  onClick={onClick}
                >
                  Total votes: {voteCount}
                </ListGroupItem>
              )}
            </Link>
            {poll.myPoll
              ? <span className="poll-edit-buttons">
                  <Link to={`/mypolls/edit/${poll.pollId}`}>
                    {({ onClick }) => (
                      <Button
                        bsStyle="warning"
                        className="poll-edit-btn"
                        onClick={onClick}
                      >
                        <Glyphicon
                          glyph="pencil"
                          title="Click here to edit this poll"
                        />
                      </Button>
                    )}
                  </Link>
                </span>
              : <div style={{ height: '27px' }} />}
          </div>
        );
      })}
  </ListGroup>
);

export default PollList;
