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

// Global variable
let user_id;
let role;
let association;
let first_name;
let last_name;
let email;


/* Present the dashboard of researcher */
/* Default: Display the user id, email and reserve a "status" to show the reason of failed request */
getRouter.get('/DataRequestForm', function (req, res) {
    console.log('-------------------- GET: Page of DataRequest --------------------');
    if(req.cookies.authorized) {
        user_id = req.cookies.authorized;
        let message = getResearcherInfo(user_id, function(json) {
            role = json.role;
            first_name = json.first_name;
            last_name = json.last_name;
            association = json.association;
            email = json.email;
            res.render('DataRequestForm', {flag: 0, title: user_id, valueOfID: user_id, valueOfRole: role, FirstName: first_name, LastName: last_name, valueOfMail: email, valueOfAss: association});
        })
    }
});


/* Deal with the submit of requests */
postRouter.post('/DataRequestForm', function (req, res) {
    console.log('-------------------- POST: Submit request in the Data Request Form Page --------------------');

    let sqlParams = new Array(11);
    sqlParams[0] = user_id;
    sqlParams[1] = role;
    sqlParams[2] = email;
    sqlParams[3] = association;
    sqlParams[4] = first_name + ' ' + last_name;
    sqlParams[5] = req.body.datalocation;
    sqlParams[6] = req.body.date_start;
    sqlParams[7] = req.body.date_end;
    sqlParams[8] = req.body.reason;

    console.log("User_id: ", sqlParams[0]);
    console.log("Role: ", sqlParams[1]);
    console.log("Email: ", sqlParams[2]);
    console.log("Association: ", sqlParams[3]);
    console.log("Data Location: Room ", sqlParams[5]);
    console.log("From " + sqlParams[6] + " to " + sqlParams[7]);
    console.log("Purpose for requests:" + sqlParams[8]);

    // Seconds after 1970-01-01
    // Compare the initial time and the end time
    // Prevent the end time being earlier than the start time
    let request_date_begin = sqlParams[6].replace(/\-/g,'/');
    let request_date_end = sqlParams[7].replace(/\-/g,'/');
    if (Date.parse(request_date_begin) > Date.parse(request_date_end)) {
        console.log(Date.parse(request_date_begin) + " " + Date.parse(request_date_end));
        return res.render('DataRequestForm', {flag: 2, title: user_id, valueOfID: user_id, valueOfRole: role, FirstName: first_name, LastName: last_name, valueOfMail: email, valueOfAss: association});
    }
    // Get the timestamp of right now
    // Compare the end time and today
    // Prevent users from requesting data from the future
    let timestamp = Date.parse(new Date());
    if (Date.parse(request_date_end) > timestamp) {
        console.log("End date in request: " + Date.parse(request_date_end) + " <--> " + "Today : " + timestamp);
        return res.render('DataRequestForm', {flag: 3, title: user_id, valueOfID: user_id, valueOfRole: role, FirstName: first_name, LastName: last_name, valueOfMail: email, valueOfAss: association});
    }

    // Set a default selection of checkbox: "." in DataRequestForm.ejs which is invisible and unchangeable.
    // Prevent a situation when there is only one selection of checkbox, the string will be split into letters.
    // Exclude cases where checkbox is not selected and issue a warning on the interface
    console.log("\nType of Data Requests: ");
    if (req.body.datarequired == '.') {
        console.log("-------------------- Warning: Please select the type of data --------------------");
        return res.render('DataRequestForm', {flag: 1, title: user_id, valueOfID: user_id, valueOfRole: role, FirstName: first_name, LastName: last_name, valueOfMail: email, valueOfAss: association});
    }

    let sensor_types = req.body.datarequired;
    console.log(sensor_types);

    // Store accepted result in cookie.
    let sensor_cookie_accepted = '';
    // Store denied result in cookie.
    let sensor_cookie_denied = '';

    // Count of empty policy about the data request.
    let number_of_empty_policy = 0;
    // Count of accepted data request.
    let number_of_accepted_request = 0;

    // For each selection of data request, search the access control policies, make judgement and insert this record as log
    for (let count = 0; count < sensor_types.length - 1; count++) {
        console.log(count + " : Search access control policies for  " + sensor_types[count]);

        let message = authorisation(sensor_types[count], count, function(empty_policy_num, accepted_request_num, authorisation_state) {
            submitLogAndSetCookies(sensor_types[count], count, authorisation_state, function (accepted_cookie, denied_cookie) {

                // after the last request finished, decide what to do next according to total result
                if (count == sensor_types.length - 2) {
                    console.log("Deal with the different result of requests.");
                    // Deal with the different result of requests
                    // 1. No policies for all data requests.    -->   jump to /researcher
                    if (empty_policy_num == sensor_types.length - 1) {
                        return res.render('researcher', {title: user_id, valueOfId: user_id, valueOfMail: email, request_status: 2});
                    }
                    // 2. All requests are denied.              -->   jump to /researcher
                    // 3. At least one request is accepted.      -->   jump to /download
                    if (accepted_request_num == 0) {
                        return res.render('researcher', {title: user_id, valueOfId: user_id, valueOfMail: email, request_status: 1});
                    } else {
                        // Store necessary information in cookie
                        res.cookie("room_number", sqlParams[5], {path: '/'});
                        res.cookie("start_date", sqlParams[6], {path: '/'});
                        res.cookie("end_date", sqlParams[7], {path: '/'});
                        res.cookie("sensor_cookie_accepted", accepted_cookie, {path: '/'});

                        // Display the result(accepted/denied) on /download
                        let table = "";
                        let arr_accepted = accepted_cookie.split(",");
                        let arr_denied = denied_cookie.split(",");
                        console.log("Accepted:" + arr_accepted + "\nDenied: " + arr_denied);
                        for(let i = 0; i < arr_accepted.length - 1; i++){
                            table += "<tr>";
                            table += "<td>" + arr_accepted[i] +"</td>";
                            table += "<td>" + "Accepted" +"</td>";
                            table += "</tr>";
                        }
                        for(let i = 0; i < arr_denied.length - 1; i++){
                            table += "<tr>";
                            table += "<td>" + arr_denied[i] +"</td>";
                            table += "<td>" + "Denied" +"</td>";
                            table += "</tr>";
                        }
                        console.log(table);
                        return res.render('download', {valueOfID: user_id, all: table});
                    }
                }
            });
        })
    }


    function authorisation(sensor, count, callback) {

        pool.getConnection((error, connection) => {

            console.log("-------------------- Data Request: Get a db connection from the pool --------------------");
            if (error) throw error;

            // search the policy according to the location
            let sql = 'SELECT * FROM policies WHERE location = "' + sqlParams[5] + '" AND data_req = "' + sensor +'";';
            // var sql2 = 'SELECT * FROM policies WHERE location = "' + datalocation + '" AND data_req = "' + datarequired +'";';
            console.log(sql);

            connection.query(sql, function(err, result) {

                if (err) {
                    console.log('-------------------- Search error --------------------');
                    console.log(err);
                    throw err;
                } else if (result.length == 0) {
                    console.log(count + " : Error. No such policy for this kind of data.");
                    let authorisation_state = "Denied";
                    number_of_empty_policy++;
                    console.log("number_of_empty_policy " + number_of_empty_policy);

                    callback(number_of_empty_policy, number_of_accepted_request, authorisation_state);
                } else {
                    console.log("-------------------- Result --------------------");
                    let authorisation_state = "Denied";
                    let message = JSON.stringify(result);
                    message = JSON.parse(message);
                    console.log(message);

                    for (let i = 0; i < message.length; i++) {
                        if (sqlParams[1] == String(message[i].role) && String(sqlParams[3]) == String(message[i].association)) {
                            let policy_date_begin = message[i].date_begin.replace(/\-/g,'/');
                            let policy_date_end = message[i].date_end.replace(/\-/g,'/');
                            console.log("Policy: Date From " + policy_date_begin + " To " + policy_date_end);
                            if (request_date_begin >= policy_date_begin && request_date_end <= policy_date_end) {
                                authorisation_state = "Accepted";
                                number_of_accepted_request++;
                            }
                        }
                    }
                    console.log(sensor + "' " + authorisation_state + " '");
                    callback(number_of_empty_policy, number_of_accepted_request, authorisation_state);
                }
                console.log('-------------------- *************** --------------------\n\n');
            });
            connection.release();
            console.log("-------------------- Data Request: Release the db connection --------------------");
        });
    }


    function submitLogAndSetCookies(sensor, count, authorisation_state, callback) {

        pool.getConnection((error, connection) => {

            console.log("-------------------- " + count + " Data Request: Get a db connection from the pool --------------------");
            if (error) throw error;

            sqlParams[10] = authorisation_state;
            sqlParams[9] = sensor;

            console.log("-------------------- " + count + " Data Request: Insert log of request -------------------- ");
            let sql = 'INSERT INTO data_request_log (id, role, email, association, name, location, date_begin, date_end, reason, data_req, state) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)';
            console.log(sql + ' ' + sqlParams);

            connection.query(sql, sqlParams, function(err, result) {

                if (err) {
                    console.log('-------------------- Insert Error --------------------');
                    console.log(err.message);
                    return;
                } else {
                    console.log('-------------------- Insert No.' + count + ' Successfully --------------------');
                }
                console.log('-------------------- *************** --------------------\n\n');
            });

            if (authorisation_state == "Accepted") {
                connection.release();
                console.log("-------------------- Data Request: Release the db connection --------------------");
                sensor_cookie_accepted = sensor_cookie_accepted + sensor + ',';
            } else {
                connection.release();
                console.log("-------------------- Data Request: Release the db connection --------------------");
                sensor_cookie_denied = sensor_cookie_denied + sensor + ',';
            }
            callback(sensor_cookie_accepted, sensor_cookie_denied);
        });
    }
})


/* Connect with database, search the information about the user */
function getResearcherInfo(name, callback) {

    pool.getConnection((error, connection) => {

        console.log("-------------------- Data Request: Get a db connection from the pool to search Researcher Information --------------------");
        if (error) throw error;

        // Search the database according to the userId.
        let sql = 'SELECT * FROM researcher WHERE user_id = "' + name + '";';
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
        console.log("-------------------- Data Request: Release the db connection --------------------");
    });
}


exports.get = getRouter;
exports.post = postRouter;