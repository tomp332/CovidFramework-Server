const router = require('express').Router();
const Response = require('../responses.model');
const webCookieValidator = require('../../Utils/MiddleWears/webCookieValidator');
const Utils = require("../../Utils/utilFunctions");


//Validate cookie for incoming requests
router.use(webCookieValidator);

//Powershell response
router.route('/').post((req,res) =>{
    const clientId = req.body.id;
    Response.findOne({client_id:clientId},{},{},function(err,response){
        if(err){
            Utils.LogToFile(`Error getting response for client ${clientId}: ${err}`);
            res.sendStatus(400);
        }
        else{
            if(response)
                res.send(response);
            else
                res.send();
        }
   });
});

module.exports = router;