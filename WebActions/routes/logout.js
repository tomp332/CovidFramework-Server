const router = require('express').Router();
let WebClient = require('../../Clients/webclients.model');
let Utils = require('../../Utils/UtilFunctions/utilFunctions');

//Signout
router.route('/logout').get((req, res) => {
    const sessionKey = req.headers['x-access-token'];
    WebClient.findOneAndUpdate({session_key: sessionKey}, {session_key: ''}, {useFindAndModify: false}, function (err) {
        if (err) {
            Utils.LogToFile(`Error signing out web client! ${err}`);
            res.sendStatus(400);
        } else
            res.send();
    })
})


module.exports = router;