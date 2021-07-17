const jwt = require("jsonwebtoken");
const Utils = require('../UtilFunctions/utilFunctions');

module.exports = function webCookieValidator(req, res, next) {
    try {
        let token = req.headers['x-access-token']
        if (token == null) return res.sendStatus(401);
        jwt.verify(token, process.env.SECRET.toString(), (err, auth) => {
            if (err) {
                console.log(`Token err , ${err.message}`)
                return res.sendStatus(403);
            }
            next();
        });
    } catch (err) {
        Utils.LogToFile("Client error authenticating")
        res.sendStatus(403)
    }
};
