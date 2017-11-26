/*
* @Author: Marte
* @Date:   2017-11-23 11:02:13
* @Last Modified by:   Marte
* @Last Modified time: 2017-11-23 12:19:38
*/


// 引入数据库对象
const mysql = require('mysql');
const pool = mysql.createPool({
    connectionLimit: 10,
    host: '127.0.0.1',
    user: 'root',
    password: 'yuliyan112',
    database: 'node_music'
});

let q = function(sql,props,callback){
      pool.getConnection((err, connection)=> {
        if(err)return callback(err,null);
        connection.query(sql,props,(error, results)=>{
            connection.release();
            //不管有没有error,让外部判断
            callback(error,results);
        })
    });
}

// 将q向外暴露
module.exports = {
    q:q
};
// 封装为对象是为了更为灵活，api使用的时候更加语义化