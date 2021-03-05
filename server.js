const express = require('express');
const cors = require('cors');
const database = require('./Database/connect');
const cookieParser = require('cookie-parser');
require('dotenv').config();

//Express config
const app = express();
const port = process.env.PORT || 5000;
app.use(cors({origin:'http://10.0.0.7:3000'}));
app.use(express.json());
app.use(cookieParser());
const corsOptions = {
    origin:'http://10.0.0.7:3000',
    methods: "GET,HEAD,POST,PATCH,DELETE,OPTIONS",
    credentials: true,                // required to pass
    allowedHeaders: "Content-Type, Authorization, X-Requested-With",
}
// intercept pre-flight check for all routes

//Routes
const ToolRouter = require('./Clients/routes/clientsRouter');
const CommandRouter = require('./Commands/routes/toolCommandsRouter');
const ResponsesRouter = require('./Responses/routes/responsesRouter');
const WebActionsRouter = require('./WebActions/routes/webRouter');
const WebCommandsRouter = require('./Commands/routes/webCommandsRouter');
const WebClientActionsRouter = require('./Clients/routes/webClientsRouter');
const WebUserActions = require('./WebActions/routes/userActionsRouter');

app.options('*', cors(corsOptions))
app.use('/clients', ToolRouter);
app.use('/commands',CommandRouter)
app.use('/session', WebUserActions);
app.use('/session/commands',WebCommandsRouter);
app.use('/session/clients', WebClientActionsRouter);
app.use('/response',ResponsesRouter);
app.use('/', WebActionsRouter);


// Connect to DB
const uri = process.env.ATLAS_URI;
const Database = new database(uri);
const connection = Database.connectToDB();





//Start server
app.listen(port, () =>{
    console.log(`[+] Started server on port ${port}`)
});

