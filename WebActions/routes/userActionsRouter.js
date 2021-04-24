const router = require('express').Router();
let WebClient = require('../../Clients/webclients.model');
let Client = require('../../Clients/client.model');
let Utils = require('../../Utils/utilFunctions');
let webCookieValidator = require('../../Utils/MiddleWears/webCookieValidator');

router.use(webCookieValidator);

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