let mongoose = require('mongoose');
let Schema = mongoose.Schema;

// Defines schemas
let WebClientSchema = new Schema({
    username: String,
    password: String,
    session_key: String,
    date: String,
}, {versionKey: false})

const WebClient = mongoose.model('WebClients', WebClientSchema);
module.exports = WebClient;