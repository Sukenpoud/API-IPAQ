const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
    email: {type: String, requires: true},
    password: {type: String, requires: false},
    name: {type: String, requires: false},
    creationDate: {type: Date, requires: false},
    modificationDate: {type: Date, requires: false},
    active: {type: Boolean, requires: false},
});

module.exports = mongoose.model('User', userSchema);