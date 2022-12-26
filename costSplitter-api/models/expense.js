var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = mongoose.Schema.Types.ObjectId;

var expense = new Schema({
    eventId:{type: ObjectId,ref: 'Event'},
    title: String,
    cost: Number,
    people: [{type: String}],
    paidBy: String
});

module.exports = mongoose.model('Expense', expense);