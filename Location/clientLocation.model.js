let mongoose = require('mongoose');
let Schema = mongoose.Schema;

// Defines schemas
let LocationSchema = new Schema({
    client_id: String,
    lat:Number,
    lng:Number,
},{ versionKey: false,_id:false })

const ClientLocation = mongoose.model('ClientLocation',LocationSchema);
module.exports = ClientLocation;