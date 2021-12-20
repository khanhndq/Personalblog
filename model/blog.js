const mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectIdSchema = Schema.ObjectId;
var ObjectId = mongoose.Types.ObjectId;

var blogSchema = new mongoose.Schema({
    title: {
        type: String,
        required: 'This field is required.'
    },
    author: {
        type: String
    },
    date: {
        type: String
    },
    content: {
        type: String
    },
    imageName: {
        type: String
    },
    imageURL: {
        type: String
    }
});


mongoose.model('Blog', blogSchema);