const jwt = require("jsonwebtoken");

module.exports = function webCookieValidator(req, res, next) {
    try {
        let token = req.headers['x-access-token']
        if (token !== null) {
            jwt.verify(token, process.env.secret, function (err) {
                if (err) {  // if expired it goes here , add implementation for redirecting to login page
                    console.log("Token error: ", err.message)
                    res.sendStatus(403)
                } else {
                    next()
                }
            })
        } else{
            return res.sendStatus(403)
        }
    } catch (err) {
        res.sendStatus(500)
    }
};
