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

let user_id;
let role;
let association;
let first_name;
let last_name;
let email;

getRouter.get('/DataRequestForm', function (req, res) {
    console.log('-------------------- GET: Page of DataRequest --------------------');
    if(req.cookies.authorized) {
        user_id = req.cookies.authorized;
        var message = getResearcherInfo(user_id, function(json) {
            role = json.role;
            first_name = json.first_name;
            last_name = json.last_name;
            association = json.association;
            email = json.email;
            res.render('DataRequestForm', {title: user_id, valueOfID: user_id, valueOfRole: role, FirstName: first_name, LastName: last_name, valueOfMail: email, valueOfAss: association});
        })
    }
});


postRouter.post('/DataRequestForm', function (req, res) {
    console.log('-------------------- POST: Submit request in the Data Request Form Page --------------------');

    let sqlParams = new Array(10);
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
    // console.log(sqlParams);

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

            sqlParams[9] = selections[count];

            //Insert data
            // var sql = 'SELECT hash, dashboard FROM login_info WHERE user_id = "' + name + '";';
            var sql = 'INSERT INTO data_request_log (id, role, email, association, name, location, date_begin, date_end, reason, data_req) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)';
            console.log(sql + ' ' + sqlParams);

            connection.query(sql, sqlParams, function(err, result) {

                if (err) {
                    console.log('-------------------- Insert Error --------------------');
                    console.log(err.message);
                    return;
                } else {
                    console.log('-------------------- Insert ' + count + ' Successfully --------------------');
                }
                console.log('-------------------- *************** --------------------\n\n');
            });
        }
        connection.release();
        console.log("-------------------- Data Request: Release the db connection --------------------");
        res.redirect('/researcher');
    });
})


exports.get = getRouter;
exports.post = postRouter;


function getResearcherInfo(name, callback) {

    pool.getConnection((error, connection) => {

        console.log("-------------------- Data Request: Get a db connection from the pool to search Researcher Information --------------------");
        if (error) throw error;

        //Search the database according to the userId.
        var sql = 'SELECT * FROM researcher WHERE user_id = "' + name + '";';
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


//
// function isDate(dateString){
//     if(dateString.trim()=="")return true;
//     var r=dateString.match(/^(\d{1,4})(-|\/)(\d{1,2})\2(\d{1,2})$/);
//     // var r=dateString.match(/^(\d{1,2})(-|\/)(\d{1,2})\2(\d{1,4})$/);
//     if(r==null){
//         alert("请输入格式正确的日期\n\r日期格式：dd-mm-yyyy\n\r例 如：2020-01-29\n\r");
//         return false;
//     }
//     var d=new Date(r[1],r[3]-1,r[4]);
//     var num = (d.getFullYear()==r[1]&&(d.getMonth()+1)==r[3]&&d.getDate()==r[4]);
//     // var d=new Date(r[4],r[3]-1,r[1]);
//     // var num = (d.getDate()==r[4]&&(d.getMonth()+1)==r[3]&&d.getFullYear()==r[1]);
//     if(num==0){
//         alert("请输入格式正确的日期\n\r日期格式：dd-mm-yyyy\n\r例 如：2020-01-29\n\r");
//     }
//     return (num!=0);
// }
//
// function f(){
//     var form = document.getElementById("formId");
//     var role = document.getElementById("role").value;
//     var firstName = document.getElementById("fname").value;
//     var lastName = document.getElementById("lname").value;
//     var eMail = document.getElementById("email").value;
//     var association = document.getElementById("association").value;
//
//     var datalocation = document.getElementById("dlocation").value;
//
// }
//
//
// //连接数据库，从表中取值判断
// function rbac() {
//     var role = document.getElementById(role).value;
//     var datalocation = document.getElementById(datalocation).value;
//     //select userId from user
//     if(role==role&&datalocation==datalocation){
//         //支持下载
//     }
//     else {
//         alert("你没有资格访问该房间的数据");
//     }
// }
//


/*
var mysql  = require('mysql');
var bodyParser = require('body-parser');
// 创建 application/x-www-form-urlencoded 编码解析
var urlencodedParser = bodyParser.urlencoded({ extended: false })
const express = require('express');
const path = require('path');
const app = express();
var cnt = 0;
/!*****数据库配置*****!/
var connection = mysql.createConnection({
    host     : 'localhost',
    user     : 'root',
    password : 'xxx',
    port: '3306',
    database: 'StudentInfo',
    useConnectionPooling:true
});


var addSql = 'INSERT INTO form(role,firstname,lastname,email,association,datarequired,datalocation,datechoose,reason) VALUES(?,?,?,?,?)';
var addSqlParams=new Array(5);
/!****web页面显示*****!/
app.use(express.static(path.join(__dirname, 'public')));
/!****web提交数据处理****!/
app.post('/posttable', urlencodedParser, function (req, res) {
    addSqlParams[0] = req.body.role;
    addSqlParams[1] = req.body.firstname;
    addSqlParams[2] = req.body.lastname;
    addSqlParams[3] = req.body.email;
    addSqlParams[4] = req.body.association;
    addSqlParams[5] = req.body.datarequired;
    addSqlParams[6] = req.body.datalocation;
    addSqlParams[7] = req.body.datechoose;
    addSqlParams[8] = req.body.datestring;
    addSqlParams[9] = req.body.reason;

    /!***数据库连接***!/
//    connection.connect();
    /!****插入数据*****!/
    connection.query(addSql,addSqlParams,function (err, result) {
        if(err){
            //插入失败，返回错误信息
            console.log('[INSERT ERROR] - ',err.message);
            res.end(err.message+" ");
        }else{
            //插入成功则返回时间+success
            console.log('insert success!');
            res.end(new Date().toLocaleString()+':success');
        }


    });
    cnt = cnt + 1;
    console.log('insert success!');
    res.end('success');
});
app.listen(8000, () => {
    console.log('server listening at port 8000')
});
*/


