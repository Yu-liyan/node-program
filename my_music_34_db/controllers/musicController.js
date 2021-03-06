// module.exports 默认是一空对象，和exports 是相等的
'use strict';
// 引入数据库操作db对象
const db = require('../models/01_db.js');
//解析文件上传
const formidable = require('formidable');
//引入path核心对象
const path = require('path');
// 引入配置对象
const config = require('../config')



/**
 * [添加音乐]
 * @param  {[type]}   req  [description]
 * @param  {[type]}   res  [description]
 * @param  {Function} next [description]
 * @return {[type]}        [description]
 */
// 步骤：1.先判断是否有用户登录
//       2.接收数据，判断参数的选择，然后进行数据的插入
//       3.返回json对象
exports.addMusic = (req,res,next)=>{

    //判断是否存在session上的user

    // console.log(req.session.user);



    var form = new formidable.IncomingForm();
    form.uploadDir = path.join(config.rootPath,'public/files');
    form.parse(req, function(err, fields, files) {
        if(err) return next(err);
        // { title: '告白气球', singer: '周杰伦', time: '03:00' }
        // { file:{}
        // console.log(fields);
        // console.log(files);
        //获取6个字段中的3个
        let datas = [fields.title,fields.singer,fields.time];
        let sql = 'insert into musics (title,singer,time,';
        let params = '(?,?,?';
        //两个路径
        if(files.file){
            //获取文件名
            let filename = path.parse(files.file.path).base;
            //如果上传了文件
            datas.push(`/public/files/${filename}`);
            sql += 'file,';
            params += ',?';
        }
        if(files.filelrc){
            //获取文件名
            let lrcname = path.parse(files.filelrc.path).base;
            //如果上传了文件
            datas.push(`/public/files/${lrcname}`);
            sql += 'filelrc,';
            params += ',?';
        }
        params += ',?)';
        sql += 'uid) values ';
        //用户的id
        datas.push(req.session.user.id);
        // console.log(sql);
        // console.log(params);
        //插入音乐数据
        db.q(sql + params ,datas,(err,data)=>{
            res.json({
                code:'001',
                msg:'添加音乐成功'
            });
        });
    });
};
/**
 * [更新音乐]
 * @param  {[type]}   req  [description]
 * @param  {[type]}   res  [description]
 * @param  {Function} next [description]
 * @return {[type]}        [description]
 */
 // put方式
// 步骤：1.先判断是否登录；获取点击的那条歌曲的数据
//       2.在数据库执行数据更新操作
//       3.返回json对象
exports.updateMusic = (req,res,next)=>{
    //判断是否存在session上的user
   // 在路由中间之前统一判断了
    var form = new formidable.IncomingForm();
    form.uploadDir = path.join(config.rootPath,'public/files');
    form.parse(req, function(err, fields, files) {
        if(err) return next(err);
        //获取6个字段中的3个
        let sql = 'update musics set title=?,singer=?,time=?,';
        let datas = [fields.title,fields.singer,fields.time];
        //两个路径
        if(files.file){
            //获取文件名
            let filename = path.parse(files.file.path).base;
            //如果上传了文件
            datas.push(`/public/files/${filename}`);
            sql += 'file=?,';
        }
        if(files.filelrc){
            //获取文件名
            let lrcname = path.parse(files.filelrc.path).base;
            //如果上传了文件
            datas.push(`/public/files/${lrcname}`);
            sql += 'filelrc=?,';
        }
        //去除一个逗号
        sql = sql.substr(0,sql.length -1);
        //加上条件
        sql += 'where id = ?';
        datas.push(fields.id);
        //更新音乐数据
        db.q(sql,datas,(err,data)=>{
            res.json({
                code:'001',
                msg:'更新音乐成功'
            });
        });
    });
};

/**
 * 删除音乐
 * @param  {[type]}   req  [description]
 * @param  {[type]}   res  [description]
 * @param  {Function} next [description]
 * @return {[type]}        [description]
 */
// 步骤：1.判断是否登录  2.登录的情况下点击删除，获取歌曲的id 操作数据库
// 3.返回json对象
exports.delMusic = (req,res,next)=>{

    // 用户的id
    let userId = req.session.user.id;
    // 接收参数，通过url传递参数
    let musicId = req.query.id;
    db.q('delete from musics where uid = ? and id = ?',[userId,musicId],(err,result)=>{
        if(err) return next(err);
       // 存在两种情况，1.歌曲存在删除  (通过返回的结果对象中有一个affectedRows 可以判断，如果不存在为0)2.歌曲不存在(因为在这个地方我们没有做限制一台设备登录的情况，所以可能在另一台设备上这条数据已经删除了)
       if(result.affectedRows == 0){
        return res.json({
            code:'002',
            msg:'歌曲不存在'
        })
       }
       // 删除成功
       res.json({
        code:'001',
        msg:'删除成功'
       })
    })
}
/**
 * 添加音乐页面
 */
exports.showAddMusic = (req,res,next)=>{
    res.render('add.html');
}

/**
 * 音乐列表页面
 */
exports.showListMusic = (req,res,next)=>{
    res.render('list.html');
}
