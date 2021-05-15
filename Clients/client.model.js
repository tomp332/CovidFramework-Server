let mongoose = require('mongoose');
const {now} = require("mongoose");
let Schema = mongoose.Schema;

// Defines schemas
let clientSchema = new Schema({
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
    lastActive: String,
    location: {
        lat: Number,
        lng: Number,
        country:String,
        city: String,
        home_address: String
    }
}, {versionKey: false});

const Client = mongoose.model('Client', clientSchema);
module.exports = Client;