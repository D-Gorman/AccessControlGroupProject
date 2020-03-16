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

let dataLocation;

getRouter.get('/UpData', function (req, res) {
    console.log('-------------------- GET: Page of UpData --------------------');
    if(req.cookies.authorized) {
        let user_id = req.cookies.authorized;
        var message = getOccupantInfo(user_id, function(json) {
            let role = json.role;
            dataLocation = json.location;
            res.render('Updata', {valueOfLoc: dataLocation, flag: 0});
        })
    }
});

postRouter.post('/UpData', function (req, res) {
    console.log(':)');
    if(req.cookies.authorized) {
        console.log(':)))))')

        let sqlParams = new Array(7);
        //sets values for insertion
        sqlParams[0] = req.cookies.authorized;
        sqlParams[1] = dataLocation;
        sqlParams[2] = req.body.association;
        sqlParams[3] = req.body.role;
        sqlParams[4] = req.body.date_start;
        sqlParams[5] = req.body.date_end;

        //Seconds after 1970-01-01
        let date1_s=sqlParams[4].replace(/\-/g,'/');
        let date2_s=sqlParams[5].replace(/\-/g,'/');
        if (Date.parse(date1_s) > Date.parse(date2_s)) {
            console.log(Date.parse(date1_s) + " " + Date.parse(date2_s));
            return res.render('Updata', {valueOfLoc: dataLocation, flag: 2});
        }

        console.log("\nType of Data Policies: ");
        if (req.body.datarequired == '.') {
            console.log("-------------------- Warning: Please select the type of data --------------------");
            return res.render('Updata', {valueOfLoc: dataLocation, flag: 1});
        }
        let selections = req.body.datarequired;
        for (let count = 0; count < selections.length; count++) {
            console.log(count + " : " + selections[count]);
        }

        pool.getConnection((error, connection) => {
            console.log("-------------------- Update Data: Get a db connection from the pool --------------------");
            if (error) throw error;

            for (let count = 0; count < selections.length - 1; count++) {
                console.log(count + " : Set policies for " + selections[count]);

                sqlParams[6] = selections[count]; //these are the data requests

                console.log(sqlParams);

                //look for a matching policy in the table
                var findPolicySql = 'SELECT * FROM policies WHERE id = "' + req.cookies.authorized + '" AND data_req = "' + sqlParams[6] + '";';
                console.log(findPolicySql);
                connection.query(findPolicySql, function(err, result) {

                    if (err) {
                        console.log('-------------------- Search error --------------------');
                        console.log(err);
                        throw err;
                    } else if (result.length == 0) {
                        console.log('-------------------- No matching entry --------------------'); //must insert policy
                        let insertSql = 'INSERT INTO policies (id, location, association, role, date_begin, date_end, data_req) VALUES (?, ?, ?, ?, ?, ?, ?)';
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
                        var updateSql = "UPDATE policies SET location = ?, association = ?, role = ?, date_begin = ?, date_end = ? WHERE id = ? AND data_req = ?";

                        //set params for updating - slightly different
                        let sqlUpdate = new Array(7);
                        sqlUpdate[0] = sqlParams[1];
                        sqlUpdate[1] = sqlParams[2];
                        sqlUpdate[2] = sqlParams[3];
                        sqlUpdate[3] = sqlParams[4];
                        sqlUpdate[4] = sqlParams[5];
                        sqlUpdate[5] = sqlParams[0];
                        sqlUpdate[6] = sqlParams[6];

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
            console.log("-------------------- Update Data: Release the db connection --------------------");
            res.redirect('/occupant');
        });
    } else {
        res.send(403); 
    }
});


function getOccupantInfo(name, callback) {

    pool.getConnection((error, connection) => {

        console.log("-------------------- Update Data: Get a db connection from the pool to search Occupant Information --------------------");
        if (error) throw error;

        //Search the database according to the userId.
        let sql = 'SELECT * FROM occupant WHERE user_id = "' + name + '";';
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
                let message = JSON.stringify(result);
                message = JSON.parse(message);
                console.log(message);
                callback(message[0]);
            }
            console.log('-------------------- *************** --------------------\n\n');
        });
        connection.release();
        console.log("-------------------- Update Data: Release the db connection --------------------");
    });
}
exports.get = getRouter;
exports.post = postRouter;
