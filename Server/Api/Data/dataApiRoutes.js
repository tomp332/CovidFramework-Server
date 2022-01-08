const Client = require('../../Tool/tool.model');
let router = require('express').Router();
const grafanaAuth = require('../Utils/MiddleWears/grafanaAuth')

function getLocations(req, res) {
    let newObject = []
    let query = Client.find({}).select('location client_id public_ip lastActive isConnected -_id');
    query.exec(function (err, locations) {
        if (err) return res.send();
        locations.forEach(location => {
            let tempObject = location.location
            tempObject = {...tempObject, ...{"client_id": location.client_id}}
            tempObject = {...tempObject, ...{"lastActive": location.lastActive}}
            tempObject = {...tempObject, ...{"public_ip": location.public_ip}}
            tempObject = {...tempObject, ...{"homeAddress": location.home_address}}
            tempObject = {...tempObject, ...{"isConnected": location.isConnected}}
            tempObject = {...tempObject, ...{"C&C": `${process.env.HOST}/control/${location.client_id}`}}
            newObject.push(tempObject)
        })
        res.send({"locations": newObject});
    });
}

function countByStatus(req, res, status) {
    let query
    if (status === '')
        query = Client.countDocuments({})
    else
        query = Client.countDocuments({isConnected: status})
    query.exec(function (err, count) {
        if (err) return res.send()
        res.send({"count": count});
    })
}

// router.use(grafanaAuth)

// Client location object
router.route('/locations').get((req, res) => {
    getLocations(req, res)
});

// Clients count by status
router.route('/count/:status?').get((req, res) => {
    let status = req.params.status
    if (status === undefined)
        countByStatus(req, res, '')
    else {
        if (status === 'online')
            status = true
        else if (status === 'offline')
            status = false
        else if (status === '')
            status = ''
        countByStatus(req, res, status)
    }
});


module.exports = router;