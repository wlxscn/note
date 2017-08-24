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
+ 箭头函数在没有参数或者多个参数的时候，需要用圆括号将参数包起来。当只有一个参数的时候可以不需要圆括号

```
var f = v => v*2;
```

+ 箭头函数的代码块部分多余一条语句，需要使用大括号括起来，并且使用return语句返回

+ 由于大括号被解释为代码块，所以当需要return一个对象的时候，需要用括号括起来

```
var getTempItem = id => ({ id: id, name: "Temp" });
```
+ 箭头函数用来简化回调函数

```
// 正常函数写法
[1,2,3].map(function (x) {
  return x * x;
});

// 箭头函数写法
[1,2,3].map(x => x * x);
```

### 注意点

1. 箭头函数的this指向定义时的对象，而不是使用时的对象
2. 不可以当做构造函数，所以不能使用new命令
3. 在函数体内不可以使用arguments,可以使用rest参数替换
4. 不可以使用yield，所以不能用作generator函数

箭头函数可以让回调函数固定化

```
var handler = {
  id: '123456',

  init: function() {
    document.addEventListener('click',
      event => this.doSomething(event.type), false);
  },

  doSomething: function(type) {
    console.log('Handling ' + type  + ' for ' + this.id);
  }
};
```
this指向的固定化是因为箭头函数内部没有this,导致内部代码的this总是指向外层代码的this。

因为没有this，所以箭头函数不能作为构造函数。

```
function foo() {
  return () => {
    return () => {
      return () => {
        console.log('id:', this.id);
      };
    };
  };
}

var f = foo.call({id: 1});

var t1 = f.call({id: 2})()(); // id: 1
var t2 = f().call({id: 3})(); // id: 1
var t3 = f()().call({id: 4}); // id: 1
```
上面的例子说明只有foo函数有this,内部都是箭头函数，所以不存在this。所以它们的this都指向foo函数的this。

除了this,arguments,super,new.target也是不存在的，指向外层的非箭头函数。

### 嵌套的箭头函数

```
var pipeline= (...fns) => value => fns.reduce((a,b) => b(a), value);

var add1= v => v+1;

var mult2= b => b*2;

var addThenMult= pipeline(add1,mult2);

addThenMult(5);
```

### 双冒号绑定this(es7)

```
foo::bar;
======
bar.bind(foo);
```

### 尾调用

某个函数最后一步调用另一个函数称为尾调用。

尾调用不一定要出现在函数的尾部，只要是最后一步操作。

```
function f(x) {
  if (x > 0) {
    return m(x)
  }
  return n(x);
}
```

m,n都属于尾调用。

### 尾调用优化

函数调用会在内存中形成调用记录，称为'调用帧(call frame)',保存了调用位置和内部变量等信息。

函数A的内部调用函数B,会在A的调用帧上形成B的调用帧，只有当B执行完毕，将结果返回到A，B的调用帧才会清除。

如果B的内部调用了函数C，就会形成C的调用帧，以此类推形成了调用栈。(call stack);

由于尾调用是函数的最后一步，不需要保留外层函数的调用帧，因为调用位置和内部变量等信息都用不到了，直接用内层函数的调用帧就可以了。

```
function f() {
  let m = 1;
  let n = 2;
  return g(m + n);
}
f();

// 等同于
function f() {
  return g(3);
}
f();

// 等同于
g(3);
```

> 只有内层函数不再用到外层函数的内部变量才会进行尾调用优化

```
function addOne(a){
  var one = 1;
  function inner(b){
    return b + one;
  }
  return inner(a);
}
```
由于内层函数使用了外层函数的变量one，所以不会进行尾调用优化。

### 尾递归

递归非常耗费内存，需要同时保存成千上百个调用栈，容易造成'栈溢出'错误。

*非尾递归*
```
function Fibonacci (n) {
  if ( n <= 1 ) {return 1};

  return Fibonacci(n - 1) + Fibonacci(n - 2);
}

Fibonacci(10) // 89
Fibonacci(100) // 堆栈溢出
Fibonacci(500) // 堆栈溢出
```

*尾递归*
```
function Fibonacci2 (n , ac1 = 1 , ac2 = 1) {
  if( n <= 1 ) {return ac2};

  return Fibonacci2 (n - 1, ac2, ac1 + ac2);
}

Fibonacci2(100) // 573147844013817200000
Fibonacci2(1000) // 7.0330367711422765e+208
Fibonacci2(10000) // Infinity
```

### 尾递归优化的实现

```
function sum(x, y) {
  if (y > 0) {
    return sum(x + 1, y - 1);
  } else {
    return x;
  }
}

sum(1, 100000)
```
上面的函数执行会出现栈溢出

> 蹦床函数将递归执行转为循环执行

```
function trampoline(f) {
  while (f && f instanceof Function) {
    f = f();
  }
  return f;
}
```

将之前的函数改造成每个循环返回另一个函数
```
function sum(x, y) {
  if (y > 0) {
    return sum.bind(null, x + 1, y - 1);
  } else {
    return x;
  }
}
```

```
trampoline(sum(1, 100000))
```

#### 真正尾递归的优化
```
function tco(f) {
  var value;
  var active = false;
  var accumulated = [];

  return function accumulator() {
    accumulated.push(arguments);
    if (!active) {
      active = true;
      while (accumulated.length) {
        value = f.apply(this, accumulated.shift());
      }
      active = false;
      return value;
    }
  };
}

var sum = tco(function(x, y) {
  if (y > 0) {
    return sum(x + 1, y - 1)
  }
  else {
    return x
  }
});

sum(1, 100000)
```