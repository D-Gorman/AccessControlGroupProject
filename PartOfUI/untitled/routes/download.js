const express = require('express');
const getRouter = express.Router();

/* Present the page of download  */
getRouter.get('/download', function(req, res) {
    if(req.cookies.authorized) {
        let user_id = req.cookies.authorized;
        res.render('download', {valueOfID: user_id, valueOfResult: ' '});
    }
});

exports.get = getRouter;