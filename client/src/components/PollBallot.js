import React from 'react'
import { Button, Glyphicon, ListGroup, ListGroupItem, Panel, Radio } from 'react-bootstrap'
import { Link } from 'react-router'

import './PollBallot.css'

class PollBallot extends React.Component {
  state = {
    selectedItem: null,
    isSubmitting: false
  }

  componentWillMount() {
    const { poll } = this.props

    if (poll.choiceSubmitted) {
      this.setState({
        selectedItem: poll.choiceSubmitted
      })
    }
  }

  handleOptionClick = index => {
    const { poll } = this.props
    if (!poll.choiceSubmitted) {
      this.setState({ selectedItem: index})
    }
  }

  handleSubmitClick = () => {
    const { handleVoteSubmit, poll } = this.props
    const { selectedItem } = this.state

    this.setState({ isSubmitting: true })

    if (!poll.choiceSubmitted) {
      handleVoteSubmit(selectedItem)
    }

    setTimeout(() => {
      this.setState({isSubmitting: false})
    }, 2000)
  }

  render() {
    const { poll } = this.props
    const { selectedItem, isSubmitting } = this.state
    return (
      <div>
        <Panel header={poll.title}>
          <ListGroup fill>
            {
              poll.choices.map((choice, index) => {
                return (
                  <ListGroupItem onClick={() => this.handleOptionClick(index)} key={`choice-${index}`}>
                    <Radio checked={index === selectedItem}> {choice.text} </Radio>
                  </ListGroupItem>
                )
              })
            }
          </ListGroup>
        </Panel>

        {
          poll.choiceSubmitted ? (
            <div>
              <Button bsStyle="success" disabled={true}> Thank you for voting! <Glyphicon glyph="glyphicon-ok" /> </Button>
              &nbsp;&nbsp;&nbsp;
              <Link to="/">View Results</Link>
            </div>
          ) : (
            <Button bsStyle="primary" disabled={isSubmitting} onClick={() => this.handleSubmitClick()}>
              {
                isSubmitting ? (
                  <span>Submitting Vote...</span>
                ) : (
                  <span>Submit Vote</span>
                )
              }
            </Button>
          )
        }

      </div>
    )
  }
}

export default PollBallot
