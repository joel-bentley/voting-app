var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Poll = new Schema({
    pollId: { type: String, default: '' },
    creatorId: { type: String, default: '' },
    title: { type: String, default: '' },
    choices: { type: Array, default: [] },
    votingRecord: { type: Array, default: [] }
});

module.exports = mongoose.model('Poll', Poll);
