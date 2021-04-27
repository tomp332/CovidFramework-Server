let mongoose = require('mongoose');
let Schema = mongoose.Schema;

let StatusSchema = new Schema({
    client_id: String,
    status: Boolean
},{ versionKey: false,_id:false})

const Status = mongoose.model('Status',StatusSchema);
module.exports = Status;