var User = require('../models/User.js');

var polls = [
  {
    pollId: 'bCvQ1',
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
    pollId: 'bCvQ2',
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
    pollId: 'bCvQ3',
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


exports.getPolls = function(req, res) {
	if (req.isAuthenticated() && req.user) {

	}
	res.json(polls);
};

exports.postPollVote = function(req, res) {
	var { pollId, choice } = req.body;

	var pollIndex = polls.findIndex(poll => (poll.pollId === pollId))

	if (pollIndex !== -1) {

		polls[pollIndex].choiceSubmitted = choice
		polls[pollIndex].choices[choice].votes++

		res.sendStatus(200);
	} else {

		res.sendStatus(404).send({ error: 'Poll not found' });
	}
};

exports.postPollUpdate = function(req, res) {
	var { pollId, title, choices } = req.body;

	var pollIndex = polls.findIndex(poll => (poll.pollId === pollId))

	if (pollIndex !== -1) {

		polls[pollIndex].title = title
		polls[pollIndex].choices = choices
		polls[pollIndex].choiceSubmitted = null

		res.sendStatus(200);
	} else {
		polls = polls.concat([{
										pollId: pollId,
										title: title,
										choices: choices,
										choiceSubmitted: null,
										myPoll: true
									}]);

		res.sendStatus(201);
	}
};

exports.deletePoll = function(req, res) {
	var { pollId } = req.body;
	polls = polls.filter(poll => (poll.pollId !== pollId))
	res.sendStatus(200);
};

// exports.getClicks = function(req, res) {
// 	User.findOne({
// 		'github.id': req.user.github.id
// 	}, {
// 		'_id': false
// 	}).exec(function(err, result) {
// 		if (err) {
// 			throw err;
// 		}
//
// 		res.json(result.nbrClicks);
// 	});
// };
//
// exports.addClick = function(req, res) {
// 	User.findOneAndUpdate({
// 		'github.id': req.user.github.id
// 	}, {
// 		$inc: {
// 			'nbrClicks.clicks': 1
// 		}
// 	}).exec(function(err, result) {
// 		if (err) {
// 			throw err;
// 		}
//
// 		res.sendStatus(200);
// 	});
// };
//
// exports.resetClicks = function(req, res) {
// 	User.findOneAndUpdate({
// 		'github.id': req.user.github.id
// 	}, {
// 		'nbrClicks.clicks': 0
// 	}).exec(function(err, result) {
// 		if (err) {
// 			throw err;
// 		}
//
// 		res.sendStatus(200);
// 	});
// };
