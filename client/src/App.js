import React from 'react'
import { Link, Match, Redirect } from 'react-router'
// import MatchWhenAuthorized from './components/MatchWhenAuthorized'
//import axios from 'axios'

import { githubLogin, logout } from './utils/oauth';

import NavigationBar from './components/NavigationBar'
import Intro from './components/Intro'
import Login from './components/Login'

import PollList from './components/PollList'
import PollBallot from './components/PollBallot'
import PollResults from './components/PollResults'
import PollEdit from './components/PollEdit'

import './App.css'

// const API = '/api'
// const getProfile = () => axios.get(`${API}/profile`)
// const getClicks = () => axios.get(`${API}/clicks`)
// const addClicks = () => axios.post(`${API}/clicks`)
// const resetClicks = () => axios.delete(`${API}/clicks`)


/////////////////////////////////////////
const pollData = [
  {
    permalink: 'bCvQ1',
    title: 'What is your opinion on poll 1?',
    choices: [
      {
        text: 'Option 1',
        votes: 1
      }, {
        text: 'Option 2',
        votes: 3
      }, {
        text: 'Option 3',
        votes: 10
      }
    ],
    choiceSubmitted: null,
    myPoll: true
  }, {
    permalink: 'bCvQ2',
    title: 'What is your opinion on poll 2?',
    choices: [
      {
        text: 'Option 1',
        votes: 6
      }, {
        text: 'Option 2',
        votes: 2
      }, {
        text: 'Option 3',
        votes: 1
      }
    ],
    choiceSubmitted: 1,
    myPoll: true
  }, {
    permalink: 'bCvQ3',
    title: 'What is your opinion on poll 3?',
    choices: [
      {
        text: 'Option 1',
        votes: 9
      }, {
        text: 'Option 2',
        votes: 7
      }, {
        text: 'Option 3',
        votes: 0
      }
    ],
    choiceSubmitted: null,
    myPoll: false
  }
]
/////////////////////////////////////////


class App extends React.Component {
  state = {
      id: '',
      username: '',
      displayName: '',
      avatar: '',
      polls: []
  }

  getData = () => {
    // return axios.all([ getProfile(), getClicks() ])
    //   .then(res => {
    //     const { id, username, displayName, publicRepos, avatar } = res[0].data
    //     const { clicks } = res[1].data
    //     this.setState({ id, username, displayName, publicRepos, avatar, clicks })
    //   })
    this.setState({ polls: pollData })
  }

  componentDidMount() {
    this.getData()
  }

  handleLogin = () => {
    return githubLogin()
      .then( this.getData )
      .catch(err => console.log('error:', err))
  }

  handleLogout = () => {
    return logout()
      .then( () => {
        this.setState({
          id: '',
          username: '',
          displayName: '',
          publicRepos: '',
          avatar: ''
        })
      }).catch(err => console.log('error:', err))
  }

  handleVoteSubmit = (permalink, choiceSubmitted) => {
    const { polls } = this.state
    const pollIndex = polls.findIndex(poll => (poll.permalink === permalink))

    if (pollIndex !== -1) {
      let newPolls = JSON.parse(JSON.stringify(polls))

      newPolls[pollIndex].choiceSubmitted = choiceSubmitted

      this.setState({ polls: newPolls })
    }
  }

  handlePollEditSubmit = (permalink, pollTitle, pollChoices) => {
    const { polls } = this.state
    const pollIndex = polls.findIndex(poll => (poll.permalink === permalink))

    if (pollIndex !== -1) {
      let newPolls = JSON.parse(JSON.stringify(polls))

      newPolls[pollIndex].title = pollTitle
      newPolls[pollIndex].choices = pollChoices

      this.setState({ polls: newPolls })
    }
  }

  handlePollDelete = permalink => {
    const { polls } = this.state
    const newPolls = JSON.parse(JSON.stringify(polls))
                      .filter(poll => (poll.permalink !== permalink))

    this.setState({ polls: newPolls })
  }

  handleCreateNewPoll = () => {
    const { polls } = this.state
    const { router } = this.props

    const permalink = 'aaaaaa'

    const newPolls = JSON.parse(JSON.stringify(polls))
                            .concat([{
                              permalink: permalink,
                              title: '',
                              choices: [],
                              choiceSubmitted: null,
                              myPoll: true
                            }])

    this.setState({ polls: newPolls },
       router.transitionTo(`/mypolls/edit/${permalink}`))
  }

  render() {
    const { router } = this.props
    const { polls, displayName, avatar } = this.state

    const isAuthenticated = displayName !== ''

    return (
      <div className="App">
        <NavigationBar {...{ router, isAuthenticated, displayName, avatar }} handleLogout={this.handleLogout}/>

        <div className="container">

          <Match exactly pattern="/" render={() => (
              <Intro {...{ polls }} />
          )}/>

          <Match pattern="/login" render={ props => (
            <Login {...props} {...{ isAuthenticated, router }} handleLogin={this.handleLogin}/>
          )}/>



          <Match exactly pattern="/polls/:permalink" render={ props => {
            const { permalink } = props.params
            const poll = polls.filter( poll => (poll.permalink === permalink))[0]

            return (
              poll ? (
                <PollBallot poll={poll} handleVoteSubmit={this.handleVoteSubmit} />
              ) : (
                <div>
                  <h3>Poll not found</h3>
                  <Link to="/">View available polls</Link>
                </div>
              )
            )
          } }/>

          <Match pattern="/polls/results/:permalink" render={ props => {
            const { permalink } = props.params
            const poll = polls.filter( poll => (poll.permalink === permalink))[0]

            return (
              poll && poll.choiceSubmitted ? (
                <div>
                  <PollResults poll={poll} />
                </div>
              ) : (
                <Redirect to={`/polls/${permalink}`} />
              )
            )
          } }/>


          <Match exactly pattern="/mypolls" render={ props => {
            const myPolls = polls.filter( poll => poll.myPoll )

            return (
              <PollList polls={myPolls} />
            )
          }} />

          <Match exactly pattern="/mypolls/results" render={ props => {
            const myPolls = polls.filter( poll => poll.myPoll )

            return(
              <div>
                {
                  myPolls.length > 0 ? (
                    myPolls.map( (poll, index) => (
                      <PollResults poll={poll} key={`mypoll-result-${index}`} />
                    ))
                  ) : (
                    <Redirect to="/mypolls" />
                  )
                }
              </div>
            )
          } }/>

          <Match pattern="/mypolls/results/:permalink" render={ props => {
            const { permalink } = props.params
            const poll = polls.filter( poll => (poll.permalink === permalink))[0]

            return (
              poll && poll.myPoll ? (
                <div>
                  <PollResults poll={poll} />
                </div>
              ) : (
                <Redirect to="/mypolls" />
              )
            )
          } }/>

          <Match pattern="/mypolls/edit/:permalink" render={ props => {
            const { permalink } = props.params
            const poll = polls.filter( poll => (poll.permalink === permalink))[0]

            return (
              poll && poll.myPoll ? (
                <PollEdit {...{ poll, router }} handlePollEditSubmit={this.handlePollEditSubmit} handlePollDelete={this.handlePollDelete} />
              ) : (
                <Redirect to="/mypolls" />
              )
            )
          }}/>

        </div>
      </div>
    )
  }
}

export default App
