import React from 'react';

import Button from 'react-bootstrap/lib/Button';
import Glyphicon from 'react-bootstrap/lib/Glyphicon';
import ListGroup from 'react-bootstrap/lib/ListGroup';
import ListGroupItem from 'react-bootstrap/lib/ListGroupItem';
import Modal from 'react-bootstrap/lib/Modal';
import Panel from 'react-bootstrap/lib/Panel';

import ControlledInput from './ControlledInput';

class PollEdit extends React.Component {
  state = {
    polltitle: null,
    pollChoices: [],
    titleInputValue: '',
    showModal: false,
  };

  componentWillMount() {
    const { poll } = this.props;
    if (typeof poll === 'object') {
      this.setState({ pollTitle: poll.title, pollChoices: poll.choices });
    }
  }

  handleTitleSubmitClick = newTitle => {
    this.setState({ pollTitle: newTitle });
  };

  handleTitleEditIconClick = () => {
    this.setState({ titleInputValue: this.state.pollTitle, pollTitle: null });
  };

  handleDeleteChoice = choiceIndex => {
    const { pollChoices } = this.state;
    const newChoiceList = pollChoices
      .filter((element, index) => index !== choiceIndex)
      .map(choice => {
        choice.votes = 0;
        return choice;
      });
    this.setState({ pollChoices: newChoiceList });
  };

  handleAddChoice = newChoiceText => {
    const { pollChoices } = this.state;
    const newChoiceList = pollChoices.concat([
      { text: newChoiceText, votes: 0 },
    ]);
    this.setState({ pollChoices: newChoiceList });
  };

  handleChoiceSubmitClick = newChoice => {
    if (newChoice !== '') {
      this.handleAddChoice(newChoice);
    }
  };

  handlePollSubmitClick = () => {
    const { poll, router, handlePollEditSubmit } = this.props;
    const { pollTitle, pollChoices } = this.state;

    handlePollEditSubmit(poll.pollId, pollTitle, pollChoices);
    router.transitionTo('/mypolls');
  };

  handlePollDeleteConfirm = () => {
    const { poll, router, handlePollDelete } = this.props;

    this.setState({ showModal: false });
    handlePollDelete(poll.pollId);
    router.transitionTo('/mypolls');
  };

  render() {
    const { pollTitle, pollChoices } = this.state;

    const panelHeader = pollTitle ? (
      <div>
        <span>{pollTitle}</span>
        <span style={{ float: 'right' }}>
          <Glyphicon
            glyph="pencil"
            title="Click here to edit poll question"
            onClick={this.handleTitleEditIconClick}
          />
        </span>
      </div>
    ) : (
      <ControlledInput
        placeholder="Enter poll question here"
        onSubmit={this.handleTitleSubmitClick}
        inputValue={this.state.titleInputValue}
        buttonText="Submit poll question"
      />
    );

    return (
      <div>
        <Panel header={panelHeader}>
          <ListGroup>
            {pollChoices.map((choice, index) => (
              <ListGroupItem key={`choice-editor-${index}`}>
                {choice.text}
                <span style={{ float: 'right' }}>
                  <Glyphicon
                    glyph="remove"
                    title="Click here to remove this poll answer"
                    onClick={() => this.handleDeleteChoice(index)}
                  />
                </span>
              </ListGroupItem>
            ))}
          </ListGroup>
        </Panel>
        <ControlledInput
          placeholder="Enter new poll answer here"
          onSubmit={this.handleChoiceSubmitClick}
          buttonText="Submit choice"
        />
        <br />
        {pollTitle !== '' && pollChoices.length > 1 ? (
          <Button
            bsStyle="primary"
            onClick={() => this.handlePollSubmitClick()}
          >
            Submit this poll
          </Button>
        ) : (
          <Button bsStyle="warning" disabled={true}>
            To submit poll, first enter question and multiple answers above
          </Button>
        )}
        <span style={{ float: 'right' }}>
          <Button
            bsStyle="danger"
            onClick={() => this.setState({ showModal: true })}
          >
            <Glyphicon glyph="remove" title="Click here to remove this poll" />
            <span>Delete poll</span>
          </Button>
        </span>
        <Modal
          show={this.state.showModal}
          onHide={() => this.setState({ showModal: false })}
        >
          <Modal.Header>
            <Modal.Title>Confirm Poll Deletion</Modal.Title>
          </Modal.Header>
          <Modal.Body>Are you sure you want to delete this poll?</Modal.Body>
          <Modal.Footer>
            <Button onClick={() => this.setState({ showModal: false })}>
              Cancel
            </Button>
            <Button bsStyle="danger" onClick={this.handlePollDeleteConfirm}>
              Permanently delete this poll
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
    );
  }
}

export default PollEdit;
