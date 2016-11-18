import React from 'react'
import {
    Button,
    FormControl,
    Glyphicon,
    InputGroup,
    ListGroup,
    ListGroupItem,
    Panel
  } from 'react-bootstrap'

class PollEdit extends React.Component {
  state = {
    polltitle: null,
    pollChoices: [],
    isSubmitting: false,
    titleInputValue: '',
    choiceInputValue: ''
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

  handleTitleInputChange = event => {
    this.setState({ titleInputValue: event.target.value })
  }

  handleTitleInputKeyDown = event => {
    if (event.keyCode === 13) {
      this.handleTitleSubmitClick()
    }
  }

  handleTitleSubmitClick = () => {
    this.setState({ pollTitle: this.state.titleInputValue })
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

  handleChoiceInputChange = event => {
    this.setState({ choiceInputValue: event.target.value })
  }

  handleChoiceInputKeyDown = event => {
    if (event.keyCode === 13) {
      this.handleChoiceSubmitClick()
    }
  }

  handleChoiceSubmitClick = () => {
    const { choiceInputValue } = this.state

    if (choiceInputValue !== '') {
      this.handleAddChoice(choiceInputValue)
      this.setState({ choiceInputValue: '' })
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
        <InputGroup>
          <FormControl
            type="text"
            placeholder="Enter poll question here"
            value={this.state.titleInputValue}
            onChange={this.handleTitleInputChange}
            onKeyDown={this.handleTitleInputKeyDown}
           />
          <InputGroup.Button>
            <Button bsStyle="primary" onClick={this.handleTitleSubmitClick}>
              Submit
            </Button>
          </InputGroup.Button>
        </InputGroup>
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

        <InputGroup>
          <FormControl
            type="text"
            placeholder="Enter new poll answer here"
            value={this.state.choiceInputValue}
            onChange={this.handleChoiceInputChange}
            onKeyDown={this.handleChoiceInputKeyDown}
           />
          <InputGroup.Button>
            <Button bsStyle="primary" onClick={this.handleChoiceSubmitClick}>
              Submit
            </Button>
          </InputGroup.Button>
        </InputGroup><br />

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
