/*
* @Author: Marte
* @Date:   2017-11-23 22:07:23
* @Last Modified by:   Marte
* @Last Modified time: 2017-11-24 13:46:45
*/

'use strict';
const express = require('express');
const userController = require('./controllers/userController');
const musicController = require('./controllers/musicController');
// 4:处理请求
//配置路由规则 开始
let router = express.Router();

//检查用户名是否存在
router.post('/check-user',userController.checkUser)
// 注册
.post('/do-register',userController.doRegister)
// 登录
.post('/do-login',userController.doLogin)
// 退出登录
.get('/logout',userController.logout)
//添加音乐
.post('/add-music',musicController.addMusic)
// 更新音乐
.put('/update-music',musicController.updateMusic)
// 删除音乐
.delete('/del-music',musicController.delMusic)

//配置路由规则 结束

module.exports = router;