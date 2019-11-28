var express = require('express');
var router = express.Router();
var upload = require('./fileuploads');
var unzip=require("unzip");
var fs=require("fs");
var archiver = require('archiver');
var async=require("async");
var shell=require('shelljs/global');
var compUrl=process.cwd()+"/comp";
var mysql=require("mysql");

var db = mysql.createConnection({
    host     : 'localhost',
    user     : 'root',
    password : '',
    database : 'component'
});


/*
*   id  类名       url  zipurl pid
*   1   gen    xx       xx   xx     0
*   2   button    ..   ...   1
*   3.  panal    ..    ..    1
*   4.   xx      xx    xx    0
*   5     header  ..    ...   4
 *  6    footer  ..    ..    4
*
* */
var catname,url,zurl,pid,name;

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.render("admin");
});

router.post('/upload', upload.single('file'), function (req, res, next) {

    if (req.file) {
        async.series([
            //解压
            function(cb){
                var upzipurl=process.cwd()+"/comp"
                fs.createReadStream(req.file.path).pipe(unzip.Extract({ path: upzipurl}));
                setTimeout(function () {
                    cb();
                },2000)
            },
            //读取json文件并创建目录结构
            function(cb){
              var rmdir=compUrl+"/__MACOSX";

              try {
                  var info=fs.statSync(rmdir);
                  if(info){

                      rm('-rf', rmdir);
                  }
              }catch (e){

              }

              var packageUrl=process.cwd()+"/comp/package.json";
              var packageData=JSON.parse(fs.readFileSync(packageUrl).toString());
              var category=packageData.category;
               catname=category
              name=packageData.name;

               url="/comp/"+catname+"/"+name+"/layout/index.html";
               zurl="/comp/"+catname+"/"+name+"/code.zip";
              //根据json文件的信息，来创建相应的目录
              var destdir=compUrl+"/"+category+"/"+name
              mkdir('-p',destdir);
              //将文件移动到指定的目录里面
              mv(compUrl+"/code",compUrl+"/layout",destdir);
              rm('-rf',compUrl+"/package.json" );

              // 打包输出的文件的路径和名字
                var output = fs.createWriteStream(destdir+"/code.zip");
                var archive = archiver('zip');
                archive.on('error', function(err) {
                    throw err;
                });
                archive.pipe(output);
                archive.glob(destdir+"/code/*.*");
                archive.finalize();
                cb();
            },
            //要处理数据库 处理大类
            function (cb){
               db.query(`select id from component where catname='${catname}'`,function(error,rows){
                    if(error){
                        console.log(error)
                    }else{
                        if(rows.length>0){
                            //大类有
                          pid=rows[0].id;
                            cb();
                        }else{
                            //没有大类
                            db.query(`insert into component (catname,url,zurl,pid) values ('${catname}','${url}','${zurl}',0)`,function(error,info){
                              if(error){
                                  console.log(error)
                              }else{
                                  pid=info.insertId;
                                  cb()
                              }
                            })
                        }
                    }
               })
            },
            //要处理数据库 处理小类
            function (cb){
                db.query(`select id from component where catname='${name}'`,function(error,rows){
                    if(error){
                        console.log(error);
                    }else{
                        if(rows.length>0){
                            cb();
                        }else{
                            db.query(`insert into component (catname,url,zurl,pid) values ('${name}','${url}','${zurl}','${pid}')`,function(error,rows){
                        if(error){
                            console.log(error)
                        }else{
                            cb();
                        }
                            })
                        }
                    }
                })
            }



        ],function(){
            console.log("完毕")
        })
        //1. 解压 -> 2. 读取

        res.send('文件上传成功')

    }
});


module.exports = router;
