var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var event = new Schema({
    uniqueId: String,
    title: String,
    people: [{type: String}]
});

module.exports = mongoose.model('Event', event);