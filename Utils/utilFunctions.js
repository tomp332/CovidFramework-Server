const crypto = require("crypto");
const log = require('log-to-file');
const fs = require('fs');

//Generate random client id
const GenerateRandomId = (numOfChars) => {
    return Math.random().toString(36).substr(2, numOfChars);
}

module.exports.GenerateRandomId = GenerateRandomId;

const GenerateRandomSessionKey = () => {
    return crypto.randomBytes(20).toString('hex');
}
exports.GenerateRandomSessionKey = GenerateRandomSessionKey;


const LogToFile = (logContent) => {
    log(logContent,'./ServerLogs.log');
}
module.exports.LogToFile = LogToFile;

const CreateDownloadsFolder = () =>{
    fs.access("../Downloads", (err) => {
        console.log(`Directory ${err ? 'does not exist' : 'exists'}`);
    });
}

module.exports.CreateDownloadsFolder = CreateDownloadsFolder;