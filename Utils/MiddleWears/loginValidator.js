let WebClient = require('../../Clients/webclients.model');
const Utils = require("../utilFunctions");
const jwt = require('jsonwebtoken');

module.exports = function loginValidate(req, res, next) {
    try {
        let username = req.body.username;
        let password = req.body.password;
        if (username && password) {
            WebClient.findOne({username: username, password: password}, function (err, user) {
                if (err) {
                    Utils.LogToFile(`Error authenticating webclient from database ${err}`);
                    res.status(403).send("Unauthorized!");
                } else {
                    if (user !== null) {
                        let payload = {
                            date:new Date(),
                            user:username
                        }
                        let token = jwt.sign(payload, process.env.secret, {expiresIn: '24h'})
                        // let refreshToken = jwt.sign(payload, process.env.refresh_secret)
                        WebClient.findOneAndUpdate({username: username, password: password},
                            {session_key: token}, {useFindAndModify: false}, function (err) {
                                if (err) {
                                    Utils.LogToFile(`Error updating client cookie to DB ${err}`);
                                    res.status(500).send("Server error");
                                }
                        })
                        res.send({auth: true, token: token})
                        next();
                    } else {
                        res.status(403).send("Not granted!");
                    }
                }
            })
        }
    } catch (err) {
        Utils.LogToFile(`Error parsing login request for authentication purpose ${err}`);
        res.status(403).send("Unauthorized!");
    }

}
