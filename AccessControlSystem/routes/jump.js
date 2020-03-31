const express = require('express');
const getRouter = express.Router();

/* Present the page of jump */
/* Provide two button to redirect to different dashboards */
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
