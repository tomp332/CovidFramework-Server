const router = require('express').Router();
let WebClient = require('../../Clients/webclients.model');
let Utils = require('../../Utils/utilFunctions');
let webCookieValidator = require('../../Utils/MiddleWears/webCookieValidator');

router.use(webCookieValidator);
//Signout
router.route('/logout').get((req,res) =>{
    const sessionKey = req.cookies['session_id'];
    WebClient.findOneAndUpdate({session_key:sessionKey},{session_key:''},{},function(err){
        if(err)
        {
            Utils.LogToFile(`Error signing out web client! ${err}`);
            res.sendStatus(500);
        }
        else
            res.sendStatus(200);
    })
})


module.exports = router;