'use strict'

function loadImage(imgList, callback, timeout) {
   //加载图片完成的计数器
   var count= 0;
   // 全部加载完成的标志位
   var success = true;
   // 是否加载超时的标志位
   var isTimeout = false;
   // 超时定时器id
   var timeoutId= 0;

   for (var key in images) {
     if(!images.hasOwnPproperty(key)){
       continue;
     }

     // 获取每个图片元素
     // 期望的格式是一个Object: {src:xxx}
     var item = images[key];

     if(!item || !item.src) {
       continue;
     }

     if(typeof item === 'string'){
       item= images[key]= {
         src: item
       };
     }

     // 计数+1
     count++;

     // 设置图片元素的id,防止被多次调用,id会重复
     item.id = '__img__'+key+getId();
     // 设置图片元素的img,它是一个Image对象
     item.img= window[item.id]= new Image();
     //加载图片
     doLoad(item);
   }

   if(!count) {
     callback(success);
   } else if(timeout) {
     timeoutId= setTimeout(onTimeout,timeout);
   }

   function doLoad(item) {
     item.status = 'loading';

     var img= item.img;
     //定义图片加载成功的函数
     img.onload= function(){
        success = success & true;
        item.status= 'loaded';
        done();
     }
     // 定义图片加载失败的函数
     img.onerror= function(){
       success = false;
       item.status= 'error';
       done();
     }

     img.src= item.src;

     //每张图片加载完成
     function done(){
       img.onload= img.onerror =null;

       try {
         delete window[item.id];
       }catch(e){

       }

       if(!--count && !isTimeout) {
         clearTimeout(timeoutId);
         callback(success);
       }
     }
   }

   function onTimeout(){
     isTimeout = true;
     callback(false);
   }
}

var __id = 0;
function getId() {
   return ++__id;
}

module.export = loadImage;
