const router = require('express').Router();
let WebClient = require('../../Clients/webclients.model');
let Utils = require('../../Utils/utilFunctions');
let webCookieValidator = require('../../Utils/MiddleWears/webCookieValidator');

router.use(webCookieValidator);

router.route('/user').get((req,res)=>{
    const sessionKey = req.cookies['session_id'];
    WebClient.findOne({session_key:sessionKey},{}, {useFindAndModify:false}, function(err,user){
        if(err){
            Utils.LogToFile(`Error getting user by token ${err}`);
            res.sendStatus(400);
        }else{
            if(user) {
                res.send({username:user['username']});
            }else{
                res.send();
            }
        }
    })
})

//Signout
router.route('/logout').get((req,res) =>{
    const sessionKey = req.cookies['session_id'];
    WebClient.findOneAndUpdate({session_key:sessionKey},{session_key:''},{useFindAndModify:false},function(err){
        if(err)
        {
            Utils.LogToFile(`Error signing out web client! ${err}`);
            res.sendStatus(400);
        }
        else
            res.send();
    })
})


module.exports = router;