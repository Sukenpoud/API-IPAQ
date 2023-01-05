const mongoose = require('mongoose');

const ipSchema = mongoose.Schema({
    ipv4: {type: String, requires: true},
    latitude: {type: String, requires: true},
    longitude: {type: String, requires: true},
    city: {type: String, requires: false},
    region: {type: String, requires: false},
    country: {type: String, requires: false},
    pollution: {type: Object, requires: false},
    weather: {type: Object, requires: false},
    userId: {type: String, requires: true},
    creationDate: {type: Date, requires: false},
    modificationDate: {type: Date, requires: false},
    active: {type: Boolean, requires: false},
});

module.exports = mongoose.model('Ip', ipSchema);