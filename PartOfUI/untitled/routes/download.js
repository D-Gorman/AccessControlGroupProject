const express = require('express');
const getRouter = express.Router();

// const mysql = require('mysql');
//
// const pool = mysql.createPool({
//     connectionLimit: 100,
//     host:     '127.0.0.1',
//     user:     'root',
//     password: 'mysql',
//     database: 'usbaccess'
// });


/* Present the page of download  */
getRouter.get('/download', function(req, res) {
    if(req.cookies.authorized) {
        let user_id = req.cookies.authorized;
        res.render('download', {valueOfID: user_id, valueOfResult: 'empty'});
    }
});

exports.get = getRouter;