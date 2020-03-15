const express = require('express');
const getRouter = express.Router();
const postRouter = express.Router();

const mysql = require('mysql');
const pool = mysql.createPool({
    connectionLimit: 100,
    host:     '127.0.0.1',
    user:     'root',
    password: 'mysql',
    database: 'usbaccess'
});

getRouter.get('/UpData', function (req, res) {
    console.log('-------------------- GET: Page of DataRequest --------------------');
    if(req.cookies.authorized) {
        user_id = req.cookies.authorized;
        var message = getOccupantInfo(user_id, function(json) {
            role = json.role;

            first_name = json.first_name;
            last_name = json.last_name;
            association = json.association;
            email = json.email;
            res.render('Updata', {title: user_id, valueOfID: user_id, valueOfRole: role, FirstName: first_name, LastName: last_name, valueOfMail: email, valueOfAss: association});
        })
    }
});

postRouter.post('/UpData', function (req, res) {
    console.log(':)');
    if(req.cookies.authorized) {
        console.log(':)))))')

        let sqlParams = new Array(5);
        //sets values for insertion
        sqlParams[0] = req.cookies.authorized;
        sqlParams[1] = req.body.association;
        sqlParams[2] = req.body.dataLocation;
        sqlParams[3] = req.body.date_start;
        sqlParams[4] = req.body.date_end;

        let selections = req.body.datarequired;
        console.log("\nType of Data Requests: ");
        for (let count = 0; count < selections.length; count++) {
            console.log(count + " : " + selections[count]);
        }

        pool.getConnection((error, connection) => {
            console.log("-------------------- Data Request: Get a db connection from the pool --------------------");
            if (error) throw error;

            for (let count = 0; count < selections.length; count++) {
                console.log("Insert " + count + " : " + selections[count]);

                sqlParams[5] = selections[count]; //these are the data requests
            
                //look for a matching policy in the table
                var findPolicySql = 'SELECT * FROM policies WHERE id = "' + req.cookies.authorized + '" AND data_req = "' + sqlParams[5] + '";';
                console.log(findPolicySql);
                connection.query(findPolicySql, function(err, result) {

                    if (err) {
                        console.log('-------------------- Search error --------------------');
                        console.log(err);
                        throw err;
                    } else if (result.length == 0) {
                        console.log('-------------------- No matching entry --------------------'); //must insert policy
                        var insertSql = 'INSERT INTO policies (id, type, location, date_begin, date_end, data_req) VALUES (?, ?, ?, ?, ?, ?)';
                        console.log(insertSql + ' ' + sqlParams);

                        connection.query(insertSql, sqlParams, function(err, result) {
        
                            if (err) {
                                console.log('-------------------- Insert Error --------------------');
                                console.log(err.message);
                                return;
                            } else {
                                console.log('-------------------- Inserted Successfully --------------------');
                            }
                            console.log('-------------------- *************** --------------------\n\n');
                        });
                        return;
                    } else {
                        console.log('-------------------- Entry found --------------------'); //must update entry
                        //var updateSql = 'UPDATE policies SET (type, location, date_begin, date_end) VALUES (?, ?, ?, ?)';
                        var updateSql = "UPDATE policies SET type = ?, location = ?, date_begin = ?,  date_end = ? WHERE id = ? AND data_req = ?";

                        //set params for updating - slightly different
                        let sqlUpdate = new Array(4);
                        sqlUpdate[0] = sqlParams[1];
                        sqlUpdate[1] = sqlParams[2];
                        sqlUpdate[2] = sqlParams[3];
                        sqlUpdate[3] = sqlParams[4];
                        sqlUpdate[4] = sqlParams[0];
                        sqlUpdate[5] = sqlParams[5]

                        connection.query(updateSql, sqlUpdate, function(err, result) {
        
                            if (err) {
                                console.log('-------------------- Update Error --------------------');
                                console.log(err.message);
                                return;
                            } else {
                                console.log('-------------------- Updated Successfully --------------------');
                            }
                            console.log('-------------------- *************** --------------------\n\n');
                        });
                        return;
                    }
                });
            }
            connection.release();
            console.log("-------------------- Data Request: Release the db connection --------------------");
            res.redirect('/researcher');
        });
    } else {
        res.send(403); 
    }
});


function getOccupantInfo(name, callback) {

    pool.getConnection((error, connection) => {

        console.log("-------------------- Data Request: Get a db connection from the pool to search Occupant Information --------------------");
        if (error) throw error;

        //Search the database according to the userId.
        var sql = 'SELECT * FROM occupant WHERE user_id = "' + name + '";';
        console.log(sql);
        connection.query(sql, function(err, result) {

            if (err) {
                console.log('-------------------- Error to search --------------------');
                console.log(err);
                throw err;
            } else if (result.length == 0) {
                console.log('-------------------- Find Nothing --------------------');
                return;
            } else {
                console.log('-------------------- Researcher Information --------------------');
                //转换json
                var message = JSON.stringify(result);
                message = JSON.parse(message);
                console.log(message);
                callback(message[0]);
            }
            console.log('-------------------- *************** --------------------\n\n');
        });
        connection.release();
        console.log("-------------------- Data Request: Release the db connection --------------------");
    });
}
exports.get = getRouter;
exports.post = postRouter;
