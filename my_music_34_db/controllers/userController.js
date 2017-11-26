/*
* @Author: Marte
* @Date:   2017-11-23 21:49:20
* @Last Modified by:   Marte
* @Last Modified time: 2017-11-24 13:59:58
*/

'use strict';
const db = require('../models/01_db.js');
let userController = {

};
/**
 * [检查用户是否存在]
 * @param  {[type]}   req  [description]
 * @param  {[type]}   res  [description]
 * @param  {Function} next [description]
 * @return {[type]}        [description]
 */
userController.checkUser=(req,res,next)=>{
    // 1、获取请求体中的数据 req.body
    let username = req.body.username;
    console.log(username)
    // 2、查询用户名是否存在于数据库中
    db.q('select * from users where username = ?',[username],(err,data)=>{
        if(err) return next(err);
        if(data.length == 0 ){
            res.json({
                code:'001',
                msg:'可以注册'
            })
        }else{
            res.json({
                code:'002',
                msg:'用户名已经存在了'
            })
        }
    })
}
/**
 * [用户注册]
 * @param  {[type]}   req  [description]
 * @param  {[type]}   res  [description]
 * @param  {Function} next [description]
 * @return {[type]}        [description]
 */

// 步骤：1.接收请求体数据
//       2.数据进行验证（邮箱、用户名、验证码（验证码不存在数据库中，此处先不做））
//       3.插入数据
//       4.返回json对象
userController.doRegister = (req,res,next)=>{
    // 1.接收请求体数据
    let userData = req.body;
    let username = userData.username;
    let email = userData.email;
    let password = userData.password;
    let v_code = username.v_code;
    console.log(userData);
    // 2.数据进行验证
    // 2.1；验证码验证暂留
    // 2.2验证邮箱是否合法 (正则)

    let reg = /^(\w)+(\.\w+)*@(\w)+((\.\w+)+)$/;

    if(!reg.test(email)){
        res.json({
            code:'004',msg:'邮箱不合法'
        });
        return;
    };
    // 2.3验证用户名与邮箱是否存在（被注册过）
    db.q('select * from users where username = ? or email = ?',[username,email],(err,results)=>{
        if(err) return next(err);
        if(results.length == 0){
            db.q('insert into users (username,password,email) values (?,?,?)',[username,password,email],(err,result)=>{
                if(err) return next(err);
                res.json({
                    code:'001',msg:'注册成功'
                });

                return;

            })
        }else{
            let user = results[0];
            if(user.username == username){
               res.json({
                code:'002',
                msg:'用户名已经存在'
               })
                return;
            };
            if(user.email == email){
               res.json({
                code:'003',
                msg:'邮箱已经存在'
               })
                return;
            }
        }
    })
}


/**
 * [登录]
 * @param  {[type]}   req  [description]
 * @param  {[type]}   res  [description]
 * @param  {Function} next [description]
 * @return {[type]}        [description]
 */
// 步骤：1.接收数据   2.验证用户名与密码  3.返回json对象
userController.doLogin = (req,res,next)=>{
    let user = req.body;
    let username = user.username;
    let password = user.password;
    let remember_me = user.remember_me;

    db.q('select * from users where username = ?',[username],(err,result)=>{
        if(err) return next(err);
        if(result.length == 0){
           return res.json({
                code:'002',
                msg:'用户名或密码不正确'
            });
        };
        // 用户已经存在
        // data 中包含那一条用户的所有信息
        let data = result[0];
        if(data.password != password){
           return res.json({
                code:'002',
                msg:'用户名或者密码不正确'
            })
        }
        // 给session上存储用户数据
        req.session.user = data
        // 只要session上有.user就说明登录了
        res.json({
            code:'001',
            msg:'登录成功'
        })
    })
}

//退出登录
userController.logout = (req,res,next)=>{
    req.session.user = null;
    res.json({
        code:'001',
        msg:'退出登录成功'
    })
}

// 显示登录页面
userController.showLogin = (req,res,next)=>{
    res.render('login.html');
}
// 注册页面
userController.showRegister = (req,res,next)=>{
    res.render('register.html');
}

//向外导出
module.exports = userController;