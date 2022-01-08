const router = require('express').Router();
const validateLogin = require('../../Utils/MiddleWears/loginValidator');
const webCookieValidator = require('../../Utils/MiddleWears/webCookieValidator')
const WebClient = require("../../Clients/webclients.model");
const Utils = require("../../Utils/UtilFunctions/utilFunctions");
const express = require("express");

router.use(express.json())

// Signout
router.route('/logout').get((req, res) => {
    const sessionKey = req.headers['x-access-token'];
    WebClient.findOneAndUpdate({session_key: sessionKey}, {session_key: ''}, {useFindAndModify: false}, function (err) {
        if (err) {
            Utils.LogToFile(`Error signing out web client! ${err}`);
            res.sendStatus(400);
        } else
            res.send();
    })
})

// Register middle wear for login
router.use(validateLogin);

router.route('/login').post((req, res) => {
});

router.use(webCookieValidator)

router.route('/auth').get((req, res) => {
    res.send()
});

module.exports = router;