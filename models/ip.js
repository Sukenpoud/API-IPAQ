const mongoose = require('mongoose');

const ipSchema = mongoose.Schema({
    ipv4: {type: String, requires: true},
    city: {type: Number, requires: true},
    region: {type: String, requires: false},
    country: {type: String, requires: false},
    latln: {type: String, requires: true},
    creationDate: {type: Date, requires: false},
    modificationDate: {type: Date, requires: false},
    active: {type: Boolean, requires: false},
});

module.exports = mongoose.model('Ip', ipSchema);