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

/* Present the dashboard of occupant */
/* Default: Display the information about the id, location and previous policies of this user */
getRouter.get('/occupant', function (req, res) {
    console.log('-------------------- Page of Occupant --------------------');
    console.log(req.cookies);
    if(req.cookies.authorized) {
        let name = req.cookies.authorized;

        let message = getLocationInfo(name, function(json_1) {
            let message = getPoliciesInfo(name, function(json_2) {
                res.render('occupant', {
                    title: name,
                    valueOfId: name,
                    valueOfLoc: json_1.location,
                    all: json_2});
            })
        })
    } else {
        res.redirect('/login');
    }
});


/* Connect with database, search the information about user's location */
function getLocationInfo(name, callback) {

    pool.getConnection((error, connection) => {

        console.log("-------------------- Occupant: Get a db connection from the pool to search location --------------------");
        if (error) throw error;

        //Search the database according to the userId.
        var sql = 'SELECT * FROM occupant WHERE user_id = "' + name + '";';
        console.log(sql);
        connection.query(sql, function(err, result) {

            if (err) {
                console.log('-------------------- Error --------------------');
                console.log(err);
                throw err;
            } else if (result.length == 0) {
                console.log('-------------------- No relevant records --------------------');
                return;
            } else {
                console.log('-------------------- Succeed: Get Location Information --------------------');
                let message = JSON.stringify(result);
                message = JSON.parse(message);
                console.log(message);
                callback(message[0]);
            }
            console.log('-------------------- *************** --------------------\n\n');
        });
        connection.release();
        console.log("-------------------- Occupant: Release the db connection --------------------");
    });
}


/* Connect with database, search the information about user's previous policies (maybe empty) */
function getPoliciesInfo(name, callback) {

    pool.getConnection((error, connection) => {

        console.log("-------------------- Occupant: Get a db connection from the pool to search Policies --------------------");
        if (error) throw error;

        //Search the database according to the userId.
        let sql = 'SELECT * FROM policies WHERE id = "' + name + '";';
        console.log(sql);

        connection.query(sql, function(err, result) {

            if (err) {
                console.log('-------------------- Error to Find Location --------------------');
                console.log(err);
                throw err;
            } else if (result.length == 0) {
                console.log('-------------------- Empty record about the policy --------------------');
                callback("Empty record about the policy");
            } else {
                console.log('-------------------- Policies --------------------');
                let message = JSON.stringify(result);
                console.log(result);
                message = JSON.parse(message);
                // Fill data in table to display previous access policies
                let str1 = "";
                for(let i = 0; i < message.length; i++){
                    str1 += "<tr>";
                    str1 += "<td>" + message[i].data_req +"</td>";
                    str1 += "<td>" + message[i].association +"</td>";
                    str1 += "<td>" + message[i].role +"</td>";
                    str1 += "<td>" + message[i].date_begin +"</td>";
                    str1 += "<td>" + message[i].date_end +"</td>";
                    str1 += "</tr>";
                }
                console.log(str1);
                console.log(message);
                callback(str1);
            }
            console.log('-------------------- *************** --------------------\n\n');
        });
        connection.release();
        console.log("-------------------- Occupant: Release the db connection --------------------");
    });
}

exports.get = getRouter;