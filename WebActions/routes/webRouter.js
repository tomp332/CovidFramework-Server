const router = require('express').Router();
let WebClient = require('../../Clients/webclients.model');
let Utils = require('../../Utils/utilFunctions');
let webCookieValidator = require('../../Utils/MiddleWears/webCookieValidator');
let validateLogin = require('../../Utils/MiddleWears/loginValidator');


router.route('/register').post((req,res) =>{
    const username = req.body.username;
    const password = req.body.password;
    const datetime = new Date();
    const newWebclient = new WebClient({username:username,password:password,
        date:datetime.toISOString().slice(0,20)});
    WebClient.find({username:username},function (err,user){
        if(user.length !== 0)
            res.status(500).send("User already exists!");
        else
        {
            newWebclient.save()
                .then(() => {
                    res.send('Web user added!');
                })
                .catch(err => res.status(400).send(`Error adding web user ${err}`));
        }
    })
});


router.route('/auth').get((req,res) =>{
    try{
        let sessionKey = req.cookies.session_id;
        WebClient.findOne({session_key:sessionKey},function(err,user) {
            if(err)
                res.sendStatus(403);
            else{
                if(user !== null)
                    res.send();
                else
                    res.sendStatus(403);
            }
        });
    }
    catch (err){
        console.log(err);
        res.sendStatus(403);
    }
});

//Register middle wear for login
router.use(validateLogin);

router.route('/login').post((req,res) =>{
   res.send({response:"Access granted!"});
});



module.exports = router;