const router = require('express').Router();
const Client = require('../client.model');
const webCookieValidator = require('../../Utils/MiddleWears/webCookieValidator');
const Utils = require('../../Utils/utilFunctions');
const Command = require("../../Commands/commands.model");
const ClientUtils = require('../../Utils/clientUtils')

//validate cookies
router.use(webCookieValidator);

//Kill all clients
router.route('/killall').get((req, res) => {
    try {
        //Gather all clients from database
        Client.find({}, function (err, users) {
            if (err) {
                Utils.LogToFile(`Error getting all clients from database ${err}`);
            } else {
                if (users.length !== 0) {
                    for (let i = 0; i < Object.keys(users).length; i++) {
                        let clientId = users[i]['client_id'];
                        let newCommand = new Command({client_id: clientId, command: "exit"});
                        newCommand.save()
                            .then(() => {
                                Utils.LogToFile(`Successfully added exit command for client ${clientId}`)
                            })
                            .catch((err) => {
                                if (err) {
                                    Utils.LogToFile(`Error sending command for client ${clientId}`)
                                    res.sendStatus(500);
                                    res.send("Internal server error");
                                }
                            })
                    }
                }
                res.send("killed all clients");
            }
        });
    } catch (err) {
        Utils.LogToFile(`Error killing all clients ${err}`);
        res.status(500);
        res.send("Internal server error");
    }

});

//kill single client
router.route('/kill').post((req, res) => {
    try {
        let clientId = req.body.client_id;
        ClientUtils.CheckClientStatus(clientId).then((status) => {
            if (!status)
                ClientUtils.RemoveClient(clientId)
            else {
                ClientUtils.AddCommand(clientId, "exit").then(() => res.send()).catch(() => res.sendStatus(500))
            }

        }).catch((err) => {
            Utils.LogToFile(`Error checking client status for kill command ${err}`)
            ClientUtils.RemoveClient(clientId)
            res.send()
        })
    } catch (err) {
        Utils.LogToFile(`Error killing client ${err}`);
        res.sendStatus(500)
    }
});

//get specific client
router.route('/client').post((req, res) => {
    const clientId = req.body.id;
    Client.findOne({client_id: clientId}, {}, {useFindAndModify: false}, function (err, user) {
        if (err) {
            Utils.LogToFile(`Error getting user by token ${err}`);
            res.sendStatus(400);
        } else {
            if (user) {
                res.send({user});
            } else {
                res.send({});
            }
        }
    })
})

//get all clients
router.route('/').get((req, res) => {
    Client.find({}, {}, {}, function (err, users) {
        if (err) {
            Utils.LogToFile(`Error getting user by token ${err}`);
            res.sendStatus(400);
        } else {
            if (users) {
                res.send(users);
            } else {
                res.send();
            }
        }
    })
})

//Get all client locations
router.route('/locations').get((req, res) => {
    Client.find({}, {}, {}, function (err, users) {
        if (err) {
            Utils.LogToFile(`Error getting user by token ${err}`);
            res.sendStatus(400);
        } else {
            if (users) {
                res.send(users);
            } else {
                res.send();
            }
        }
    }).select({client_id: true, location: true, status: true, _id:false})
})

//get client statistics
router.route('/statistics').get(async (req, res) => {
    let lowPrivs = await ClientUtils.NumLowPrivClients().then((lowPrivs) => lowPrivs)
        .catch((err) => {
            Utils.LogToFile(`Error getting lowPrivs stats ${err}`)
            return null
        })
    let highPrivs = await ClientUtils.NumHighPrivClients().then((highPrivs) =>highPrivs)
        .catch((err) => {
            Utils.LogToFile(`Error getting highPrivs stats ${err}`)
            return null
        })
    let onlineClients  =  await ClientUtils.NumConnectedClients().then((onlineClients) =>onlineClients)
        .catch((err) => {
            Utils.LogToFile(`Error getting onlineClients stats ${err}`)
            return null
        })
    let offlineClients = await ClientUtils.NumDisconnectedClients().then((offlineClients) =>offlineClients).catch((err) => {
        Utils.LogToFile(`Error getting offlineClients stats ${err}`)
        return null
    })
    // let allMonthsCount = await ClientUtils.
    res.send({
        lowPrivs: lowPrivs,
        highPrivs: highPrivs,
        onlineClients: onlineClients,
        offlineClients: offlineClients,
    })
})

module.exports = router;