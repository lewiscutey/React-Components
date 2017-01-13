var express = require('express');
var router = express.Router();
var mysql=require("mysql");
var markdown = require( "markdown" ).markdown;
var fs=require("fs");

var db = mysql.createConnection({
    host     : 'localhost',
    user     : 'root',
    password : 'root',
    database : 'component'
});

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/comp/:cat/:com/layout/index.html', function(req, res, next) {
    var caturl=req.params.cat;
    var comurl=req.params.com;
    var url=process.cwd()+"/comp/"+caturl+"/"+comurl+"/layout/index.md";
    var mdStr=fs.readFileSync(url).toString();
    console.log(mdStr);
    var htmlStr=markdown.toHTML(mdStr)
       htmlStr=" <link rel='stylesheet' href='/css/github-markdown.css'><div class='markdown-body'>"+htmlStr+"</div>"
    res.send(htmlStr);
});
router.get('/comp/:cat/:com/:zip', function(req, res, next) {
    var caturl=req.params.cat;
    var comurl=req.params.com;
    var zip=req.params.zip;
    var url=process.cwd()+"/comp/"+caturl+"/"+comurl+"/"+zip;
    res.sendFile(url);
});

router.get("/ajaxUrl",function(req,res){
      db.query("select * from component",function(error,rows){
          if(error){
              console.log(error);
          }else{
              if(rows.length>0){

                  var arr=[];

                  for(var i=0;i<rows.length;i++){
                      if(rows[i].pid==0){
                          var obj={catname:rows[i].catname,id:rows[i].id};
                          arr.push(obj);
                      }
                  }

                  var result={};

                  for(var i=0;i<arr.length;i++){
                      var newarr=[];
                      for(var j=0;j<rows.length;j++){
                          if(arr[i].id==rows[j].pid){
                              var obj={
                                  catname:rows[j].catname,
                                  url:rows[j].url,
                                  zurl:rows[j].zurl
                              }
                             newarr.push(obj)
                          }
                      }
                      result[arr[i].catname]=newarr;
                  }

                  res.send(JSON.stringify(result));

              }else{
                  res.send(JSON.stringify(['出错了']));
              }
          }
      })
})


module.exports = router;
