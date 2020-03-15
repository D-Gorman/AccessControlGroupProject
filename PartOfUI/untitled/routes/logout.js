const express = require('express');
const getRouter = express.Router();


getRouter.get('/logout', function (req, res) {
    console.log('-------------------- Clear Cookies, Jump to Page of Login --------------------');
    // req.cookies.clearCookie('authorized');
    res.clearCookie('authorized');
    res.clearCookie('dashboard');
    res.clearCookie('room_number');
    res.clearCookie('start_date');
    res.clearCookie('end_date');
    res.clearCookie('sensor_type');
    res.redirect('/login');

});

exports.get = getRouter;
