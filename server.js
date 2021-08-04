const https = require("https")
const fs = require("fs")
const express = require('express');
const cors = require('cors');
const database = require('./Server/Database/connect');
const cookieParser = require('cookie-parser');
const Utils = require('./Server/Api/Utils/UtilFunctions/utilFunctions')
const forceSSL = require('express-force-ssl');
require('dotenv').config()

//Express config
const app = express();
const port = process.env.PORT || 3000;


app.use(cookieParser());
app.use(cors())
//Routes
const PublicDownloadTool = require('./Server/Api/FilesRouters/routes/publicToolRoute');
const WebActionsRouter = require('./Server/Api/WebActions/routes/authenticationRouters');
const ClientUtils = require("./Server/Api/Utils/UtilFunctions/clientUtils");
const ToolGeneralRouter = require('./Server/Tool/allToolRoutes')
const ApiGeneralRouter = require('./Server/Api/Clients/routes/allApiRoutes');


app.use('/55a1/2ww5r551', PublicDownloadTool)

app.use('/web', WebActionsRouter);

app.use('/api', ApiGeneralRouter);

app.use('/tool', ToolGeneralRouter)

// Connect to DB
let uri = process.env.ATLAS_URI_MONGO;
const Database = new database(uri);
let httpsServer;

if (process.env.NODE_ENV === 'development') {
    httpsServer = https.createServer({
        key: fs.readFileSync('./.cert/localhost/RootCA.key'),
        cert: fs.readFileSync('./.cert/localhost/RootCA.crt'),
    }, app);
} else {
    httpsServer = https.createServer({
        key: fs.readFileSync('/usr/share/covid-volume/privkey.pem'),
        cert: fs.readFileSync('/usr/share/covid-volume/cert.pem'),
    }, app);
    app.use(forceSSL);
}

httpsServer.listen(port, async () => {
    await Database.connectToDB();
    console.log(`HTTPS Server running on port ${port}`);
    setInterval(function () {
        ClientUtils.ValidateClients(Utils.GetCurrentTimeDate());
    }, 5000)
});