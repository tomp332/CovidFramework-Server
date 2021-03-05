let WebClient = require('../../Clients/webclients.model');
const Utils = require("../utilFunctions");
const jwt = require('jsonwebtoken');

module.exports  = function loginValidate(req,res,next){
    try{
        let username = req.body.username;
        let password = req.body.password;
        if(username && password){
            WebClient.findOne({username:username, password:password},function(err,user){
                if(err){
                    console.log(`Error authenticating webclient from database ${err}`);
                    res.status(401).send("Unauthorized!");
                }
                else{
                    if(user !== null){
                        let sessionKey = Utils.GenerateRandomSessionKey();
                        WebClient.findOneAndUpdate({username:username,password:password},
                            {session_key:sessionKey}, {useFindAndModify:false}, function(err){
                            if(err){
                                Utils.LogToFile(`Error updating client cookie to DB ${err}`);
                                res.status(500).send("Server error");
                            }
                        })
                        const token = jwt.sign({session_id:sessionKey }, "jwtSecret");
                        res.cookie('session_id', token, {
                            maxAge: 60 * 60 * 1000000,
                            httpOnly: true,
                            secure: false, //if not https
                            sameSite: true,
                        })
                        //res.cookie('session_id',sessionKey);
                        next();
                    }
                    else{
                        res.status(401).send("Not granted!");
                    }
                }
            })
        }
    }
    catch (err){
        console.log(`Error parsing login request for authentication purpose ${err}`);
        res.status(401).send("Unauthorized!");
    }

}
