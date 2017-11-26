/*
* @Author: Marte
* @Date:   2017-11-24 20:26:22
* @Last Modified by:   Marte
* @Last Modified time: 2017-11-24 20:31:13
*/

'use strict';
const express = require('express');
const musicController = require('./controllers/musicController.js');
// 配置路由规则  开始
let router = express.Router();
router.get('/add-music',musicController.showAddMusic)
.get('/list-music',musicController.showListMusic)
// 配置路由规则  结束
module.exports = router;
