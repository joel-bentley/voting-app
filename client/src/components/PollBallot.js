import React from 'react';

import Button from 'react-bootstrap/lib/Button';
import Glyphicon from 'react-bootstrap/lib/Glyphicon';
import ListGroup from 'react-bootstrap/lib/ListGroup';
import ListGroupItem from 'react-bootstrap/lib/ListGroupItem';
import Panel from 'react-bootstrap/lib/Panel';
import Radio from 'react-bootstrap/lib/Radio';

import Link from 'react-router/Link';

import './PollBallot.css';

class PollBallot extends React.Component {
  state = { poll: {}, selectedItem: null, isSubmitting: false };

  componentWillMount() {
    const { poll } = this.props;

    this.setState({ poll });

    if (poll.choiceSubmitted !== null) {
      this.setState({ selectedItem: poll.choiceSubmitted });
    }
  }

  handleOptionClick = index => {
    const { poll } = this.state;
    if (poll.choiceSubmitted === null) {
      this.setState({ selectedItem: index });
    }
  };

  handleSubmitClick = () => {
    const { handleVoteSubmit } = this.props;
    const { poll, selectedItem } = this.state;

    if (poll.choiceSubmitted === null && selectedItem !== null) {
      let newPoll = JSON.parse(JSON.stringify(poll));
      newPoll.choiceSubmitted = selectedItem;

      this.setState({ isSubmitting: true, poll: newPoll });
      handleVoteSubmit(poll.pollId, selectedItem);
      // setTimeout(() => {
      //   this.setState({isSubmitting: false})
      // }, 2000)
    }
  };

  render() {
    const { poll, selectedItem, isSubmitting } = this.state;
    const twitterHref = 'http://twitter.com/share?text=' +
      `${poll.title}${'%0A'}Vote here: ` +
      `&url=${window.location.href}`;
    return (
      <div>
        <span className="pull-right">
          <Button bsStyle="primary" href={twitterHref} target="_blank">
            Share this poll on Twitter
          </Button>
        </span>
        <Panel header={poll.title}>
          <ListGroup fill>
            {poll.choices.map((choice, index) => {
              const isSubmitted = index === selectedItem;
              return (
                <ListGroupItem
                  onClick={() => this.handleOptionClick(index)}
                  key={`choice-${index}`}
                >
                  <Radio checked={isSubmitted} readOnly={isSubmitted}>
                    {choice.text}
                  </Radio>
                </ListGroupItem>
              );
            })}
          </ListGroup>
        </Panel>
        {poll.choiceSubmitted !== null
          ? <div>
              <Button bsStyle="success" disabled={true}>
                Thank you for voting! <Glyphicon glyph="glyphicon-ok" />
              </Button>
              <Link to={`/polls/results/${poll.pollId}`}>
                <span style={{ marginLeft: 15 }}>View Poll Results</span>
              </Link>
            </div>
          : isSubmitting
              ? <Button bsStyle="primary">
                  Submitting Vote...
                </Button>
              : <div>
                  <Button
                    bsStyle="primary"
                    onClick={() => this.handleSubmitClick()}
                  >
                    Submit Vote
                  </Button>
                  <span style={{ marginLeft: 15 }}>
                    View results after you vote
                  </span>
                </div>}
      </div>
    );
  }
}

export default PollBallot;
