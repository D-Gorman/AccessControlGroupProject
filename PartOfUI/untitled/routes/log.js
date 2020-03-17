const express = require('express');
const getRouter = express.Router();

const mysql = require('mysql');

const pool = mysql.createPool({
    connectionLimit: 100,
    host:'localhost',
    user:'root',
    password:'mysql',
    database:'usbaccess',
});

getRouter.get('/log', function (req, res) {
    console.log('-------------------- Page of Occupant --------------------');
    if(req.cookies.authorized) {
        let name = req.cookies.authorized;
        let message = getLocationInfo(name, function(json) {
            res.render('log', {all: json});
        });
    }
        else {
        res.redirect('/login');
    }
});

exports.get = getRouter;


function getLocationInfo(name, callback) {

    pool.getConnection((error, connection) => {

        console.log("-------------------- Log: Get a db connection from the pool to search location --------------------");
        if (error) throw error;

        //Search the database according to the userId.
        var sql = 'SELECT * FROM data_request_log WHERE id = "' + name + '";';
        console.log(sql);
        connection.query(sql, function(err, result) {

            if (err) {
                console.log('-------------------- Error to Find Location --------------------');
                console.log(err);
                throw err;
            } else if (result.length == 0) {
                console.log('-------------------- Empty record about the requests --------------------');
                callback("Empty record about the requests");
            } else {
                console.log('-------------------- Location Information --------------------');
                //转换json
                let message = JSON.stringify(result);
                //console.log(result);
                message = JSON.parse(message);
                let str1 = "";
                for(let i=0;i<message.length;i++){
                    str1 += "<tr>";
                    str1 += "<td>" + message[i].id +"</td>";
                    str1 += "<td>" + message[i].name +"</td>";
                    str1 += "<td>" + message[i].email +"</td>";
                    str1 += "<td>" + message[i].role +"</td>";
                    str1 += "<td>" + message[i].data_req +"</td>";
                    str1 += "<td>" + message[i].association +"</td>";
                    str1 += "<td>" + message[i].location +"</td>";
                    str1 += "<td>" + message[i].date_begin +"</td>";
                    str1 += "<td>" + message[i].date_end +"</td>";
                    str1 += "<td>" + message[i].reason +"</td>";
                    str1 += "<td>" + message[i].state +"</td>";
                    str1 += "</tr>";
                }
                //console.log(str1);
                callback(str1);
            }
            console.log('-------------------- *************** --------------------\n\n');
        });
        connection.release();
        console.log("-------------------- Log: Release the db connection --------------------");
    });
}