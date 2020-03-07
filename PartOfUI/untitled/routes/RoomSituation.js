const express = require('express');
const getRouter = express.Router();


// const mysql = require('mysql');
// const pool = mysql.createPool({
//     connectionLimit: 100,
//     host:     '127.0.0.1',
//     user:     'root',
//     password: 'mysql',
//     database: 'loginInfo'
// });

getRouter.get('/RoomSituation', function (req, res) {
    console.log('-------------------- Page of Room Situation --------------------');
    console.log(req.cookies);
    if(req.cookies.authorized) {
        var name = req.cookies.authorized;
        res.render('RoomSituation', {title: name});
    }
    // else {
    //     res.redirect('/login');
    // }
});

exports.get = getRouter;