let mongoose = require('mongoose');
let Schema = mongoose.Schema;

// Defines schemas
let CommandSchema = new Schema({
    client_id: String,
    command_id: String,
    command: String
}, { versionKey: false})

const Command = mongoose.model('Command',CommandSchema);
module.exports = Command;