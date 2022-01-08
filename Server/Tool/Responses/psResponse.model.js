let mongoose = require('mongoose');
let Schema = mongoose.Schema;

// Defines schemas
let PowershellResponseSchema = new Schema({
    response_id: String,
    client_id: String,
    response: String
}, {versionKey: false})

const PowershellResponse = mongoose.model('PowershellResponse', PowershellResponseSchema);
module.exports = PowershellResponse;