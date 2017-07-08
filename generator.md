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
