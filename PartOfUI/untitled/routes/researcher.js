const express = require('express');
const getRouter = express.Router();


const mysql = require('mysql');
const pool = mysql.createPool({
    connectionLimit: 100,
    host:     '127.0.0.1',
    user:     'root',
    password: 'mysql',
    database: 'loginInfo'
});

getRouter.get('/researcher', function (req, res) {
    console.log('-------------------- Page of Researcher --------------------');
    console.log(req.cookies);
    if(req.cookies.authorized) {
        var name = req.cookies.authorized;
        res.render('researcher', {title: name});
    } else {
        res.redirect('/login');
    }
});

exports.get = getRouter;