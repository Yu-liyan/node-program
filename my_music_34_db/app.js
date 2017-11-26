'use strict';
// 1:引入express对象
const express = require('express');
// 2:创建服务器
let app = express();
// 3:开启服务器监听端口
app.listen(9999,()=>{
    console.log('34期服务器启动在9999端口11');
});


// 引入处理post请求的对象
const bodyParser = require('body-parser')
// 引入session对象
const session = require('express-session');


const api_router = require('./web_router.js');
const user_router = require('./user_router.js');
const music_router = require('./music_router.js');
//配置模板引擎
app.engine('html', require('express-art-template') );


// 4:处理请求
//配置路由规则 开始
// let router = express.Router();
// 验证用户 检查用户名是否存在  post请求
// router.post('/api/check-user',userController.checkUser)
// 用户注册
// .post('/api/do-register',userController.doRegister)
// 用户登录
// .post('/api/do-login',userController.doLogin)

//添加音乐
// .post('/api/add-music',(req,res,next)=>{

//     // 判断用户是否登录，如果没有登录，跳回首页
//     if(!req.session.user){
//         res.send(`
//             <div>
//                 你访问的页面离家出走了，请稍后重试
//                 <a href="./user/login">点击</a>
//             </div>
//             `);
//         return;
//     }
//         var form = new formidable.IncomingForm();
//         form.uploadDir = path.join(__dirname,'public/files');
//         form.parse(req, function(err, fields, files){
//             if(err) return next(err);
//             // 获取6个字段中的3个
//             let datas = [fields.title,fields.singer,fields.time];
//             let sql = 'insert into musics(title,singer,time,';
//             let params = 'values (?,?,?,';
//             if(files.file){
//                 // 获取文件名
//                 let filename = path.parse(files.file.path).base;
//                 // 此处用模版字符串，可以嵌套变量
//                 datas.push(`/public/files/${filename}`);
//                 sql += 'file,';
//                 params += '?,';
//             }
//             if(files.filelrc){
//                 let filelrcname = path.parse(files.filelrc.path).base;
//                 datas.push(`/public/files/${filelrcname}`);
//                 sql +='filelrc,';
//                 params += '?,';
//             }

//             sql += 'uid) values';
//             params += '?)';
//             datas.push(req.session.user.id);
//             // uid就是登录的用户的id
//             db.q(sql+params,datas,(err,result)=>{
//                 res.json({
//                     code:'001',
//                     msg:'添加成功'
//                 })
//             })
//         })
// })
// // 更新音乐
// .put('/api/update-music',(req,res,next)=>{
//     if(!req.session.user){
//          res.send(`
//             <div>
//                 你访问的页面离家出走了，请稍后重试
//                 <a href="./user/login">点击</a>
//             </div>
//             `);
//         return;
//     }
//      var form = new formidable.IncomingForm();
//         form.uploadDir = path.join(__dirname,'public/files');
//         form.parse(req, function(err, fields, files){
//             if(err) return next(err);
//             let sql = 'update musics set title = ?,singer = ?,time = ?,';
//             let datas = [fields.title,fields.singer,fields.time];
//             if(files.file){
//                   //获取文件名
//                 let filename = path.parse(files.file.path).base;
//                 //如果上传了文件
//                 datas.push(`/public/files/${filename}`);
//                 sql += 'file=?,';
//             };
//             if(files.filelrc){
//                  //获取文件名
//                 let filelrcname = path.parse(files.filelrc.path).base;
//             //如果上传了文件
//                 datas.push(`/public/files/${filelrcname}`);
//                 sql += 'filelrc=?,';
//             }
//              //去除一个逗号
//             sql = sql.substr(0,sql.length -1);
//             // 加上条件
//             sql += 'where id = ?';
//             datas.push = (fields.id);
//             // 更新音乐数据
//             db.q(sql.datas,(err,result)=>{
//                 if(err) return next(err);
//                 res.json({
//                     code:'001',
//                     msg:'更新成功'
//                 })
//             })
//         })
// })

// 暴露静态资源，否则无法请求道页面
app.use('/public',express.static('./public'));

//配置路由规则 结束

//中间件配置行为列表
//
// 在路由使用session之前，先生产session
app.use(session({
  secret: 'itcast', //唯一标识，必填
  resave: false,
  //true强制保存,不管有没有改动session中的数据，依然重新覆盖一次
  saveUninitialized: true,//一访问服务器就分配session
  //如果为false,当你用代码显式操作session的时候才分配
  // cookie: { secure: true // 仅仅在https下使用 }
}));
//第0件事：
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
// parse application/json
app.use(bodyParser.json());

// 权限验证  通过中间件
// （在这里统一验证，避免在具体功能代码中的冗余）
// 用正则判断是否需要验证是否登录
app.use(/\/music|\/api\/.*music/,(req,res,next)=>{
   if(!req.session.user){
         res.send(`
                 请去首页登录
                 <a href="/user/login">点击</a>
            `);
        return;
    }
    next();
})


//第一件事: 路由(数据接口)
app.use('/api',api_router);
// 第二件事：用户路由
app.use('/user',user_router);
// 第三件事：音乐路由
app.use('/music',music_router);
// 第二件事: 错误处理
app.use((err,req,res,next)=>{
    console.log(err);
    res.send(`
        <div style="background-color:yellowgreen;">
            您要访问的页面，暂时去医院了..请稍后再试..
            <a href="/">去首页</a>
        </div>
    `)
});