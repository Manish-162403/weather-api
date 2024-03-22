
var mongoose = require('mongoose');

var awardsSchema = new mongoose.Schema({
    _id: String,
    city: String,
    city_id:{
        type : String,
        unique : true
    },
    created_at: { type: Date, default: Date.now },
    updated_at: { type: Date, default: Date.now }
});

const awardsModel = mongoose.model('city', awardsSchema);

module.exports = awardsModel;