const Utils = require('./utilFunctions')
const Command = require('../Commands/commands.model')
const Client = require('../Clients/client.model')


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


const RemoveClient = (clientId) => {
    return (
        Client.findOneAndDelete({client_id: clientId}, {}, function (err) {
            if (err) {
                Utils.LogToFile(`Error removing client ${clientId}: ${err}`)
                return false
            } else {
                Utils.LogToFile(`Removed ${clientId} successfully!`)
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