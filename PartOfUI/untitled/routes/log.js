
const express = require('express');
const getRouter = express.Router();

const mysql = require('mysql');
// const mysql = require('mysql');
// const pool = mysql.createPool({
//     connectionLimit: 100,
//     host:     '127.0.0.1',
//     user:     'root',
//     password: 'mysql',
//     database: 'loginInfo'
// });

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
            // var message = getHistLog(json_1.location,function (json_2) {
            //     res.render('log', {
            //         valueOfId: json_2.id,
            //         username: json_2.name,
            //         valueOfLoc: json_1.location,
            //         listOfReqs: json_2.email,
            //         role: json_2.role,
            //         typeofproject: json_2.data_req,
            //         association: json_2.association,
            //         data: json_2.data,
            //         date: json_2.date,
            //         all: json_3
            //     });
            // });
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
                var message = JSON.stringify(result);
                console.log(result);
                message = JSON.parse(message);
                var str1 = "";
                for(var i=0;i<message.length;i++){
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
                console.log(str1);
                callback(str1);
            }
            console.log('-------------------- *************** --------------------\n\n');
        });
        connection.release();
        console.log("-------------------- Log: Release the db connection --------------------");
    });
}

//
// function getHistLog(loc, callback) {
//     //connection.connect();
//
//     pool.getConnection((error, connection) => {
//
//         console.log("-------------------- Log: Get a db connection from the pool to search previous log --------------------");
//         if (error) throw error;
//
//         //Search the database according to the location.
//         var sql_1 = 'SELECT * FROM data_request_log WHERE location = "' + loc + '";';
//         console.log(sql_1);
//         connection.query(sql_1, function (err, result) {
//
//             if (err) {
//                 console.log('-------------------- Error to Find Log --------------------');
//                 console.log(err);
//                 return;
//             } else if (result.length == 0) {
//                 console.log('Error: Please enter a correct location.');
//                 return;
//             } else {
//                 console.log('-------------------- Log Information --------------------');
//                 //转换json
//                 var data = JSON.stringify(result);
//                 data = JSON.parse(data);
//                 console.log(data);
//                 callback(data[0]);
//             }
//             console.log('-------------------- *************** --------------------\n\n');
//         });
//         //connection.end();
//         connection.release();
//         console.log("-------------------- Log: Release the db connection --------------------");
//     });
// }
//



/*
username: name,email: "email",role: "role",typeofproject: "typeofproject",association: "association",data: "data",

getRouter.get('/log', function (req, res) {
    console.log('-------------------- Page of Log --------------------');
    console.log(req.cookies);
    if(req.cookies.authorized) {
        var name = req.cookies.authorized;
        res.render('log', {title: name});
    }
    // } else {
    //     res.redirect('/login');
    // }
});

exports.get = getRouter;*/
