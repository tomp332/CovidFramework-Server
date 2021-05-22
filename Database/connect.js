let mongoose = require('mongoose');
const Utils = require("../Utils/utilFunctions");

class Database {
    constructor(uri) {
        this.uri = uri;
    }

    async connectToDB() {
        console.log("Trying to connect to DB....")
        await mongoose.connect(this.uri, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        })
            .then(() => {
                Utils.LogToFile("[+] Successfully connected to database!")
                return mongoose.connection;
            })
            .catch(err => {
                Utils.LogToFile(`[-] Error connecting to database ${err}`);
                // process.exit(1);
            })
    }
}

module.exports = Database;
