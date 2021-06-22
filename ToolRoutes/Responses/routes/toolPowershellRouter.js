const router = require('express').Router();
const psResponse = require('../psResponse.model');
const toolCookieValidator = require('../../../Utils/MiddleWears/toolCookieValidator');
const {GenerateRandomId} = require("../../../Utils/UtilFunctions/utilFunctions");


//Validate cookie for incoming requests

//Powershell response
// router.route('/ps').post((req, res) => {
//     const response_id = GenerateRandomId(6);
//     const clientId = req.headers['clientid'];
//     let response = req.body.response;
//     response = response.replace(/[_0U+]/gm,'\n')
//     console.log(response)
//     const newPsResponse = new psResponse({response_id: response_id, client_id: clientId, response: response});
//     newPsResponse.save()
//         .then(() => res.send())
//         .catch(err => res.status(401).send());
// });

module.exports = router;