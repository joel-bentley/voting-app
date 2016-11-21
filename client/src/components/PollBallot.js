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

    if (!poll.choiceSubmitted && selectedItem) {

      this.setState({ isSubmitting: true })
      handleVoteSubmit(selectedItem)

      setTimeout(() => {
        this.setState({isSubmitting: false})
      }, 2000)
    }
  }

  render() {
    const { poll } = this.props
    const { selectedItem, isSubmitting } = this.state
    const twitterHref = 'http://twitter.com/share?text=' +
                        `${poll.title}${'%0A'}Vote here: ` +
                        `&url=${window.location.href}`
    return (
      <div>
        <span style={{float: 'right'}}>
          <Button
            bsStyle="primary"
            href={twitterHref}
            target="_blank">
            Share poll on Twitter
          </Button>
        </span>
        <Panel header={poll.title}>
          <ListGroup fill>
            {
              poll.choices.map((choice, index) => {
                const choiceSubmitted = index === selectedItem
                return (
                  <ListGroupItem onClick={() => this.handleOptionClick(index)} key={`choice-${index}`}>
                    <Radio checked={choiceSubmitted} readOnly={choiceSubmitted}> {choice.text} </Radio>
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
              <Link to={`/${poll.permalink}/results`}>View Results</Link>
            </div>
          ) : (

            isSubmitting ? (
              <Button bsStyle="primary">
                Submitting Vote...
              </Button>
            ) : (
              <div>
                <Button bsStyle="primary" onClick={() => this.handleSubmitClick()}>
                  Submit Vote
                </Button>
                &nbsp;&nbsp;&nbsp;
                <span>You can view results after you vote</span>
              </div>
            )
          )
        }

      </div>
    )
  }
}

export default PollBallot
