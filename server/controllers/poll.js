var User = require('../models/User.js');

var polls = [
  {
    pollId: 'bCvQ1',
    creatorId: '583dc2d1b4f828cc99787a10',
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
    votingRecord: [
      {
        userId: '583dc2d1b4f828cc99787a10',
        choice: 2
      }
    ],
  }, {
    pollId: 'bCvQ2',
    creatorId: '683dc2d1b4f828cc99787a10',
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
    votingRecord: [
      {
        userId: '583dc2d1b4f828cc99787a10',
        choice: 1
      }
    ],
  }, {
    pollId: 'bCvQ3',
    creatorId: '583dc2d1b4f828cc99787a10',
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
    votingRecord: [
      {}
    ],
  }
]


exports.getPolls = function(req, res) {
	var pollData;

	if (req.isAuthenticated() && req.user) {
		let userId = req.user._id.toString();

    pollData = polls.map(poll => {
      const userVote = poll.votingRecord
                        .filter(vote => (vote.userId === userId));

      const choiceSubmitted = userVote.length ? userVote[0].choice : null;

      const myPoll = poll.creatorId === userId;

      return (
        {
          pollId: poll.pollId,
          title: poll.title,
          choices: poll.choices,
          choiceSubmitted: choiceSubmitted,
          myPoll: myPoll
        }
      )
    });

	} else {

    pollData = polls.map(poll => (
      {
        pollId: poll.pollId,
        title: poll.title,
        choices: poll.choices,
        choiceSubmitted: null,
        myPoll: false
      }
    ));
	}

	res.json(pollData);
};


exports.postPollVote = function(req, res) {
	var { pollId, choice } = req.body;

	var pollIndex = polls.findIndex(poll => (poll.pollId === pollId))

	if (pollIndex !== -1) {

    if (req.isAuthenticated() && req.user) {
      const userId = req.user._id.toString();
      const userVote = polls[pollIndex].votingRecord
                        .filter(vote => (vote.userId === userId));
      if (userVote.length === 0) {
        polls[pollIndex].votingRecord = polls[pollIndex].votingRecord.concat([
          {
            userId: userId,
            choice: choice
          }
        ]);

        polls[pollIndex].choices[choice].votes++
      }
    } else {

      polls[pollIndex].choices[choice].votes++
    }

		res.sendStatus(200);
	} else {

		res.sendStatus(404).send({ error: 'Poll not found' });
	}
};


exports.postPollUpdate = function(req, res) {
	const { pollId, title, choices } = req.body;
	const userId = req.user._id.toString();

	var pollIndex = polls.findIndex(poll => (poll.pollId === pollId))

	if (pollIndex !== -1) {

    if (polls[pollIndex].creatorId === userId) {
      polls[pollIndex].title = title;
      polls[pollIndex].choices = choices;
      polls[pollIndex].votingRecord = [];
    }

		res.sendStatus(200);

	} else {
		polls = polls.concat([{
										pollId: pollId,
                    creatorId: userId,
										title: title,
										choices: choices,
										votingRecord: []
									}]);

		res.sendStatus(201);
	}
};


exports.deletePoll = function(req, res) {
	var { pollId } = req.body;
	polls = polls.filter(poll => (poll.pollId !== pollId))
	res.sendStatus(200);
};
