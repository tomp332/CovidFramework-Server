const express = require('express');
const cors = require('cors');
const database = require('./Database/connect');
const cookieParser = require('cookie-parser');
require('dotenv').config({ path: `.env.${process.env.NODE_ENV}`});

//Express config
const app = express();
const port = process.env.PORT || 5000;
app.use(express.json());
app.use(cookieParser());
app.use(cors({ credentials: true, origin: `${process.env.ORIGIN_HOST}:${process.env.ORIGIN_HOST}`}));

//Routes
const ToolRouter = require('./Clients/routes/clientsRouter');
const CommandRouter = require('./Commands/routes/toolCommandsRouter');
const ToolResponsesRouter = require('./Responses/routes/toolResponsesRouter');
const ApiResponsesRouter = require('./Responses/routes/apiResponseRouter');
const WebActionsRouter = require('./WebActions/routes/webRouter');
const WebCommandsRouter = require('./Commands/routes/webCommandsRouter');
const WebClientActionsRouter = require('./Clients/routes/webClientsRouter');
const WebUserActions = require('./WebActions/routes/userActionsRouter');

// app.options('*', cors(corsOptions))

app.use('/tool/clients', ToolRouter);
app.use('/tool/commands',CommandRouter)
app.use('/api', WebUserActions);
app.use('/api/commands',WebCommandsRouter);
app.use('/api/clients', WebClientActionsRouter);
app.use('/tool/response',ToolResponsesRouter);
app.use('/api/response',ApiResponsesRouter);
app.use('/', WebActionsRouter);


// Connect to DB
const uri = process.env.ATLAS_URI;
const Database = new database(uri);
const connection = Database.connectToDB();





//Start server
app.listen(port, () =>{
    console.log(`[+] Started server on port ${port}`)
});

