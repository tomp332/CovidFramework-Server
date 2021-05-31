let mongoose = require('mongoose');
let Schema = mongoose.Schema;

// Defines schemas
let clientSchema = new Schema({
    client_id: String,
    hostname: String,
    username: String,
    session_key: String,
    os: String,
    isAdmin: Boolean,
    sid: String,
    wifiEnabled: Boolean,
    public_ip: String,
    ipv4: String,
    isConnected: {
        type: Boolean,
        default: true
    },
    location: {
        lat: Number,
        lng: Number,
        country:String,
        city: String,
        home_address: String
    },
    lastActive: String
}, {versionKey: false});

const Client = mongoose.model('Client', clientSchema);
module.exports = Client;