const express = require('express');
const getRouter = express.Router();


getRouter.get('/jump', function (req, res) {
    console.log('-------------------- Page of Jump --------------------');
    console.log(req.cookies);
    if(req.cookies.authorized) {
        var name = req.cookies.authorized;
        res.render('jump', {title: name});
    } else {
        res.redirect('/login');
    }
});

exports.get = getRouter;
