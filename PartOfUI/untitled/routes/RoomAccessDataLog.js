
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

getRouter.get('/RoomAccessDataLog', function (req, res) {
    console.log('-------------------- Page of RoomAccessDataLog --------------------');
    if(req.cookies.authorized) {
        let name = req.cookies.authorized;
        let message = getLocationInfo(name, function(json_1) {
            let message = getLogDepLocation(json_1.location, function(json_2) {
                res.render('RoomAccessDataLog', {all: json_2});
            })
        })
      //
      //       var sql1 = 'SELECT location FROM occupant WHERE user_id = "' + name + '";';
      // var message1 = function(callback){
      //      pool.query(sql1, function (err, result1) {
      //          if (err) {
      //              console.log('-------------------- Error to Find Location --------------------');
      //              console.log(err);
      //              throw err;
      //          } else {
      //              var message1 = JSON.stringify(result1);
      //              console.log(result1);
      //              message1 = JSON.parse(message1);
      //              console.log(message1[0].location);
      //              callback(message1[0].location);
      //          }
      //      });
      //  }
      //
      //  message1(function (data) {
      //
      //      var message = getLogDepLocation(data, function (json) {
      //
      //          var message = getHistLog(json_1.location, function (json_2) {
      //              res.render('RoomAccessDataLog', {
      //                  valueOfId: json_2.id,
      //                  username: json_2.name,
      //                  valueOfLoc: json_1.location,
      //                  listOfReqs: json_2.email,
      //                  role: json_2.role,
      //                  data: json_2.data_req,
      //                  association: json_2.association,
      //                  date_begin: json_2.data_begin,
      //                  date: json_2.date,
      //                  all: json_3
      //              });
      //          });
      //          res.render('RoomAccessDataLog', {all: json});
      //
      //      });
      //  });
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
                //转换json
                let message = JSON.stringify(result);
                message = JSON.parse(message);
                console.log(message);
                callback(message[0]);
            }
            console.log('-------------------- *************** --------------------\n\n');
        });
        connection.release();
        console.log("-------------------- Log: Release the db connection --------------------");
    });
}


function getLogDepLocation(loc, callback) {

    pool.getConnection((error, connection) => {

        console.log("-------------------- Log: Get a db connection from the pool to search Log(according to location) --------------------");
        if (error) throw error;

        //Search the database according to the userId.
        var sql = 'SELECT * FROM data_request_log WHERE location = "' + loc + '";';
        console.log(sql);
        pool.query(sql, function(err, result) {

            if (err) {
                console.log('-------------------- Error to Find Location --------------------');
                console.log(err);
                throw err;
            } else if (result.length == 0) {
                console.log('-------------------- Empty record about the requests --------------------');
                callback("Empty record about the requests");
            } else {
                console.log('-------------------- Location Information --------------------');
                let message = JSON.stringify(result);
                console.log(result);
                message = JSON.parse(message);
                let str1 = "";
                for(let i=0;i<message.length;i++){
                    str1 += "<tr>";
                    str1 += "<td>" + message[i].location +"</td>";
                    str1 += "<td>" + message[i].id +"</td>";
                    str1 += "<td>" + message[i].name +"</td>";
                    str1 += "<td>" + message[i].email +"</td>";
                    str1 += "<td>" + message[i].role +"</td>";
                    str1 += "<td>" + message[i].data_req +"</td>";
                    str1 += "<td>" + message[i].association +"</td>";
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
//                 var message = JSON.stringify(result);
//                 message = JSON.parse(message);
// /*                var str1 = "";
//                 for(var i=0;i<message.length;i++){
//                     str1 += "<tr>";
//                     str1 += "<td>" + message[i].id +"</td>";
//                     str1 += "<td>" + message[i].name +"</td>";
//                     str1 += "<td>" + message[i].email +"</td>";
//                     str1 += "<td>" + message[i].role +"</td>";
//                     str1 += "<td>" + message[i].data_req +"</td>";
//                     str1 += "<td>" + message[i].association +"</td>";
//                     str1 += "<td>" + message[i].location +"</td>";
//                     str1 += "<td>" + message[i].date_begin +"</td>";
//                     str1 += "<td>" + message[i].date_end +"</td>";
//                     str1 += "<td>" + message[i].reason +"</td>";
//                     str1 += "<td>" + message[i].state +"</td>";
//                     str1 += "</tr>";
//                 }
//                 console.log(str1);*/
//                 console.log(message);
//                 console.log(message[0].location);
//                 callback(message[0]);
//             }
//             console.log('-------------------- *************** --------------------\n\n');
//         });
//         //connection.end();
//         connection.release();
//         console.log("-------------------- Log: Release the db connection --------------------");
//     });
// }



