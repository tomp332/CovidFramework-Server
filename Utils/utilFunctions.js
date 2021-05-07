const crypto = require("crypto");
const log = require('log-to-file');
const fs = require('fs');
const filesPath = "./Utils/uploads/"
const Client = require('../Clients/client.model');
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

const DisconnectClient = (clientId) => {
    Client.findOneAndUpdate({client_id: clientId}, {status: false}, {useFindAndModify: false}, function (err) {
        if (err)
            LogToFile(`Unable to disconnect inactive client ${clientId}`)
    })
}

const ValidateClients = (currentTimeDate) => {
    let parsed = ParseCurrentTimeDate(currentTimeDate)
    Client.find({}, function (err, users) {
        if (err) {
            LogToFile(`Error getting clients from DB for status check!, ${err}`)
        } else if (users.length > 0) {
            users.forEach((client) => {
                let splitDateTime = client.lastActive.split(',')
                let clientDate = splitDateTime[0].trim()
                const datesAreOnSameDay = (first, second) =>
                    first.getFullYear() === second.getFullYear() &&
                    first.getMonth() === second.getMonth() &&
                    first.getDate() === second.getDate();
                if (datesAreOnSameDay(new Date(clientDate), new Date(parsed[0]))) {
                    let clientTime = splitDateTime[1].trim()
                    let clientHours = clientTime.split(':')[0]
                    let clientMinutes = clientTime.split(':')[1].split(' ')[0]
                    if (parseInt(clientHours) === parseInt(parsed[1])) {
                        //Check if the client hasn't been active for 1 minutes
                        if (Math.abs(parseInt(clientMinutes) - parseInt(parsed[2])) >= 1) {
                            DisconnectClient(client.client_id);
                        }

                    }
                } else {
                    DisconnectClient(client.client_id);
                }
            })
        }
    })
}
module.exports.ValidateClients = ValidateClients;


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

