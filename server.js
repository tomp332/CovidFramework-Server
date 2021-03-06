const express = require('express');
const cors = require('cors');
const database = require('./Database/connect');
const cookieParser = require('cookie-parser');
require('dotenv').config();

//Express config
const app = express();
const port = process.env.PORT || 5000;
app.use(express.json());
app.use(cookieParser());
app.use(cors({ credentials: true, origin: 'http://10.0.0.7:3000'}));
//app.use(cors({ credentials: true, origin: 'http://10.0.0.7:443', methods: ["GET", "POST", "OPTIONS", "PUT", "DELETE"], preflightContinue: true }));
// app.use((req, res, next) => {
//     res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
//     res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
//     res.header('Access-Control-Allow-Credentials: true');
//     res.set('Content-Type', 'application/json');
//     next();
// });


//Routes
const ToolRouter = require('./Clients/routes/clientsRouter');
const CommandRouter = require('./Commands/routes/toolCommandsRouter');
const ResponsesRouter = require('./Responses/routes/responsesRouter');
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
app.use('/tool/response',ResponsesRouter);
app.use('/', WebActionsRouter);


// Connect to DB
const uri = process.env.ATLAS_URI;
const Database = new database(uri);
const connection = Database.connectToDB();





//Start server
app.listen(port, () =>{
    console.log(`[+] Started server on port ${port}`)
});

