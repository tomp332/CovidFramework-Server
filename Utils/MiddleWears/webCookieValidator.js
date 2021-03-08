const WebClient = require('../../Clients/webclients.model');
const Utils = require("../utilFunctions");

module.exports  = function webCookieValidator(req,res,next){
    try{
        let sessionKey = req.cookies['session_id'];
        if (sessionKey !== null) {
            //Add validation that the session id exists
            WebClient.findOne({session_key:sessionKey},{},{useFindAndModify:false},function (err, user) {
                if (err){
                    console.log(`Error finding user in database for authentication ${err}`);
                    res.status(401).send("Unauthorized!");
                }
                else{
                    if(user) {
                        next();
                    }

                }
            })
        } else
            res.status(401).send("Unauthorized!");
    }
    catch (err){
        res.status(500).send("Internal server error!");
    }
};
