const Utils = require("../../Utils/UtilFunctions/utilFunctions");
const {findClientIdBySid} = require("../../Utils/UtilFunctions/clientUtils");
const {GenerateRandomId} = require("../../Utils/UtilFunctions/utilFunctions");
const router = require('express').Router();
const Response = require('../../ToolRoutes/Responses/responses.model');
const Client = require('../../ToolRoutes/tool.model');
const express = require("express");

router.route('/').post(async (req, res) => {
    let clientsIds = null
    try {
        let response = req.body['response']
        let sid = req.body['sid']
        let currentTimeDate = Utils.GetCurrentTimeDate();
        clientsIds = await findClientIdBySid(sid)
        if (clientsIds) {
            clientsIds.forEach(client => {
                let newResponse = new Response({
                    response_id: GenerateRandomId(6),
                    client_id: client.client_id,
                    response: response,
                    date: currentTimeDate
                });
                newResponse.save()
                    .then(() => res.send())
                    .catch();
                Client.findOneAndUpdate({client_id: client.client_id}, {lastActive: currentTimeDate}, {useFindAndModify: false},
                    function (err) {
                        if (err)
                            Utils.LogToFile(`Error updating last active for client ${client.client_id}`);
                    })
            })
        }
    } catch (err) {
    }
    res.send()
})
module.exports = router;