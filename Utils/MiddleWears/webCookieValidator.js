const jwt = require("jsonwebtoken");

module.exports = function webCookieValidator(req, res, next) {
    try {
        let token = req.headers['x-access-token']
        if (token == null) return res.sendStatus(401);
        jwt.verify(token, process.env.secret.toString(), (err, auth) => {
            if (err) {
                console.log(`Token err , ${err.message}`)
                return res.sendStatus(403);
            }
            next();
        });
    } catch (err) {
        res.sendStatus(403)
    }
};
