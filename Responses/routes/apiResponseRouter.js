const router = require('express').Router();
const Response = require('../../ToolRoutes/Responses/responses.model');
const Utils = require("../../Utils/UtilFunctions/utilFunctions");
const PowershellResponse = require("../../ToolRoutes/Responses/psResponse.model");

//regular response from client
router.route('/:id').get((req, res) => {
    const clientId = req.params.id;
    Response.findOne({client_id: clientId}, {}, {}, function (err, response) {
        if (err) {
            Utils.LogToFile(`Error getting response for client ${clientId}: ${err}`);
            res.sendStatus(400);
        } else {
            if (response !== null) {
                res.send(response);
                Response.deleteOne({client_id: clientId}, {}, function (err) {
                    if (err)
                        Utils.LogToFile(`Error removing response for client ${err} ID: ${clientId}`);
                })
            } else
                res.send({});
        }
    });
});

//Powershell response from client
router.route('/ps/:id').get((req, res) => {
    const clientId = req.params.id;
    PowershellResponse.findOne({client_id: clientId}, {}, {}, function (err, response) {
        if (err) {
            Utils.LogToFile(`Error getting powershell response for client ${clientId}: ${err.message}`);
            res.sendStatus(400);
        } else {
            if (response !== null) {
                res.send(response);
                PowershellResponse.deleteOne({client_id: clientId}, {}, function (err) {
                    if (err)
                        Utils.LogToFile(`Error removing powershell response for client ${err.message} ID: ${clientId}`);
                })
            } else
                res.send({});
        }
    });
});

module.exports = router;