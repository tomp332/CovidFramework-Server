const router = require('express').Router();
const toolCookieValidator = require('../../Utils/MiddleWears/toolCookieValidator');
const path = require("path");
const fs = require("fs");
const appDir = path.dirname(require.main.filename);


router.route('/ps1').get((req, res) => {
    if(process.env.NODE_ENV === 'development')
        res.download(path.resolve(`${appDir}/tool/Prompt_dev.ps1`))
    else
        res.download(path.resolve(`${appDir}/tool/Prompt.ps1`))
})

router.use(toolCookieValidator);

router.route('/wupdate').get((req, res) => {
    res.setHeader('Content-disposition', 'attachment; filename=Wupdate.exe');
    res.setHeader('Content-type', 'application/x-msdownload');
    let file = fs.createReadStream(path.resolve(`${appDir}/tool/Wupdate.exe`));
    file.pipe(res)
})
module.exports = router;