const crypto = require("crypto");
const log = require('log-to-file');
const fs = require('fs');
const filesPath = "./Utils/clientFiles/"
const Utils = require("./utilFunctions");

const GenerateRandomId = (numOfChars) => {
    return Math.random().toString(36).substr(2, numOfChars);
}

module.exports.GenerateRandomId = GenerateRandomId;

const GenerateRandomSessionKey = () => {
    return crypto.randomBytes(20).toString('hex');
}
exports.GenerateRandomSessionKey = GenerateRandomSessionKey;


const LogToFile = (logContent) => {
    log(logContent, './ServerLogs.log');
}
module.exports.LogToFile = LogToFile;


const CreateDownloadsFolder = () => {
    fs.access("../Downloads", (err) => {
        Utils.LogToFile(`Directory ${err ? 'does not exist' : 'exists'}`);
    });
}
module.exports.CreateDownloadsFolder = CreateDownloadsFolder;


const MoveFile = (src, dest, clientId) => {
    if (!fs.existsSync(filesPath)) {
        fs.mkdirSync(filesPath);
    }
    if (!fs.existsSync(filesPath + clientId)) {
        fs.mkdirSync(filesPath + clientId);
    }
    fs.rename(src, filesPath + clientId + '/' + dest, (err) => {
        if (err) throw err;
        else LogToFile(`Successfully uploaded ${dest}!`);
    });
}
module.exports.MoveFile = MoveFile;


const ParseCurrentTimeDate = (currentDateTime) => {
    let currentSplit = currentDateTime.split(',')
    let currentTime = currentSplit[1].trim()
    let currentDate = currentSplit[0].trim()
    let currentHours = currentTime.split(':')[0]
    let currentMinutes = currentTime.split(':')[1].split(' ')[0]
    return [currentDate, currentHours, currentMinutes]
}
module.exports.ParseCurrentTimeDate = ParseCurrentTimeDate;



const GetCurrentTimeDate = () => {
    return new Date().toLocaleDateString(undefined, {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
}
module.exports.GetCurrentTimeDate = GetCurrentTimeDate;

