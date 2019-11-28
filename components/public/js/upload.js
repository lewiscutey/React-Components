
function upload(url,input,progress,img,callback){
    this.url=url;
    this.input=input;
    this.progress=progress;
    this.img=img;
    this.callback=callback;
    this.type=["image/jpeg","image/png","image/gif"];
    this.size=1024*1024*100;
}
upload.prototype={
    up:function(){
        var that=this;
        //1. 事件监听
        this.input.onchange=function(){
            that.fileObj=this.files[0];
            //2. 检测规范
            if(!that.check()){
                return false;
            }
            //让相应的控件显示
             // that.img.parentNode.style.display="block";
              //that.progress.parentNode.style.display="block";
            //3.预览文件
            that.view();
            //4.整合数据
            var data=that.getData();
            //5.上传
            that.ajax(data);

        }
    },
    check:function(){
        var that=this;
        //1.检测大小
        if(that.fileObj.size>that.size){
            alert("文件太大");
            that.input.value="";
            return false;
        }
        //2.检测类型
        /*
        var flag=true;
        for(var i=0;i<that.type.length;i++){
            if(that.fileObj.type==that.type[i]){
                flag=false;
                break;
            }
        }
        if(flag){
            alert("上传文件类型不符");
            that.input.value="";
            return false;
        }
        */

        return true;
    },
    view:function(){

        var that=this;
        var fileread=new FileReader();
        fileread.readAsDataURL(that.fileObj);
        fileread.onload=function(e){
            //that.img.src=e.target.result;
        }

    },
    getData:function(){
        var formdata=new FormData();
        formdata.append("file",this.fileObj);
        return formdata;
    },

    ajax:function(data){
        var that=this;
        var xmlobj=new XMLHttpRequest();
        xmlobj.upload.onloadstart=function(){
            that.input.setAttribute("disabled","disabled");
        }
        /*
        xmlobj.upload.onprogress=function(e){
            var bili= e.loaded/ e.total*100+"%";
            that.progress.style.width=bili;
            that.progress.innerHTML=bili;
        }
        */
        xmlobj.onload=function(){
            that.input.removeAttribute("disabled");
            that.input.value="";
            //that.callback(xmlobj.response);
        }
        console.log(this.url);
        xmlobj.open("post",this.url);
        xmlobj.send(data)
    }
}