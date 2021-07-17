module.exports = function base64Decode(req, res, next) {
    if (req.body.response) {
        let buff = Buffer.from(req.body.response, 'base64');
        let decodedData = buff.toString('ascii');
        try {
            req.body.response = JSON.parse(decodedData);
        } catch (err) {
            let parsed = decodedData.split('\\n')
            req.body.response = parsed.join('\n');
        }
    }
    next()
}