const router = require('express').Router();
const Utils = require('../../Utils/UtilFunctions/utilFunctions');
const base64Decode = require('../../Utils/MiddleWears/base64')
const WebCommandsRouter = require('../../Commands/routes/webCommandsRouter');
const ApiResponsesRouter = require('../../Responses/routes/apiResponseRouter');
const WebClientActionsRouter = require('./webClientsRouter');
let webCookieValidator = require('../../Utils/MiddleWears/webCookieValidator');
const StaticFilesApiRouter = require('../../FilesRouters/routes/apiStaticRoutes')
const express = require("express");

router.use(webCookieValidator);
router.use(express.json())
router.use(base64Decode);

router.use('/commands', WebCommandsRouter);

router.use('/clients', WebClientActionsRouter);

router.use('/response', ApiResponsesRouter);

router.use('/files', StaticFilesApiRouter);

module.exports = router;