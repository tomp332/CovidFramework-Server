let mongoose = require('mongoose');

class Database{
    constructor(uri) {
        this.uri = uri;
    }
    connectToDB() {
        mongoose.connect(this.uri, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        })
            .then(() => {
                console.log("[+] Successfully connected to database!")
                return mongoose.connection;
            })
            .catch(err => {
                console.log(`[-] Error connecting to database ${err}`);
                process.exit(1);
            })
    }
}
module.exports = Database;
