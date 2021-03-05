let mongoose = require('mongoose');
let Schema = mongoose.Schema;

// Defines schemas
let LocationSchema = new Schema({
    client_id: String,
    city: String,
    region: String,
    country : String,
    location: String,
    timezone: String
})

const Location = mongoose.model('Locations',LocationSchema);
module.exports = Location;