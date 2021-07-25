let connection = require('../bin/mysql')
// let jwt = require('jsonwebtoken')
// const secret = 'skdjafkldjf'

function login(req,res) {
    //打印请求报文
    let param = req.body;
    let loginID = param.loginID;
    let password = param.password;
    var response 
    if(loginID && password){
        //1、查询数据库中是否有此账号
        connection.query("SELECT * FROM USERS WHERE loginID = ?",[loginID], function (error, results, fields) {
            if (error) throw error;
            if(results.length >= 1){
                //2、如果有用户名，查询密码是否相同
                if(password == results[0].password){
                    //3、密码相同则登陆成功
                    response = {...results, msg: '登录成功', code: 1}
                    res.send(response);
                }else {
                    response = {meg: '登陆失败，密码错误', code: 2}
                    res.send(response);
                }
            }else {
                response = { msg: '登陆失败，没有此用户名', code: 2 }
                res.send(response);
            }
        });
    }else {
        response = { msg: '登陆失败，用户名或密码不能为空', code: 2}
        res.send(response);
    }
}

module.exports = login;
