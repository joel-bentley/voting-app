import React from 'react';

import Link from 'react-router/Link';

import Button from 'react-bootstrap/lib/Button';
import Glyphicon from 'react-bootstrap/lib/Glyphicon';
import ListGroup from 'react-bootstrap/lib/ListGroup';
import ListGroupItem from 'react-bootstrap/lib/ListGroupItem';

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
            {poll.myPoll ? (
              <span className="poll-edit-buttons">
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
            ) : (
              <div style={{ height: '27px' }} />
            )}
          </div>
        );
      })}
  </ListGroup>
);

export default PollList;
