var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var IdeaSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    details: {
        type: String,
        required: true
    },
    user: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    },
});

mongoose.model('ideas', IdeaSchema);

