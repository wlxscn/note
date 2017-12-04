## Generator(生成器)
Generator函数是一个状态机，封装了多个内部状态。
执行Generator函数会返回一个遍历器对象。形式上：

```
function* helloWorldGenerator() {
  yield 'hello';
  yield 'world';
  return 'ending';
}
/*返回一个遍历器对象*/
var hw = helloWorldGenerator();
```

上面的函数有三个状态 hello,world,ending.

### 与Iterator接口的关系

任何一个对象的Symbol.iterator方法等于该对象的遍历器生成函数，调用该方法会生成一个遍历器对象

### next方法的参数
yield语句本身并没有返回值，next可以带一个参数，会被当成上一个yield语句的返回值。

### 为对象增加遍历器接口

1. 用Generator函数封装下对象

```
let obj= {a:1,b:2};

function* ge (obj){
  let propKeys = Reflect.ownKeys(obj);
  for(let pro of propKeys) {
    yield [pro, obj[pro]]
  }
}

ge(obj);

for (let [key, value] of objectEntries(obj)) {
  console.log(`${key}: ${value}`);
}

```

2. 将generator函数放到对象的Symbol.iterator属性上

```
function* objectEntries() {
  let propKeys = Object.keys(this);

  for (let propKey of propKeys) {
    yield [propKey, this[propKey]];
  }
}

let jane = { first: 'Jane', last: 'Doe' };

jane[Symbol.iterator] = objectEntries;

for (let [key, value] of jane) {
  console.log(`${key}: ${value}`);
}
```

## generator处理异步流程

### js的Trunk函数

Trunk函数将多参数函数替换成只接受回调函数作为参数的单参数函数。

```
// 正常版本的readFile（多参数版本）
fs.readFile(fileName, callback);

// Thunk版本的readFile（单参数版本）
var Thunk = function (fileName) {
  return function (callback) {
    return fs.readFile(fileName, callback);
  };
};

var readFileThunk = Thunk(fileName);
readFileThunk(callback);
```

### Trunk函数实现流程管理

```
var fs = require('fs');
var thunkify = require('thunkify');
var readFileThunk = thunkify(fs.readFile);

var gen = function* (){
  var r1 = yield readFileThunk('/etc/fstab');
  console.log(r1.toString());
  var r2 = yield readFileThunk('/etc/shells');
  console.log(r2.toString());
};
```

yield将程序的执行权移出了generator函数，在Trunk的callback函数中可以将执行权交还给generator函数。

手动执行上面的generator函数

```
var g= gen();
var r1= g.next();
r1.value(function(err, data) {
   if(err) throw err;
   var r2= g.next(data);
   r2.value(function(err, data) {
       if(err) throw err;
       g.next(data);
   })
})
```

使用Trunk函数自动执行流程

```
function run(gen) {
   var g= gen();

   function next(err, data) {
      var result= g.next();
      if(result.done) return result.value;
      result.value(next);
   }

   next();  //递归的回调函数
}

run(gen);
```

## co模块实现generator的自动执行

### 基于Promise的自动执行

```
var fs = require('fs');

var readFile = function (fileName){
  return new Promise(function (resolve, reject){
    fs.readFile(fileName, function(error, data){
      if (error) return reject(error);
      resolve(data);
    });
  });
};

var gen = function* (){
  var f1 = yield readFile('/etc/fstab');
  var f2 = yield readFile('/etc/shells');
  console.log(f1.toString());
  console.log(f2.toString());
};
```
----

```
function run(gen){
  var g = gen();

  function next(data){
    var result = g.next(data);
    if (result.done) return result.value;
    result.value.then(function(data){
      next(data);
    });
  }

  next();
}

run(gen);
```
