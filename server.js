const https = require("https")
const fs = require("fs")
const express = require('express');
const cors = require('cors');
const database = require('./Database/connect');
const cookieParser = require('cookie-parser');
const Utils = require('./Utils/utilFunctions')

require('dotenv').config()
//Express config
const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(cookieParser());
app.use(cors())

//Routes
const ToolPublicRoutes = require('./ClientFiles/routes/toolPublicRoutes')
const StaticToolRoutes = require('./ClientFiles/routes/toolStaticRoutes')
const ToolRouter = require('./Clients/routes/clientsRouter');
const StaticFilesApiRouter = require('./ClientFiles/routes/apiStaticRoutes')
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
app.use('/tool/download', StaticToolRoutes);
app.use('/tool/creds', ToolPublicRoutes);
app.use('/api', WebUserActions);
app.use('/api/commands', WebCommandsRouter);
app.use('/api/clients', WebClientActionsRouter);
app.use('/api/response', ApiResponsesRouter);
app.use('/clients/files',StaticFilesApiRouter );
app.use('/web', WebActionsRouter);


// Connect to DB
let uri;
if(process.env.NODE_ENV === 'development')
     uri = process.env.ATLAS_URI_DEV;
else
    uri = process.env.ATLAS_URI_PROD;

const Database = new database(uri);
let httpsServer;

if(process.env.NODE_ENV === 'development') {
    httpsServer = https.createServer({
        key: fs.readFileSync('./.cert/localhost/RootCA.key'),
        cert: fs.readFileSync('./.cert/localhost/RootCA.crt'),
    }, app);
}
else {
    httpsServer = https.createServer({
        key: fs.readFileSync('/usr/share/covid-volume/privkey.pem'),
        cert: fs.readFileSync('/usr/share/covid-volume/cert.pem'),
    }, app);
}

httpsServer.listen(port, async () => {
    await Database.connectToDB();
    console.log(`HTTPS Server running on port ${port}`);
    setInterval(function () {
        ClientUtils.ValidateClients(Utils.GetCurrentTimeDate());
    }, 5000)
});
