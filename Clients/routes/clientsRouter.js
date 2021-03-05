const router = require('express').Router();
const Client = require('../client.model');
const Utils = require('../../Utils/utilFunctions');
const Status = require("../../Status/status.model");


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


module.exports = router;