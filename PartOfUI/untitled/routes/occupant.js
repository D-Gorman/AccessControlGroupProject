const express = require('express');
const getRouter = express.Router();

const mysql = require('mysql');
// var connection = mysql.createConnection({
//     host: '127.0.0.1',
//     user: 'root',
//     password: 'mysql',
//     database: 'loginInfo'
// });

const pool = mysql.createPool({
    connectionLimit: 100,
    host:     '127.0.0.1',
    user:     'root',
    password: 'mysql',
    database: 'loginInfo'
});


getRouter.get('/occupant', function (req, res) {
    console.log('-------------------- Page of Occupant --------------------');
    console.log(req.cookies);
    if(req.cookies.authorized) {
        var name = req.cookies.authorized;

        var message = getLocationInfo(name, function(json_1) {
            //res.render('occupant', {valueOfId: name, valueOfLoc: json.location, policy_opts: json.policy});
            var message = getHistLog(json_1.location, function(json_2) {
                res.render('occupant', {valueOfId: name, valueOfLoc: json_1.location, policy_opts: json_1.policy, listOfReqs: json_2});
            })
        })
    } else {
        res.redirect('/login');
    }
});

exports.get = getRouter;


function getLocationInfo(name, callback) {

    pool.getConnection((error, connection) => {

        console.log("-------------------- Occupant: Get a db connection from the pool to search location --------------------");
        if (error) throw error;

        //Search the database according to the userId.
        var sql = 'SELECT * FROM test_2 WHERE userId = "' + name + '";';
        console.log(sql);
        connection.query(sql, function(err, result) {

            if (err) {
                console.log('-------------------- Error to Find Location --------------------');
                console.log(err);
                throw err;
            } else if (result.length == 0) {
                console.log('Login Error: Please enter a correct userId.');
                return;
            } else {
                console.log('-------------------- Location Information --------------------');
                //转换json
                var message = JSON.stringify(result);
                message = JSON.parse(message);
                console.log(message);
                console.log(message[0].location);
                callback(message[0]);
            }
            console.log('-------------------- *************** --------------------\n\n');
        });
        connection.release();
        console.log("-------------------- Occupant: Release the db connection --------------------");
    });
}

function getHistLog(loc, callback) {
    //connection.connect();

    pool.getConnection((error, connection) => {

        console.log("-------------------- Occupant: Get a db connection from the pool to search previous log --------------------");
        if (error) throw error;

        //Search the database according to the location.
        var sql_1 = 'SELECT * FROM test_2_logs WHERE location = "' + loc + '";';
        console.log(sql_1);
        connection.query(sql_1, function (err, result) {

            if (err) {
                console.log('-------------------- Error to Find Log --------------------');
                console.log(err);
                return;
            } else if (result.length == 0) {
                console.log('Error: Please enter a correct location.');
                return;
            } else {
                console.log('-------------------- Log Information --------------------');
                //转换json
                var message = JSON.stringify(result);
                //message = JSON.parse(message);
                console.log(message);
                callback(message);
            }
            console.log('-------------------- *************** --------------------\n\n');
        });
        //connection.end();
        connection.release();
        console.log("-------------------- Occupant: Release the db connection --------------------");
    });
}