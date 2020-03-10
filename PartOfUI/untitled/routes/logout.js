const express = require('express');
const getRouter = express.Router();


getRouter.get('/logout', function (req, res) {
    console.log('-------------------- Clear Cookies, Jump to Page of Login --------------------');
    // req.cookies.clearCookie('authorized');
    res.clearCookie('authorized');
    // console.log(req.cookies);
    res.redirect('/login');

});

exports.get = getRouter;
