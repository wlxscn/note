## koa的常用方法

```
var koa= require('koa');
var app= koa();
app.listen(3000);
```

一个Koa应用(app)就是一个对象，包含了一个middleware数组，数组由Generator函数组成。

1. listen(port)
   上面的代码相当于

```
var http = require('http');
var koa = require('koa');
var app = koa();
http.createServer(app.callback()).listen(3000);
```  

2. callback()
返回一个可被http.createServer()接受的程序实例，也可以将这个返回函数挂载在一个Connect/Express应用中。

3. use(function)
将给定的function当做中间件加载到应用中

## 错误处理

除非 NODE_ENV 被配置为 "test"，Koa 都将会将所有错误信息输出到 stderr，也可以自定义「错误事件」来监听 Koa app 中发生的错误，比如记录错误日志：

```
app.on('error', function(err){
  log.error('server error', err);
});
```

当任何 req 或者 res 中出现的错误无法被回应到客户端时，Koa 会在第二个参数传入这个错误的上下文：

```
app.on('error', function(err, ctx){
  log.error('server error', err, ctx);
});
```

## 上下文
将request和response封装在一个单独的对象里面，context在每个request请求中被创建，可以通过this标识符来引用

```
app.use(function *(){
  this; // is the Context
  this.request; // is a koa Request
  this.response; // is a koa Response
});
```

## 中间件

+ 两个中间件级联

```
app.use(function *() {
  this.body = "header\n";
  yield saveResults.call(this);
  this.body += "footer\n";
});

function *saveResults() {
  this.body += "Results Saved!\n";
}
```

跳过一个中间件，在该中间件的第一行写上 return yield next;

koa要求中间件的唯一参数是next,所以要传入其他参数，需要写一个返回generator函数的函数。

```
function logger(format) {
  return function *(next){
    var str = format
      .replace(':method', this.method)
      .replace(':url', this.url);

    console.log(str);

    yield next;
  }
}

app.use(logger(':method :url'));
```

+ 中间件的合并(koa-compose)

```
function *random(next) {
  if ('/random' == this.path) {
    this.body = Math.floor(Math.random()*10);
  } else {
    yield next;
  }
};

function *backwards(next) {
  if ('/backwards' == this.path) {
    this.body = 'sdrawkcab';
  } else {
    yield next;
  }
}

function *pi(next) {
  if ('/pi' == this.path) {
    this.body = String(Math.PI);
  } else {
    yield next;
  }
}

function *all(next) {
  yield random.call(this, backwards.call(this, pi.call(this, next)));
}

app.use(all);
```

## 路由

```
app.use(function* (next) {
  if (this.path !== '/') {
    return yield next
  }

  this.body = 'hello world'
});

// /404 route
app.use(function* (next) {
  if (this.path !== '/404') {
    return yield next;
  }

  this.body = 'page not found'
});
```

复杂的路由需要安装koa-router插件

```
var app = require('koa')();
var Router = require('koa-router');

var myRouter = new Router();

myRouter.get('/', function *(next) {
  this.response.body = 'Hello World!';
});

app.use(myRouter.routes());

app.listen(3000);
```

router常用的方法：
>router.get()
>router.post()
>router.put()
>router.del()
>router.patch()

这些方法接受两个参数，第一个是路径模式，第二个是控制器方法
可以为路径模式起别名，别名为方法的第一个参数

```
router.get('user', '/users/:id', function *(next) {

});
```

koa-router可以 为路径添加前缀：

```
var router = new Router({
  prefix: '/users'
});

router.get('/', ...); // 等同于"/users"
router.get('/:id', ...); // 等同于"/users/:id"
```

路径参数(this.params)

```
router.get('/:category/:title', function *(next) {
  console.log(this.params);
  // => { category: 'programming', title: 'how-to-node' }
});
```
针对命名参数进行校验

```
router
  .get('/users/:user', function *(next) {
    this.body = this.user;
  })
  .param('user', function *(id, next) {
    var users = [ '0号用户', '1号用户', '2号用户'];
    this.user = users[id];
    if (!this.user) return this.status = 404;
    yield next;
  })
```

redirect方法将某个路径的请求重定向到另一个路径

```
router.redirect('/login', 'sign-in');
```  
