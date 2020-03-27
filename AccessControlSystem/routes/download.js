const express = require('express');
const getRouter = express.Router();

/* Present the page of download */
getRouter.get('/download', function(req, res) {
    // build function download() and function getCookie() in download.ejs
});

exports.get = getRouter;