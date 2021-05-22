const Client = require('../../Clients/client.model');
const Utils = require("../utilFunctions");

module.exports = function toolCookieValidator(req, res, next) {
    const sessionKey = req.cookies['session_id'];
    const clientId = req.headers['clientid'];
    if (sessionKey) {
        //Add validation that the session id exists
        Client.findOne({client_id: clientId, session_key: sessionKey}, function (err, user) {
            if (err) {
                Utils.LogToFile(`Error finding user in database for authentication ${err}`);
                res.status(403).send("Unauthorized!");
            } else {
                if (user)
                    next();
                else
                    res.status(403).send("Unauthorized!");
            }
        })
    } else
        res.status(403).send("Unauthorized!");
}
