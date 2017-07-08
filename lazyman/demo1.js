//1. 先订阅所有的事件，push到放到队列中，sleepFirst会unShift会到队列的首位，先执行
//2. 依次执行队列中的任务

(function(window, undefined){
   var taskList = [];
    // 订阅方法
   function subscribe() {
     var params= {};
     var args= [].slice.apply(arguments);
     if(args.length < 1) {
       throw new Error('参数不能为空');
     }
     params.msg= args[0];
     params.args= args.slice(1);

     if(params.msg == 'sleepFirst'){
       taskList.unshift(params)
     }else {
       taskList.push(params);
     }
   }

   // 执行方法
   function publish(){
     if(taskList.length > 0){
       run(taskList.shift());
     }
   }

   function run(option){
     var msg = option.msg,
       args = option.args;

       switch(msg){
           case "lazyMan": lazyMan.apply(null, args);break;
           case "eat": eat.apply(null, args);break;
           case "sleep": sleep.apply(null,args);break;
           case "sleepFirst": sleepFirst.apply(null,args);break;
           default:;
       }
   }

   function LazyMan(name){
     subscribe("lazyMan", name);
   };

    LazyMan.prototype.eat = function(str){
        subscribe("eat", str);
        return this;
    };

    LazyMan.prototype.sleep = function(num){
        subscribe("sleep", num);
        return this;
    };

    LazyMan.prototype.sleepFirst = function(num){
        subscribe("sleepFirst", num);
        return this;
    };

    // 具体方法
    function lazyManLog(str){
    console.log(str);
}

    function lazyMan(str){
        lazyManLog("Hi!This is "+ str +"!");

        publish();
    }

    function eat(str){
        lazyManLog("Eat "+ str +"~");
        publish();
    }

    function sleep(num){
        setTimeout(function(){
            lazyManLog("Wake up after "+ num);

            publish();
        }, num*1000);

    }

    function sleepFirst(num){
        setTimeout(function(){
            lazyManLog("Wake up after "+ num);

            publish();
        }, num*1000);
    }

    window.LazyMan = function(name){
      setTimeout(publish,0);
      return new LazyMan(name);
    }
})(window)

LazyMan("Hank").sleepFirst(5).eat("supper")
