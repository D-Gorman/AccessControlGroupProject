const express = require('express');
const getRouter = express.Router();

// const mysql = require('mysql');
// const pool = mysql.createPool({
//     connectionLimit: 100,
//     host:     '127.0.0.1',
//     user:     'root',
//     password: 'mysql',
//     database: 'loginInfo'
// });

getRouter.get('/DataRequestForm', function (req, res) {
    console.log('-------------------- Page of DataRequest --------------------');
    console.log(req.cookies);
    if(req.cookies.authorized) {
        var name = req.cookies.authorized;
        res.render('DataRequestForm', {title: name});
    }
    // }
        // else {
    //     res.redirect('/login');
    // }
});

exports.get = getRouter;

function isDate(dateString){
    if(dateString.trim()=="")return true;
    // var r=dateString.match(/^(\d{1,4})(-|\/)(\d{1,2})\2(\d{1,2})$/);
    var r=dateString.match(/^(\d{1,2})(-|\/)(\d{1,2})\2(\d{1,4})$/);
    if(r==null){
        alert("请输入格式正确的日期\n\r日期格式：dd-mm-yyyy\n\r例 如：2020-01-29\n\r");
        return false;
    }
/*    var d=new Date(r[1],r[3]-1,r[4]);
    var num = (d.getFullYear()==r[1]&&(d.getMonth()+1)==r[3]&&d.getDate()==r[4]);*/
    var d=new Date(r[4],r[3]-1,r[1]);
    var num = (d.getDate()==r[4]&&(d.getMonth()+1)==r[3]&&d.getFullYear()==r[1]);
    if(num==0){
        alert("请输入格式正确的日期\n\r日期格式：dd-mm-yyyy\n\r例 如：2020-01-29\n\r");
    }
    return (num!=0);
}

function f(){
    var form = document.getElementById("formId");
    var role = document.getElementById("role").value;
    var firstName = document.getElementById("fname").value;
    var lastName = document.getElementById("lname").value;
    var eMail = document.getElementById("email").value;
    var association = document.getElementById("association").value;

    var datalocation = document.getElementById("dlocation").value;

}


//连接数据库，从表中取值判断
function rbac() {
    var role = document.getElementById(role).value;
    var datalocation = document.getElementById(datalocation).value;
    //select userId from user
    if(role==role&&datalocation==datalocation){
        //支持下载
    }
    else {
        alert("你没有资格访问该房间的数据");
    }
}



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


