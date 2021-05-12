const router = require('express').Router();
const WebClient = require('../../Clients/webclients.model');
const Utils = require('../../Utils/utilFunctions');
const validateLogin = require('../../Utils/MiddleWears/loginValidator');
const webCookieValidator = require('../../Utils/MiddleWears/webCookieValidator')

router.route('/register').post((req, res) => {
    const username = req.body.username;
    const password = req.body.password;
    const datetime = new Date();
    const newWebclient = new WebClient({
        username: username, password: password,
        date: datetime.toISOString().slice(0, 20)
    });
    WebClient.find({username: username}, function (err, user) {
        if (user.length !== 0)
            res.status(500).send("User already exists!");
        else {
            newWebclient.save()
                .then(() => {
                    res.send('Web user added!');
                })
                .catch(err => res.status(400).send(`Error adding web user ${err}`));
        }
    })
});


//Register middle wear for login
router.use(validateLogin);

router.route('/login').post((req, res) => {
});

router.use(webCookieValidator)

router.route('/auth').get((req, res) => {
    res.send()
});



module.exports = router;