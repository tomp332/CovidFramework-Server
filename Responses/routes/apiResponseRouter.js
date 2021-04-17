const router = require('express').Router();
const Response = require('../responses.model');
const webCookieValidator = require('../../Utils/MiddleWears/webCookieValidator');
const Utils = require("../../Utils/utilFunctions");


//Validate cookie for incoming requests
router.use(webCookieValidator);

//regular response from client
router.route('/').post((req,res) =>{
    const clientId = req.body.id;
    Response.findOne({client_id:clientId},{},{},function(err,response){
        if(err){
            Utils.LogToFile(`Error getting response for client ${clientId}: ${err}`);
            res.sendStatus(400);
        }
        else{
            if(response !== null){
                res.send(response);
                Response.deleteOne({client_id:clientId},{},function(err){
                    if(err)
                        Utils.LogToFile(`Error removing response for client ${err} ID: ${clientId}`);
                })
            }
            else
                res.send({});
        }
   });
});

module.exports = router;