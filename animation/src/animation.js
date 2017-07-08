'use strict'

var loadImage= require('./loadImage');
var Timeline= require('./timeline');

var STATE_INITIAL= 0;

var STATE_START= 1;

var STATE_STOP= 2;

// 同步任务
var TASK_SYNC = 0;
// 异步任务
var TASK_ASYNC = 1;

function next(callback) {
  callback && callback()
}

function Animation (){
   this.taskQueue = [];
   this.index = 0;
   this.timeline = new Timeline();
   this.state= STATE_INITIAL;
};

Animation.prototype.loadImage = function (imgList){
   var taskFn= function(next){
     loadImage(imgList.slice(),next);
   }
   var type = TASK_SYNC;

   return this._add(taskFn, type);
};

Animation.prototype.changePositon = function (ele, positions, imageUrl) {
   var len= positions.length;
   var taskFn;
   var type;

   if(len){
     var self= this;
     taskFn = function(next, time){
        if(imageUrl){
          ele.style.backgroundImage= 'url(' + imageUrl+ ')';
        }
        var index= Math.min(time/self.interval | 0,len-1); //'| 0' 是比Math.floor更快的一种向下取整的方法
        var position= positions[index].split(' ');
        ele.style.backgroundPosition= position[0] + 'px ' + position[1] + 'px';
        if(index === len-1){
          next();
        }
     }
     type= TASK_ASYNC;
   }else{
     taskFn = next;
     type= TASK_SYNC;
   }


};

Animation.prototype.changeSrc = function (ele, src) {

};

Animation.prototype.enterFrame = function(taskFn) {

};

Animation.prototype.then = function(callback) {

};

Animation.prototype.start = function(interval) {
   if(this.state === STATE_START){
     return this;
   }

   if(!this.taskQueue.length) {
     return this;
   }

   this.state = STATE_START;
   this.interval = interval;
   this._runTask();
   return this;
};

Animation.prototype.repeat = function(times) {

};

Animation.prototype.repeatForever = function() {

}

Animation.prototype.wait =function(time) {

}

Animation.prototype.pause= function(){

}

Animation.prototype.restart= function(){

}

Animation.prototype.dispose= function(){

}

//添加任务到任务队列
Animation.prototype._add= function(taskFn, type){
  this.taskQueue.push({
    taskFn: taskFn,
    type: type
  })

  return this;
}

Animation.prototype._runTask= function(){
  if(!this.taskQueue || this.state !== STATE_START) {
    return;
  }
  if(this.index ==== this.taskQueue.length){
    this.dispose();
    return;
  }
  //获的任务链上的当前任务
  var task= this.taskQueue[this.index];
  if(task.type === TASK_SYNC){
    this._syncTask(task);
  }else{
    this._asyncTask(task);
  }
}

Animation.prototype._syncTask= function(task){
  var self= this;
  var next = function(){
    self._next();
  }

  var taskFn= task.taskFn;
  taskFn(next);
}

Animation.prototype._asyncTask= function(task){
  var self= thsi;
  var enterFrame = function(time) {
    var taskFn = task.taskFn;
    var next= function(){
      self.timeline.stop();
      self._next();
    };
    taskFn(next, time);
  }
  this.timeline.onenterframe = enterFrame;
  this.timeline.start(this.interval);
}

Animation.prototype._next= function(){
  this.index++;
  this._runTask();
}
