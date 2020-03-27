const express = require('express');
const getRouter = express.Router();

const mysql = require('mysql');
const pool = mysql.createPool({
    connectionLimit: 100,
    host:     'localhost',
    user:     'acs',
    password: 'mysql',
    database: 'usbaccess'
});


/* Present the dashboard of researcher */
/* Default: Display the user id, email and reserve a "status" to show the reason of failed request */
getRouter.get('/researcher', function (req, res) {
    console.log('-------------------- Page of Researcher --------------------');
    console.log(req.cookies);
    if(req.cookies.authorized) {
        let name = req.cookies.authorized;
        let message = getUserInfo(name, function(json) {
            res.render('researcher', {title: name, valueOfId: name, valueOfMail: json, request_status: 0});
        })
    } else {
        res.redirect('/login');
    }
});


/* Connect with database, search the information about the user's email address */
function getUserInfo(name, callback) {

    pool.getConnection((error, connection) => {

        console.log("-------------------- Researcher: Get a db connection from the pool to search information --------------------");
        if (error) throw error;

        // Search the database according to the userId.
        let sql = 'SELECT * FROM researcher WHERE user_id = "' + name + '";';
        console.log(sql);
        connection.query(sql, function(err, result) {

            if (err) {
                console.log('-------------------- Error to find Location --------------------');
                console.log(err);
                throw err;
            } else if (result.length == 0) {
                console.log('-------------------- No relevant records --------------------');
                return;
            } else {
                console.log('-------------------- Succeed --------------------');
                let message = JSON.stringify(result);
                message = JSON.parse(message);
                console.log(message);
                console.log(message[0].email);
                callback(message[0].email);
            }
            console.log('-------------------- *************** --------------------\n\n');
        });
        connection.release();
        console.log("-------------------- Researcher: Release the db connection --------------------");
    });
}

exports.get = getRouter;