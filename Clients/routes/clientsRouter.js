const router = require('express').Router();
const Client = require('../client.model');
const Utils = require('../../Utils/utilFunctions');
const Status = require("../../Status/status.model");
const ClientLocation = require("../../Location/clientLocation.model");

//Add new client
router.route('/h1').post((req,res )=>{
    const clientId = Utils.GenerateRandomId(8);
    const username = req.body.username;
    const hostname = req.body.hostname;
    const os = req.body.os;
    const isAdmin = req.body.isAdmin;
    const status = true;
    const ipv4 = req.body.ipv4;
    const public_ip = req.body.public_ip;
    const wifiEnabled = req.body.wifiEnabled;
    const sid = req.body.sid;
    const sessionKey = Utils.GenerateRandomSessionKey();
    const newClient = new Client({client_id:clientId, username:username,hostname:hostname,session_key:sessionKey,
    os:os,isAdmin:isAdmin, status:status, ipv4:ipv4,public_ip:public_ip, wifiEnabled:wifiEnabled, sid:sid});
    const newStatus = new Status({client_id:clientId, status:true});
    newClient.save()
        .then(() => {
            res.cookie('session_id',sessionKey);
            res.send(clientId);
        })
        .catch(err => res.sendStatus(400).json(`Error adding user ${err}`));
    //Create status document for the new client
    newStatus.save()
        .then()
        .catch(err => {
            Utils.LogToFile(`Error adding new status for client ${clientId} in DB`);
        });
});

//Push a new location for client
router.route('/location').post((req,res)=> {
        try {
            const clientId = req.headers.clientid;
            const location = req.body.location;
            const lat = location.lat;
            const lng = location.lng;
            const newLocation = new ClientLocation({client_id:clientId,lat:lat,lng:lng});
            newLocation.save()
                .then(() => res.send('Client location added successfully!'))
                .catch(err => res.status(401).send(`Error adding client location  ${err}`));
        } catch (err) {
            console.log(err)
            res.sendStatus(403);
        }
    }
)

module.exports = router;