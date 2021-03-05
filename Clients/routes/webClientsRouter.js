const router = require('express').Router();
const Client = require('../client.model');
const webCookieValidator = require('../../Utils/MiddleWears/webCookieValidator');
const Utils = require('../../Utils/utilFunctions');
const Command = require("../../Commands/commands.model");
const Status = require("../../Status/status.model");


router.use(webCookieValidator);

//Kill all clients
router.route('/killall').get((req,res )=>{
    try{
        //Gather all clients from database
        Client.find({},function(err,users){
            if(err){
                console.log(`Error getting all clients from database ${err}`);
            }
            else{
                if(users.length !== 0){
                    for(let i=0;i<Object.keys(users).length;i++){
                        let clientId = users[i]['client_id'];
                        let newCommand = new Command({client_id:clientId,command:"exit"});
                        newCommand.save()
                            .then(()=>{console.log(`Successfully added exit command for client ${clientId}`)})
                            .catch((err)=>{
                                if(err){
                                    Utils.LogToFile(`Error sending command for client ${clientId}`)
                                    res.sendStatus(500);
                                    res.send("Internal server error");
                                }
                            })
                    }
                }
                res.send("killed all clients");
            }
        });
    }
    catch (err){
        Utils.LogToFile(`Error killing all clients ${err}`);
        res.status(500);
        res.send("Internal server error");
    }

});

//kill single client
router.route('/kill').post((req,res )=>{
    try{
        const clientId = req.body.clientId;
        //Gather all clients from database
        Client.findOneAndDelete({client_id:clientId},function(err,user) {
            if (err) {
                Utils.LogToFile(`Error removing client from database ${err}`);
                res.status(500).send("Internal server error");
            }
            else{
                Status.findOneAndDelete({client_id:clientId},function(err){
                    if(err)
                        Utils.LogToFile(`Error removing client status for killed client ${err}`);
                })
            }
        })
        res.send();
    }
    catch (err){
        Utils.LogToFile(`Error killing client ${err}`);
        res.status(500).send("Internal server error");
    }
});

module.exports = router;