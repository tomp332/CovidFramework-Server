const router = require('express').Router();
let Command = require('../commands.model');
let webCookieValidator = require('../../Utils/MiddleWears/webCookieValidator');
const psCommand = require('../pscommand.model');
const Utils = require('../../Utils/utilFunctions')
//Middle wear for authentication
router.use(webCookieValidator);


//Add regular command
router.route('/add').post((req, res) => {
    const command_id = Utils.GenerateRandomId(6);
    const clientId = req.body.client_id;
    const command = req.body.command;
    const newCommand = new Command({client_id: clientId, command_id: command_id, command: command});
    newCommand.save()
        .then(() => res.send('Command added successfully!'))
        .catch(err => res.status(400).send(`Error adding command ${err}`));
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

module.exports = router;

