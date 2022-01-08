const crypto = require("crypto");
const log = require('log-to-file');
const fs = require('fs');
const WebClient = require("../../Clients/webclients.model");
const jwt = require("jsonwebtoken");
const path = require("path");
const appDir = path.dirname(require.main.filename);
const filesPath = path.resolve(appDir, 'Server', 'Api', 'Utils', 'clientFiles')


const GenerateRandomId = (numOfChars) => {
    return Math.random().toString(36).substr(2, numOfChars);
}

module.exports.GenerateRandomId = GenerateRandomId;

const GenerateRandomSessionKey = () => {
    return crypto.randomBytes(20).toString('hex');
}
exports.GenerateRandomSessionKey = GenerateRandomSessionKey;


const LogToFile = (logContent) => {
    if (!fs.existsSync(path.resolve(appDir, 'Server', 'Api', 'Utils', 'Logs')))
        fs.mkdirSync(path.resolve(appDir, 'Server', 'Api', 'Utils', 'Logs'));
    log(logContent, path.resolve(appDir, 'Server', 'Api', 'Utils', 'Logs', 'ServerLogs.log'));
}
module.exports.LogToFile = LogToFile;


const MoveFile = (src, dest, clientId) => {
    LogToFile(`Uploading ${dest} for client ${clientId}`);
    if (!fs.existsSync(filesPath)) {
        fs.mkdirSync(filesPath);
    }
    if (!fs.existsSync(path.resolve(filesPath, clientId))) {
        fs.mkdirSync(path.resolve(filesPath, clientId));
    }
    fs.rename(src, path.resolve(filesPath, clientId, dest), (err) => {
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

const base64Encode = (command) => {
    return (Buffer.from(command).toString('base64'))
}
module.exports.base64Encode = base64Encode;


async function loginValidate(username, password) {
    await WebClient.findOne({username: username, password: password}, function (err, user) {
        if (err) {
            return {};
        } else {
            if (user !== null) {
                let payload = {user: username}
                let token = jwt.sign(payload, process.env.SECRET, {expiresIn: '24h'})
                WebClient.findOneAndUpdate({username: username, password: password},
                    {session_key: token}, {useFindAndModify: false}, function (err) {
                        if (err)
                            return {};
                    })
                return {auth: true, token: token}
            } else {
                return {}
            }
        }
    })
}

module.exports.loginValidate = loginValidate;

