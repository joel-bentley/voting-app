import React from 'react'
import { Match } from 'react-router'
import MatchWhenAuthorized from './components/MatchWhenAuthorized'
//import axios from 'axios'

import { githubLogin, logout } from './utils/oauth';

import NavigationBar from './components/NavigationBar'
import Intro from './components/Intro'
import Login from './components/Login'
//import Home from './components/Home'
import Profile from './components/Profile'

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
const polls = [
  {
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

  handlePollClick = poll => {
    // this.props.router.transitionTo(`/poll/${poll.link}`)
  }

  handleVoteSubmit = () => {
    //
  }

  handlePollEditSubmit = () => {
    //
  }

  render() {
    const { router } = this.props
    const { id, username, displayName, publicRepos, avatar } = this.state

    const isAuthenticated = displayName !== ''

    return (
      <div className="App">
        <NavigationBar {...{ router, isAuthenticated, displayName, avatar }} handleLogout={this.handleLogout}/>

        <div className="container">

          <Match exactly pattern="/" component={() => (
            // isAuthenticated ? (
            //   <Home {...{ displayName, clicks }}
            //         handleCountClick={this.handleCountClick}
            //         handleResetClick={this.handleResetClick}/>
            // ) : (
              <Intro />
            // )
          )}/>

          <MatchWhenAuthorized pattern="/profile" isAuthenticated={isAuthenticated} component={() => (
            <Profile  {...{ id, username, displayName, publicRepos }}/>
          )}/>

          <Match pattern="/login" component={ props => (
            <Login {...props} {...{ isAuthenticated, router }} handleLogin={this.handleLogin}/>
          )}/>


          <Match pattern="/pollList" component={ props => (
            <PollList headerText="Select a poll below to vote on" polls={polls} handlePollClick={this.handlePollClick} />
          )}/>
          <Match pattern="/PollBallot" component={ props => (
            <PollBallot poll={polls[0]} handleVoteSubmit={this.handleVoteSubmit} />
          )}/>
          <Match pattern="/pollResults" component={ props => (
            <PollResults poll={polls[0]} />
          )}/>
          <Match pattern="/pollEdit" component={ props => (
            <PollEdit poll={polls[0]} handlePollEditSubmit={this.handlePollEditSubmit} />
          )}/>


        </div>
      </div>
    )
  }
}

export default App
