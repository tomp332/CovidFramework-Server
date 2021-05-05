const crypto = require("crypto");
const log = require('log-to-file');
const fs = require('fs');
const filesPath = "./Utils/uploads/"

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

const MoveFile = (src, dest, clientId)=>{
    if (!fs.existsSync(filesPath)){
        fs.mkdirSync(filesPath);
    }
    if (!fs.existsSync(filesPath+clientId)){
        fs.mkdirSync(filesPath+clientId);
    }
    fs.rename(src, filesPath+clientId+'/'+dest, (err)=>{
        if(err) throw err;
        else LogToFile(`Successfully uploaded ${dest}!`);
    });
}
module.exports.MoveFile = MoveFile;


const ValidateClients = ()=>{

}
module.exports.MoveFile = MoveFile;


module.exports.CreateDownloadsFolder = CreateDownloadsFolder;