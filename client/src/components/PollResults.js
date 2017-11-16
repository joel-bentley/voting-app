import React from 'react';

import ListGroup from 'react-bootstrap/lib/ListGroup';
import ListGroupItem from 'react-bootstrap/lib/ListGroupItem';
import Panel from 'react-bootstrap/lib/Panel';
import ProgressBar from 'react-bootstrap/lib/ProgressBar';

import './PollResults.css';

const PollResults = ({ poll }) => {
  const voteCount = poll.choices
    .map(choice => choice.votes)
    .reduce((a, b) => a + b);

  return (
    <Panel header={poll.title}>
      <div>Total votes: {voteCount}</div>
      <ListGroup fill>
        {poll.choices.map((choice, index) => {
          const percentage = Math.floor(100 * (choice.votes / voteCount));
          return (
            <ListGroupItem key={`results-${index}`}>
              <span>{choice.text}</span>
              <span style={{ marginLeft: 15 }}>{`(${
                choice.votes
              } votes)`}</span>
              <ProgressBar label={percentage + '%'} now={percentage} />
            </ListGroupItem>
          );
        })}
      </ListGroup>
    </Panel>
  );
};

export default PollResults;
