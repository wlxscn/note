### context对象
 上下文对象
 context对象上的全局属性：request,response,req,res,app,state

 state属性用于在中间件传递信息

### cookie
cookie的读取和设置

```
this.cookie.get('view');
this.cookie.set('view',n);
```

get和set方法都可以接受第三个参数作为配置参数，signed参数指定cookie是否加密。指定加密的话，就需要app.keys指定加密短语

```
app.keys = ['secret1', 'secret2'];
this.cookies.set('name', '张三', { signed: true });
```

### session

```
var session = require('koa-session');
var koa = require('koa');
var app = koa();

app.keys = ['some secret hurr'];
app.use(session(app));

app.use(function *(){
  var n = this.session.views || 0;
  this.session.views = ++n;
  this.body = n + ' views';
})

app.listen(3000);
console.log('listening on port 3000');
``` 
