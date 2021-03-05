let mongoose = require('mongoose');
let Schema = mongoose.Schema;

let StatusSchema = new Schema({
    client_id: String,
    status: Boolean
})

const Status = mongoose.model('Status',StatusSchema);
module.exports = Status;