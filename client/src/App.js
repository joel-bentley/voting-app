import React from 'react'
import { Link, Match, Redirect } from 'react-router'
// import MatchWhenAuthorized from './components/MatchWhenAuthorized'
//import axios from 'axios'

import { githubLogin, logout } from './utils/oauth';

import NavigationBar from './components/NavigationBar'
import Intro from './components/Intro'
import Login from './components/Login'
//import Home from './components/Home'

//import PollList from './components/PollList'
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
const polls = [
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
    choiceSubmitted: null
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
    choiceSubmitted: 1
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
    choiceSubmitted: null
  }
]
/////////////////////////////////////////


class App extends React.Component {
  state = {
      id: '',
      username: '',
      displayName: '',
      publicRepos: '',
      avatar: '',
      clicks: 0
  }

  getData = () => {
    // return axios.all([ getProfile(), getClicks() ])
    //   .then(res => {
    //     const { id, username, displayName, publicRepos, avatar } = res[0].data
    //     const { clicks } = res[1].data
    //     this.setState({ id, username, displayName, publicRepos, avatar, clicks })
    //   })
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

  handleVoteSubmit = () => {
    //
  }

  handlePollEditSubmit = () => {
    //
  }

  render() {
    const { router } = this.props
    const { displayName, avatar } = this.state

    const isAuthenticated = displayName !== ''

    return (
      <div className="App">
        <NavigationBar {...{ router, isAuthenticated, displayName, avatar }} handleLogout={this.handleLogout}/>

        <div className="container">

          <Match exactly pattern="/" component={() => (
              <Intro {...{ polls }} />
          )}/>

          <Match pattern="/login" component={ props => (
            <Login {...props} {...{ isAuthenticated, router }} handleLogin={this.handleLogin}/>
          )}/>



          <Match pattern="/pollEdit" component={ props => (
            <PollEdit poll={polls[0]} handlePollEditSubmit={this.handlePollEditSubmit} />
          )}/>



          <Match exactly pattern="/:permalink" component={ props => {
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

          <Match pattern="/:permalink/results" component={ props => {
            const { permalink } = props.params
            const poll = polls.filter( poll => (poll.permalink === permalink))[0]

            return (
              poll.choiceSubmitted ? (
                <PollResults poll={poll} />
              ) : (
                <Redirect to={`/${permalink}`} />
              )
            )
          } }/>
          
        </div>
      </div>
    )
  }
}

export default App
