import React from 'react'
import {
    Button,
    Glyphicon,
    ListGroup,
    ListGroupItem,
    Panel
  } from 'react-bootstrap'

import ControlledInput from './ControlledInput'

class PollEdit extends React.Component {
  state = {
    polltitle: null,
    pollChoices: [],
    isSubmitting: false,
    titleInputValue: '',
  }

  componentWillMount() {
    const { poll } = this.props
    if (typeof poll === 'object') {
      this.setState({
        pollTitle: poll.title,
        pollChoices: poll.choices
      })
    }
  }

  handleTitleSubmitClick = (newTitle) => {
    this.setState({ pollTitle: newTitle })
  }

  handleTitleEditIconClick = () => {
    this.setState({
      titleInputValue: this.state.pollTitle,
      pollTitle: null
    })
  }

  handleDeleteChoice = (choiceIndex) => {
    const { pollChoices } = this.state
    const newChoiceList = JSON.parse(JSON.stringify(pollChoices))
                            .filter((element, index) => (index !== choiceIndex))
    this.setState({ pollChoices: newChoiceList })
  }

  handleAddChoice = (newChoiceText) => {
    const { pollChoices } = this.state
    const newChoiceList = JSON.parse(JSON.stringify(pollChoices))
                            .concat([{
                              text: newChoiceText,
                              votes: 0
                            }])
    this.setState({ pollChoices: newChoiceList })
  }

  handleChoiceSubmitClick = (newChoice) => {
    if (newChoice !== '') {
      this.handleAddChoice(newChoice)
    }
  }

  handlePollSubmitClick = () => {
    const { handlePollEditSubmit } = this.props
    const { pollTitle, pollChoices } = this.state

    this.setState({ isSubmitting: true })

    handlePollEditSubmit(pollTitle, pollChoices)

    setTimeout(() => {
      this.setState({ isSubmitting: false })
    }, 2000)
  }

  render() {
    const { pollTitle, pollChoices, isSubmitting } = this.state

    const panelTitle = pollTitle ? (
      <div>
        <span>{pollTitle}</span>
        &nbsp;&nbsp;
        <span style={{float: 'right'}}>
          <Glyphicon glyph="pencil" title="Click here to edit poll question" onClick={this.handleTitleEditIconClick} />
        </span>
      </div>
    ) : (
      <ControlledInput
        placeholder="Enter poll question here"
        onSubmit={this.handleTitleSubmitClick}
        inputValue={this.state.titleInputValue}
        buttonText="Submit"
      />
    )

    return (
      <div>
        <Panel header={panelTitle}>
          <ListGroup>
            {
              pollChoices.map((choice, index) => (
                <ListGroupItem key={`choice-editor-${index}`}>
                  {choice.text}
                  <span style={{float: 'right'}}>
                    <Glyphicon glyph="remove" title="Click here to remove this poll answer" onClick={() => this.handleDeleteChoice(index)} />
                  </span>
                </ListGroupItem>
              ))
            }
          </ListGroup>
        </Panel>

        <ControlledInput
          placeholder="Enter new poll answer here"
          onSubmit={this.handleChoiceSubmitClick}
          buttonText="Submit"
        />

        <br />

        <Button bsStyle="primary" disabled={isSubmitting} onClick={this.handlePollSubmitClick}>
          {
            isSubmitting ? (
              <span>Submitting poll...</span>
            ) : (
              <span>Submit this poll</span>
            )
          }
        </Button>
      </div>
    )
  }
}

export default PollEdit
