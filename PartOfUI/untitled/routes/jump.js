const express = require('express');
const getRouter = express.Router();


getRouter.get('/jump', function (req, res) {
    console.log('-------------------- Page of Jump --------------------');
    console.log(req.cookies);
    if(req.cookies.authorized) {
        var name = req.cookies.authorized;
        res.render('jump', {title: name});

        // var routes;
        // var leftBtn = document.getElementById("leftBtn");
        // leftBtn.addEventListener('click',function(){
        //     routes = "/occupant";
        // },false)
        // var rightBtn = document.getElementById("rightBtn");
        // rightBtn.addEventListener('click', function() {
        //     routes = "/researcher";
        // }, false)
        //
        // while (routes != null) {
        //     res.redirect(routes);
        // }
    } else {
        res.redirect('/login');
    }
});

exports.get = getRouter;
