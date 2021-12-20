const mongoose = require('mongoose');
var Schema = mongoose.Schema;

var accountSchema = new mongoose.Schema({
    name: {
        type: String,
    },
    email: {
        type: String
    },
    password: {
        type: String
    }
});


mongoose.model('Account', accountSchema);