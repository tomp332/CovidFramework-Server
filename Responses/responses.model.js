let mongoose = require('mongoose');
let Schema = mongoose.Schema;

// Defines schemas
let ResponseSchema = new Schema({
    response_id: String,
    client_id: String,
    response: String
})

const Response = mongoose.model('Response',ResponseSchema);
module.exports = Response;