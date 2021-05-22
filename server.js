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

//app.use(cors({credentials: true, origin: `https://${process.env.HOST}`}));
//app.use(cors({origin: `https://${process.env.HOST}`}));

 let allowedOrigins = ['https://www.covidframework.com', 'https://35.207.83.62:3000', 'https://35.207.83.62:443', 'https://35.207.83.62','https://localhost:3000', 'https://localhost:4443', 
 'https://localhost', 'https://frontend:443', 'https://frontend','https://backend:443', 'https://backend:3000', 'https://backend'];
app.use(cors({
  origin: function(origin, callback){
    console.log(origin)
    Utils.LogToFile(origin)
    if(!origin) return callback(null, true);    
    if(allowedOrigins.indexOf(origin) === -1){
      var msg = 'The CORS policy for this site does not ' + 'allow access from the specified Origin.';
      return callback(new Error(msg), false);
    }    
    return callback(null, true);
  }
}));


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



const httpsServer = https.createServer({
    key: fs.readFileSync('./.cert/RootCA.key'),
    cert: fs.readFileSync('./.cert/RootCA.crt'),
}, app);


httpsServer.listen(port, async () => {
    await Database.connectToDB();
    console.log(`HTTPS Server running on port ${port}`);
    setInterval(function () {
        ClientUtils.ValidateClients(Utils.GetCurrentTimeDate());
    }, 5000)
});
