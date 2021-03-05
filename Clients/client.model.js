let mongoose = require('mongoose');
let Schema = mongoose.Schema;

// Defines schemas
let clientSchema  = new Schema({
    client_id: String,
    hostname: String,
    username: String,
    os: String,
    isAdmin: Boolean,
    status: Boolean,
    session_key: String,
    public_ip: String,
    ipv4: String,
    wifiEnabled: Boolean,
    sid: String,
});

const Client = mongoose.model('Client',clientSchema);
module.exports = Client;