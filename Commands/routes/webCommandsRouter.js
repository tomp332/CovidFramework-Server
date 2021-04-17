const router = require('express').Router();
let Command = require('../commands.model');
let webCookieValidator = require('../../Utils/MiddleWears/webCookieValidator');
const Utils = require("../../Utils/utilFunctions");
const {GenerateRandomId} = require("../../Utils/utilFunctions");
const psCommand = require('../pscommand.model');

//Middle wear for authentication
router.use(webCookieValidator);


//Add regular command
router.route('/add').post((req,res) =>{
    const command_id = GenerateRandomId(6);
    const client_id = req.body.clientId;
    const command = req.body.command;
    const newCommand = new Command({command_id:command_id, client_id:client_id, command:command});
    newCommand.save()
        .then(() => res.send('Command added successfully!'))
        .catch(err => res.status(400).send(`Error adding command ${err}`));
});


//Add powershell command
router.route('/ps/add').post((req,res) =>{
    const commandId = GenerateRandomId(6);
    const clientId = req.headers['clientid'];
    const command = req.body.command;
    const newPsCommand = new psCommand({command_id:commandId, client_id:clientId, command:command});

    newPsCommand.save()
        .then(() => res.send())
        .catch(err => {
            Utils.LogToFile(`Error adding powershell command to database ${err}`);
            res.sendStatus(500);
        })
});

module.exports = router;

