const Utils = require('./utilFunctions')
const Command = require('../Commands/commands.model')
const Client = require('../Clients/client.model')
const Location = require('../Location/clientLocation.model')
const Response = require('../Responses/responses.model')


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
        Client.findOne({client_id: clientId}, {}, {}, function (err,client) {
            if (err)
                Utils.LogToFile(`Error getting client status from db, ${err}`)
        })
    return client.status
}
module.exports.CheckClientStatus = CheckClientStatus;

const DisconnectClient = (clientId) => {
    Client.findOneAndUpdate({client_id: clientId}, {status: false}, {useFindAndModify: false}, function (err) {
        if (err)
            Utils.LogToFile(`Unable to disconnect inactive client ${clientId}`)
    })
}

const ValidateClients = (currentTimeDate) => {
    let parsed = Utils.ParseCurrentTimeDate(currentTimeDate)
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
                    }
                    else
                        DisconnectClient(client.client_id);
                } else
                    DisconnectClient(client.client_id);
            })
        }
    })
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
                Location.deleteMany({client_id: clientId},function(err){
                    if(err)
                        Utils.LogToFile(`Error removing client location on cleanup ID: ${clientId}: ${err}`)
                })
                Command.deleteMany({client_id: clientId},function(err){
                    if(err)
                        Utils.LogToFile(`Error removing client commands on cleanup: ${clientId}: ${err}`)
                })
                Response.deleteMany({client_id: clientId},function(err){
                    if(err)
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
    return Client.countDocuments({status:true}, function (err) {
        if (err)
            Utils.LogToFile(`Error getting statistics for amount of online clients, ${err}`)
    });
}
module.exports.NumConnectedClients = NumConnectedClients;

const NumDisconnectedClients = async () => {
    return Client.countDocuments({status:false}, function (err) {
        if (err)
            Utils.LogToFile(`Error getting statistics for amount of offline clients, ${err}`)
    });
}
module.exports.NumDisconnectedClients = NumDisconnectedClients;

