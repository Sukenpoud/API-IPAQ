const mongoose = require('mongoose');

const objectSchema = mongoose.Schema({
    name: {type: String, requires: true},
    weight: {type: Number, requires: true},
    url: {type: String, requires: false},
    creationDate: {type: Date, requires: false},
    modificationDate: {type: Date, requires: false},
    active: {type: Boolean, requires: false},
});

module.exports = mongoose.model('Object', objectSchema);