const express = require('express');
const getRouter = express.Router();
const postRouter = express.Router();

const mysql = require('mysql');
const pool = mysql.createPool({
    connectionLimit: 100,
    host:     'localhost',
    user:     'acs',
    password: 'mysql',
    database: 'usbaccess'
});

// Global variables
let dataLocation;

/* Present the page of Update Policies */
/* Default: Display the location (user's office room number), which can not be changed */
getRouter.get('/UpDatePolicy', function (req, res) {
    console.log('-------------------- GET: Page of UpDatePolicy --------------------');
    if(req.cookies.authorized) {
        let user_id = req.cookies.authorized;
        let message = getOccupantInfo(user_id, function(json) {
            let role = json.role;
            dataLocation = json.location;
            res.render('UpDatePolicy', {valueOfLoc: dataLocation, flag: 0});
        })
    }
});


/* Deal with the submit of updating policies */
postRouter.post('/UpDatePolicy', function (req, res) {
    console.log(':)');
    if(req.cookies.authorized) {
        console.log(':)))))')

        let sqlParams = new Array(7);
        // sets values for insertion
        sqlParams[0] = req.cookies.authorized;
        sqlParams[1] = dataLocation;
        sqlParams[2] = req.body.association;
        sqlParams[3] = req.body.role;
        sqlParams[4] = req.body.date_start;
        sqlParams[5] = req.body.date_end;

        // Seconds after 1970-01-01
        // Compare the initial time and the end time
        // Prevent the end time being earlier than the start time
        let date1_s = sqlParams[4].replace(/\-/g,'/');
        let date2_s = sqlParams[5].replace(/\-/g,'/');
        if (Date.parse(date1_s) > Date.parse(date2_s)) {
            console.log(Date.parse(date1_s) + " " + Date.parse(date2_s));
            return res.render('UpDatePolicy', {valueOfLoc: dataLocation, flag: 2});
        }

        // Set a default selection of checkbox: "." in UpdatePolicy.ejs which is invisible and unchangeable.
        // Prevent a situation when there is only one selection of checkbox, the string will be split into letters.
        // Exclude cases where checkbox is not selected and issue a warning on the interface
        console.log("\nType of Data Policies: ");
        if (req.body.datarequired == '.') {
            console.log("-------------------- Warning: Please select the type of data --------------------");
            return res.render('UpDatePolicy', {valueOfLoc: dataLocation, flag: 1});
        }
        let selections = req.body.datarequired;
        for (let count = 0; count < selections.length; count++) {
            console.log(count + " : " + selections[count]);
        }

        // For each selections of the checkbox
        // Search relevant policies in database
        // When there is no relevant policy about this type of data, insert new one
        // When there is a historical record, update the data
        for (let count = 0; count < selections.length - 1; count++) {
            console.log("-------------------- --------------------");
            console.log(count + " : Set policies for " + selections[count]);

            let message = matchPolicy(selections[count], function(match_result) {
                insertOrUpdate(selections[count], count, match_result);
            })
        }
        return res.redirect('/occupant');


        // search the database, find out whether these is matching policy set by this user for this kind of data
        function matchPolicy(selections, callback) {

            pool.getConnection((error, connection) => {
                console.log("-------------------- UpDatePolicy: Get a db connection from the pool to look for a matching policy in the table--------------------");
                if (error) throw error;

                //sqlParams[6] = selections; //these are the data requests
                console.log(sqlParams);

                //look for a matching policy from the database
                let findPolicySql = 'SELECT * FROM policies WHERE id = "' + req.cookies.authorized + '" AND data_req = "' + selections + '";';
                console.log(findPolicySql);
                connection.query(findPolicySql, function(err, result) {

                    if (err) {
                        console.log('-------------------- Search error --------------------');
                        console.log(err);
                        throw err;
                    } else if (result.length == 0) {
                        console.log('-------------------- No matching entry, Insert Policy --------------------'); //must insert policy
                        callback("INSERT");
                    } else {
                        console.log('-------------------- Entry found, Update Policy --------------------'); //must update entry
                        callback("UPDATE");
                    }
                    console.log('-------------------- *************** --------------------\n\n');
                });
                connection.release();
                console.log("-------------------- UpDatePolicy: In matchPolicy(), Release the db connection --------------------");
            });
        }


        // According to the call-back result, decide to insert or update policy
        function insertOrUpdate(selections, count, result) {

            if (result == "INSERT") {

                pool.getConnection((error, connection) => {
                    console.log("-------------------- " + count + " UpDatePolicy: Get a db connection from the pool to insert matching policy--------------------");
                    if (error) throw error;

                    let insertSql = 'INSERT INTO policies (id, location, association, role, date_begin, date_end, data_req) VALUES (?, ?, ?, ?, ?, ?, ?)';
                    sqlParams[6] = selections;
                    console.log(insertSql + ' ' + sqlParams);

                    connection.query(insertSql, sqlParams, function(err, result) {

                        if (err) {
                            console.log("-------------------- Insert Error --------------------");
                            console.log(err.message);
                            return;
                        } else {
                            console.log("-------------------- " + count + " Inserted Successfully --------------------");
                        }
                        console.log('-------------------- *************** --------------------\n\n');
                    });
                    connection.release();
                    console.log("-------------------- UpDatePolicy: In insertOrUpdate() " + count + " , Release the db connection --------------------");
                });
            } else if (result == "UPDATE") {

                pool.getConnection((error, connection) => {
                    console.log("-------------------- " + count + " UpDatePolicy: Get a db connection from the pool to update policy--------------------");
                    if (error) throw error;

                    // var updateSql = 'UPDATE policies SET (type, location, date_begin, date_end) VALUES (?, ?, ?, ?)';
                    let updateSql = "UPDATE policies SET location = ?, association = ?, role = ?, date_begin = ?, date_end = ? WHERE id = ? AND data_req = ?";

                    // set params for updating - slightly different
                    let sqlUpdate = new Array(7);
                    sqlUpdate[0] = sqlParams[1];
                    sqlUpdate[1] = sqlParams[2];
                    sqlUpdate[2] = sqlParams[3];
                    sqlUpdate[3] = sqlParams[4];
                    sqlUpdate[4] = sqlParams[5];
                    sqlUpdate[5] = sqlParams[0];
                    sqlUpdate[6] = selections;

                    console.log(updateSql + ' ' + sqlUpdate);

                    connection.query(updateSql, sqlUpdate, function(err, result) {

                        if (err) {
                            console.log("-------------------- Update Error --------------------");
                            console.log(err.message);
                            return;
                        } else {
                            console.log("-------------------- " + count + " Updated Successfully --------------------");
                        }
                        console.log('-------------------- *************** --------------------\n\n');
                    });
                    connection.release();
                    console.log("-------------------- UpDatePolicy: In insertOrUpdate() " + count + " , Release the db connection --------------------");
                });
            }
        }
    } else {
        res.send(403); 
    }
});


/* Connect with database, search the user's information */
function getOccupantInfo(name, callback) {

    pool.getConnection((error, connection) => {

        console.log("-------------------- UpDatePolicy: Get a db connection from the pool to search Occupant Information --------------------");
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
        console.log("-------------------- UpDatePolicy: Release the db connection --------------------");
    });
}

exports.get = getRouter;
exports.post = postRouter;