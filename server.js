const https = require("https")
const fs = require("fs")
const express = require('express');
const cors = require('cors');
const database = require('./Database/connect');
const cookieParser = require('cookie-parser');
const Utils = require('./Utils/utilFunctions')
const path = require('path')
require('dotenv').config()
//Express config
const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(cookieParser());
app.use(cors())

//Routes
const ToolRouter = require('./Clients/routes/clientsRouter');
const CommandRouter = require('./Commands/routes/toolCommandsRouter');
const ToolResponsesRouter = require('./Responses/routes/toolResponsesRouter');
const ApiResponsesRouter = require('./Responses/routes/apiResponseRouter');
const WebActionsRouter = require('./WebActions/routes/webRouter');
const WebCommandsRouter = require('./Commands/routes/webCommandsRouter');
const WebClientActionsRouter = require('./Clients/routes/webClientsRouter');
const WebUserActions = require('./WebActions/routes/userActionsRouter');
const ClientUtils = require("./Utils/clientUtils");


app.use('/tool/clients', ToolRouter);
app.use('/tool/commands', CommandRouter)
app.use('/tool/response', ToolResponsesRouter);
app.use('/api', WebUserActions);
app.use('/api/commands', WebCommandsRouter);
app.use('/api/clients', WebClientActionsRouter);
app.use('/api/response', ApiResponsesRouter);
app.use('/web', WebActionsRouter);


// Connect to DB
const uri = process.env.ATLAS_URI;
const Database = new database(uri);
let httpsServer = null

if(process.env.NODE_PRODUCTION) {
    httpsServer= https.createServer({
        key: fs.readFileSync('./.cert/covidframework.com/privkey.pem'),
        cert: fs.readFileSync('./.cert/cert.pem'),
    }, app);
}
else{
    httpsServer = https.createServer({
        key: fs.readFileSync('./.cert/RootCA.key'),
        cert: fs.readFileSync('./.cert/RootCA.crt'),
    }, app);
}



httpsServer.listen(port, async () => {
    await Database.connectToDB();
    console.log(`HTTPS Server running on port ${port}`);
    setInterval(function () {
        ClientUtils.ValidateClients(Utils.GetCurrentTimeDate());
    }, 5000)
});
