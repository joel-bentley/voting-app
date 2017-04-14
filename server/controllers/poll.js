var User = require('../models/User.js');
var Poll = require('../models/Poll.js');

exports.getPolls = function(req, res) {
  var pollData;

  Poll.find(function(err, polls) {
    if (err) return console.error(err);

    if (req.isAuthenticated() && req.user) {
      var userId = req.user._id.toString();

      pollData = polls.map(poll => {
        var userVote = poll.votingRecord.filter(vote => vote.userId === userId);

        var choiceSubmitted = userVote.length ? userVote[0].choice : null;

        var myPoll = poll.creatorId === userId;

        return {
          pollId: poll.pollId,
          title: poll.title,
          choices: poll.choices,
          choiceSubmitted: choiceSubmitted,
          myPoll: myPoll,
        };
      });
    } else {
      pollData = polls.map(poll => ({
        pollId: poll.pollId,
        title: poll.title,
        choices: poll.choices,
        choiceSubmitted: null,
        myPoll: false,
      }));
    }

    res.json(pollData);
  });
};

exports.postPollVote = function(req, res) {
  var { pollId, choice } = req.body;

  var incObject = {};
  incObject['choices.' + choice + '.votes'] = 1; // {'choices.<index>.votes': 1}

  if (req.isAuthenticated() && req.user) {
    var userId = req.user._id.toString();

    Poll.findOneAndUpdate(
      {
        pollId: pollId,
      },
      {
        $inc: incObject,
        $addToSet: {
          votingRecord: {
            userId: userId,
            choice: choice,
          },
        },
      }
    ).exec(function(err, result) {
      if (err) return console.error(err);

      res.sendStatus(200);
    });
  } else {
    Poll.findOneAndUpdate(
      {
        pollId: pollId,
      },
      {
        $inc: incObject,
      }
    ).exec(function(err, result) {
      if (err) return console.error(err);

      res.sendStatus(200);
    });
  }
};

exports.postPollUpdate = function(req, res) {
  var { pollId, title, choices } = req.body;
  var userId = req.user._id.toString();

  Poll.findOneAndUpdate(
    {
      pollId: pollId,
    },
    {
      $set: {
        pollId: pollId,
        creatorId: userId,
        title: title,
        choices: choices,
        votingRecord: [],
      },
    },
    {
      upsert: true,
    }
  ).exec(function(err, result) {
    if (err) return console.error(err);

    res.sendStatus(200);
  });
};

exports.deletePoll = function(req, res) {
  var { pollId } = req.body;

  Polls.findOneAndRemove({
    pollId: pollId,
  }).exec(function(err, result) {
    if (err) return console.error(err);

    res.sendStatus(200);
  });
};
