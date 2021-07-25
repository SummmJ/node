let connection = require('../bin/mysql')

function rand(min,max) {
    return Math.floor(Math.random()*(max-min))+min;
}

function register(req,res) {
    debugger
    //打印请求报文
    console.log(JSON.stringify(req.body))
    var param = req.body;
    var username = param.username;
    var loginID = param.loginID;
    var password = param.password;
    
    var response 
    if(username && password && loginID){
        //1、查看数据库中是否有相同用户名  
        connection.query("SELECT * FROM USERS WHERE username = ? OR loginID = ?",[username, loginID], function (error, results, fields) {
            if (error) throw error;
            if(results.length >= 1){
                //2、如果有相同用户名，则注册失败，用户名重复
                // response = new Response(false,'注册失败，用户名重复',-1);
                if(results[0].userName == username) {
                    response = {msg: '注册失败，用户名重复', code: 2}
                } else if(results[0].loginID == loginID) {
                    response = {msg: '该账号已经注册', code: 3}
                }
                res.send(response);
            }else{
                let userID = rand(1000,9999)
                connection.query("INSERT INTO users(userID, username, loginID, password) VALUES(?,?,?,?)", [userID, username, loginID, password], function (error, results, fields) {
                    if (error) throw error;
                    //3、如果没有相同用户名，并且有一条记录，则注册成功
                    if(!(results.length >= 1)){
                        response = {msg: '注册成功', code: 1}
                        res.send(response);
                    }else {
                        response = {msg: '注册失败'}
                        res.send(response);
                    }
                });
            }
        })
    }else{
        response = {msg: '注册失败，用户名、密码、用户号不能为空', code: 0}
        res.send(response);
    }
}


module.exports = register;