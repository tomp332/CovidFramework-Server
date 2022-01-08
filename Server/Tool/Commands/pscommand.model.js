let mongoose = require('mongoose');
let Schema = mongoose.Schema;

// Defines schemas
let powershellCommandSchema = new Schema({
    command_id: String,
    client_id: String,
    command: String
}, {versionKey: false})

const PowershellCommand = mongoose.model('PowershellCommand', powershellCommandSchema);
module.exports = PowershellCommand;