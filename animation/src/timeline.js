'use strict'

var DEFAULT_INTERVAL= 1000/60；

//初始状态
var STATE_INITIAL= 0;
//开始状态
var STATE_START= 1;
//停止状态
var STATE_STOP= 2;

var requestAnimationFrame = (function(){
  return window.requestAnimationFrame ||
         window.webkitRequestAnimationFrame ||
         window.mozkitRequestAnimationFrame ||
         window.oRequestAnimationFrame ||
         function (callback){
           return window.setTimeout(callback,callback.interval || DEFAULT_INTERVAL)
         }
})()

var cancelAnimationFrame = (function(){
  return window.cancelAnimationFrame ||
         window.webkitCancelAnimationFrame ||
         window.mozkitCancelAnimationFrame ||
         window.oCancelAnimationFrame ||
         function (id){
           return window.clearTimeout(id);
         }
})()

// 时间轴类
function Timeline(){
  this.animationHandler = 0;
  this.state = STATE_INITIAL;
}

Timeline.prototype.onenterframe= function(time){

};

Timeline.prototype.start = function(interval) {
   if(this.state === STATE_START) return;

   this.state = STATE_START;

   this.interval = interval || DEFAULT_INTERVAL;
   startTimeline(this, +new Date());
}

Timeline.prototype.stop = function(){
   if(this.state !== STATE_START) return;

   this.state = STATE_STOP;

   if(this.startTime) {
     this.dur= +new Date() - this.startTime;
   }
   cancelAnimationFrame(this.animationHandler);
}

Timeline.prototype.restart= function(){
   if(this.state === STATE_START) return;

   if(!this.dur || !this.interval){
     return;
   }
   // 无缝实现动画
   startTimeline(this, +new Date() - this.dur);
}

function startTimeline(timeline, startTime){
  timeline.startTime = startTime;
  nextTick.interval = timeline.interval;

  var lastTick = +new Date();
  nextTick();
  // 每一帧执行的函数
  function nextTick(){
    var now = +new Date();

    timeline.animationHandler = requestAnimationFrame(nextTick);

    if(now - lastTick>= timeline.interval){
      timeline.onenterframe(now-startTime);
      lastTick = now;
    }
  }
}

module.export = timeline;
