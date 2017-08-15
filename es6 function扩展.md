## 参数默认值

### 与解构赋值结合使用

```
function foo({x, y = 5} = {}) {
  console.log(x, y);
}

foo() // undefined 5
```

两种赋值默认值的差别

```
// 写法一
function m1({x = 0, y = 0} = {}) {
  return [x, y];
}
--------------------------------------------
// 写法二
function m2({x, y} = { x: 0, y: 0 }) {
  return [x, y];
}
```

```
// 函数没有参数的情况
m1() // [0, 0]
m2() // [0, 0]

// x 和 y 都有值的情况
m1({x: 3, y: 8}) // [3, 8]
m2({x: 3, y: 8}) // [3, 8]

// x 有值，y 无值的情况
m1({x: 3}) // [3, 0]
m2({x: 3}) // [3, undefined]

// x 和 y 都无值的情况
m1({}) // [0, 0];
m2({}) // [undefined, undefined]

m1({z: 3}) // [0, 0]
m2({z: 3}) // [undefined, undefined]
```

### 参数默认值的位置

定义默认值的参数应该是函数的尾参数，如果是非尾参数，这个值是没法省略。

### 函数的length属性

返回没有指定默认值的参数的个数

rest参数不计入length属性
```
(function(...args) {}).length // 0
```

设置的默认值的参数不是尾参数，length不再计入后面的参数
```
(function (a = 0, b, c) {}).length // 0
(function (a, b = 1, c) {}).length // 1
```

### 作用域

设置了参数的默认值，函数进行声明初始化，参数会形成一个单独的作用域。

```
var x = 1;

function f(x, y = x) {
  console.log(y);
}

f(2) // 2
```

调用函数f的时候，参数会形成单独的作用域，y的默认值是第一个参数x,所以y=2;

```
let x = 1;

function f(y = x) {
  let x = 2;
  console.log(y);
}

f() // 1
```

调用函数f的时候，参数形成的作用域内x没有定义，所以y等于全局的x,所以y=1;

参数的默认值是一个匿名函数，函数的作用域一样会形成一个自己的作用域。

```
var x = 1;
function foo(x, y = function() { x = 2; }) {
  var x = 3;
  y();
  console.log(x);
}

foo() // 3
x // 1
```

y这个匿名函数中的x,指向第一个参数x。foo内部声明了变量x，这个x跟函数y不在同一个作用域内，所以不是同一个变量，所以y的执行不会影响foo内部的x和外部全局x的值。

如果将var x=3的var 去掉

```
var x = 1;
function foo(x, y = function() { x = 2; }) {
  x = 3;
  y();
  console.log(x);
}

foo() // 2
x // 1
```

foo中的x与匿名函数中的x是一致的，执行y后，x改变为2.

### rest参数(...变量名)

用于获取函数的多余参数，rest参数搭配的变量是一个数组，存放多余的参数

rest参数必须是最后一个参数，否则会报错

### 箭头函数

```
var f = () => 5;
// 等同于
var f = function () { return 5 };

var sum = (num1, num2) => num1 + num2;
// 等同于
var sum = function(num1, num2) {
  return num1 + num2;
};
```

+ 箭头函数的代码块部分多余一条语句，需要使用大括号括起来，并且使用return语句返回

+ 由于大括号被解释为代码块，所以当需要return一个对象的时候，需要用括号括起来

```
var getTempItem = id => ({ id: id, name: "Temp" });
```
