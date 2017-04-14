import React from 'react';
import { Link, Match, Redirect } from 'react-router';
import { Button } from 'react-bootstrap';
import MatchWhenAuthorized from './components/MatchWhenAuthorized';
import axios from 'axios';

import { githubLogin, logout } from './utils/oauth';

import NavigationBar from './components/NavigationBar';
import Intro from './components/Intro';
import Login from './components/Login';

import PollList from './components/PollList';
import PollBallot from './components/PollBallot';
import PollResults from './components/PollResults';
import PollEdit from './components/PollEdit';

const POLL_ID_LENGTH = 5;
const POLL_ID_CHAR = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz123456789';

const API = '/api';
const getProfile = () => axios.get(`${API}/profile`);
const getPolls = () => axios.get(`${API}/polls`);
const postPollVote = (pollId, choice) =>
  axios.post(`${API}/poll`, { pollId, choice });
const postPollUpdate = (pollId, title, choices) =>
  axios.post(`${API}/poll/update`, { pollId, title, choices });
const deletePoll = pollId => axios.delete(`${API}/poll/update`, { pollId });

const generateRandomId = (length, characters) => {
  return Array.apply(null, Array(length))
    .map(() => characters[Math.floor(Math.random() * characters.length)])
    .join('');
};

class App extends React.Component {
  state = { userId: '', username: '', displayName: '', avatar: '', polls: [] };

  getData = () => {
    return axios
      .all([getProfile(), getPolls()])
      .then(res => {
        const { userId, username, displayName, avatar } = res[0].data;
        const polls = res[1].data;
        // console.dir({polls})
        this.setState({ userId, username, displayName, avatar, polls });
      })
      .catch(err => console.error('error:', err));
  };

  componentDidMount() {
    this.getData();
  }

  handleLogin = () => {
    return githubLogin().then(this.getData);
  };

  handleLogout = () => {
    return logout()
      .then(() => {
        let newPolls = this.state.polls.map(poll => {
          poll.myPoll = false;

          return poll;
        });

        this.setState({
          userId: '',
          username: '',
          displayName: '',
          avatar: '',
          polls: newPolls,
        });
      })
      .catch(err => console.error('error:', err));
  };

  handleVoteSubmit = (pollId, choiceSubmitted) => {
    const { polls } = this.state;
    const pollIndex = polls.findIndex(poll => poll.pollId === pollId);

    if (pollIndex !== -1) {
      let newPolls = JSON.parse(JSON.stringify(polls));

      newPolls[pollIndex].choiceSubmitted = choiceSubmitted;
      newPolls[pollIndex].choices[choiceSubmitted].votes++;

      this.setState({ polls: newPolls });

      postPollVote(pollId, choiceSubmitted).catch(err =>
        console.error('error:', err));
    }
  };

  handlePollEditSubmit = (pollId, pollTitle, pollChoices) => {
    const { polls } = this.state;
    const pollIndex = polls.findIndex(poll => poll.pollId === pollId);
    let newPolls;

    // Set vote counts to zero after editing poll (?)
    // pollChoices.forEach(choice => {choice.votes = 0})
    if (pollIndex !== -1) {
      newPolls = JSON.parse(JSON.stringify(polls));

      newPolls[pollIndex].title = pollTitle;
      newPolls[pollIndex].choices = pollChoices;
      newPolls[pollIndex].choiceSubmitted = null;
    } else {
      newPolls = polls.concat([
        {
          pollId: pollId,
          title: pollTitle,
          choices: pollChoices,
          choiceSubmitted: null,
          myPoll: true,
        },
      ]);
    }

    this.setState({ polls: newPolls });

    postPollUpdate(pollId, pollTitle, pollChoices).catch(err =>
      console.error('error:', err));
  };

  handlePollDelete = pollId => {
    const { polls } = this.state;
    const newPolls = polls.filter(poll => poll.pollId !== pollId);

    this.setState({ polls: newPolls });

    deletePoll(pollId).catch(err => console.error('error:', err));
  };

  render() {
    const { router } = this.props;
    const { polls, displayName, avatar } = this.state;

    const isAuthenticated = displayName !== '';

    return (
      <div className="App">
        <NavigationBar
          {...{ router, isAuthenticated, displayName, avatar }}
          handleLogout={this.handleLogout}
        />
        <div className="container">
          <Match exactly pattern="/" render={() => <Intro {...{ polls }} />} />
          <Match
            pattern="/login"
            render={props => (
              <Login
                {...props}
                {...{ isAuthenticated, router }}
                handleLogin={this.handleLogin}
              />
            )}
          />
          <Match
            exactly
            pattern="/polls/:pollId"
            render={props => {
              const { pollId } = props.params;
              const poll = polls.filter(poll => poll.pollId === pollId)[0];

              return poll
                ? <PollBallot
                    poll={poll}
                    handleVoteSubmit={this.handleVoteSubmit}
                  />
                : <div>
                    <h3>Poll not found</h3>
                    <Link to="/">View available polls</Link>
                  </div>;
            }}
          />
          <Match
            pattern="/polls/results/:pollId"
            render={props => {
              const { pollId } = props.params;
              const poll = polls.filter(poll => poll.pollId === pollId)[0];

              return poll && poll.choiceSubmitted !== null
                ? <div>
                    <PollResults poll={poll} />
                  </div>
                : <div>
                    <Redirect to={`/polls/${pollId}`} />
                  </div>;
            }}
          />
          <MatchWhenAuthorized
            exactly
            pattern="/mypolls"
            isAuthenticated={isAuthenticated}
            render={props => {
              const myPolls = polls.filter(poll => poll.myPoll);

              return (
                <div>
                  <Link to="/mypolls/new">
                    {({ onClick }) => (
                      <Button onClick={onClick}>
                        Create new poll
                      </Button>
                    )}
                  </Link>
                  <div style={{ height: '27px' }} />
                  <PollList polls={myPolls} />
                </div>
              );
            }}
          />
          <MatchWhenAuthorized
            exactly
            pattern="/mypolls/results"
            isAuthenticated={isAuthenticated}
            render={props => {
              const myPolls = polls.filter(poll => poll.myPoll);

              return (
                <div>
                  {myPolls.length > 0
                    ? myPolls.map((poll, index) => (
                        <PollResults
                          poll={poll}
                          key={`mypoll-result-${index}`}
                        />
                      ))
                    : <Redirect to="/mypolls" />}
                </div>
              );
            }}
          />
          <MatchWhenAuthorized
            pattern="/mypolls/results/:pollId"
            isAuthenticated={isAuthenticated}
            render={props => {
              const { pollId } = props.params;
              const poll = polls.filter(poll => poll.pollId === pollId)[0];

              return poll && poll.myPoll
                ? <div>
                    <PollResults poll={poll} />
                  </div>
                : <Redirect to="/mypolls" />;
            }}
          />
          <MatchWhenAuthorized
            pattern="/mypolls/edit/:pollId"
            isAuthenticated={isAuthenticated}
            render={props => {
              const { pollId } = props.params;
              const poll = polls.filter(poll => poll.pollId === pollId)[0];

              return poll && poll.myPoll
                ? <PollEdit
                    {...{ poll, router }}
                    handlePollEditSubmit={this.handlePollEditSubmit}
                    handlePollDelete={this.handlePollDelete}
                  />
                : <Redirect to="/mypolls" />;
            }}
          />
          <MatchWhenAuthorized
            pattern="/mypolls/new"
            isAuthenticated={isAuthenticated}
            render={props => {
              let pollId;
              const pollIdEqualTest = poll => poll.pollId === pollId;

              do {
                pollId = generateRandomId(POLL_ID_LENGTH, POLL_ID_CHAR);
              } while (polls.filter(pollIdEqualTest).length);

              const poll = {
                pollId: pollId,
                title: '',
                choices: [],
                choiceSubmitted: null,
                myPoll: true,
              };

              return (
                <PollEdit
                  {...{ poll, router }}
                  handlePollEditSubmit={this.handlePollEditSubmit}
                  handlePollDelete={this.handlePollDelete}
                />
              );
            }}
          />
        </div>
      </div>
    );
  }
}

export default App;
