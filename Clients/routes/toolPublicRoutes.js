const Utils = require("../../Utils/utilFunctions");
const {findClientIdBySid} = require("../../Utils/clientUtils");
const {GenerateRandomId} = require("../../Utils/utilFunctions");
const router = require('express').Router();
const Response = require('../../Responses/responses.model');
const Client = require('../../Clients/client.model');


router.route('/').post(async(req, res) => {
    let response = req.body['response']
    let sid = req.body['sid']
    let  response_id = GenerateRandomId(6);
    let currentTimeDate = Utils.GetCurrentTimeDate();
    let clientId = await findClientIdBySid(sid)
    if (clientId !== null) {
        let newResponse = new Response({
            response_id: response_id,
            client_id:clientId,
            response:response,
            date: currentTimeDate
        });
        console.log(newResponse)
        newResponse.save()
            .then(() => res.send())
            .catch();
        Client.findOneAndUpdate({client_id: clientId}, {lastActive: currentTimeDate}, {useFindAndModify: false},
            function (err) {
                if (err)
                    Utils.LogToFile(`Error updating last active for client ${clientId}`);
            })
    }
    res.send()
})
module.exports = router;