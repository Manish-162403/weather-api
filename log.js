
var mongoose = require('mongoose');

var awardsSchema = new mongoose.Schema({
    _id: String,
    city: String,
    long: String,
    lat: String,
    humidity: String,
    temp: String,
    windSpeed: String,
  
    created_at: { type: Date, default: Date.now },
    updated_at: { type: Date, default: Date.now }
});

const awardsModel = mongoose.model('weather-log', awardsSchema);

module.exports = awardsModel;