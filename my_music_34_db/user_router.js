/*
* @Author: Marte
* @Date:   2017-11-24 13:49:02
* @Last Modified by:   Marte
* @Last Modified time: 2017-11-24 16:39:54
*/

'use strict';
const express = require('express');
const userController = require('./controllers/userController.js')
let router = express.Router();
// 登录页面路由
router.get('/login',userController.showLogin)
.get('/register',userController.showRegister);

module.exports = router;