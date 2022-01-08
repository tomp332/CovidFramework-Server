const auth = require('basic-auth')
const compare = require('tsscmp')

module.exports = function grafanaAuth(req, res, next) {
    let credentials = auth(req)
    if (!credentials || !check(credentials.name, credentials.pass)) {
        res.sendStatus(401)
    } else
        next()
}

function check(name, pass) {
    let valid = true
    valid = compare(name, 'admin') && valid
    valid = compare(pass, process.env.SECRET) && valid
    return valid
}

