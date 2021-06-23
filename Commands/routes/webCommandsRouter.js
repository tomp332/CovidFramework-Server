const router = require('express').Router();
let Command = require('../../ToolRoutes/Commands/commands.model');
let webCookieValidator = require('../../Utils/MiddleWears/webCookieValidator');
const psCommand = require('../../ToolRoutes/Commands/pscommand.model');
const formidable = require('express-formidable');
const Utils = require('../../Utils/UtilFunctions/utilFunctions')
const ClientUtils = require('../../Utils/UtilFunctions/clientUtils')

//Add regular command
router.route('/add').post((req, res) => {
    const clientId = req.body.client_id;
    const command = req.body.command;
    ClientUtils.AddCommand(clientId, command).then(() => res.send()).catch(() => res.sendStatus(500))
});


//Add powershell command
router.route('/ps/add').post((req, res) => {
    const commandId = Utils.GenerateRandomId(6);
    const clientId = req.body.client_id;
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

// Not getting client id in headers!!!
router.route('/upload').post((req, res) => {
    let clientId = req.fields.id
    Utils.MoveFile(req.files.file.path, req.files.file.name, clientId)
    res.send()
})

module.exports = router;

