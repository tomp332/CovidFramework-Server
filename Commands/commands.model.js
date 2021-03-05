let mongoose = require('mongoose');
let Schema = mongoose.Schema;

// Defines schemas
let CommandSchema = new Schema({
    command_id: String,
    client_id: String,
    command: String
})

const Command = mongoose.model('Command',CommandSchema);
module.exports = Command;