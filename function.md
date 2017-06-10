### Function构造函数
new Function([arg1[,arg2[,arg3]]],funcBody); //funcBody一个含有函数定义的javascrip语句的字符串

+ 属性
Function.caller,常用形式为arguments.callee.caller
```
function myFunc() {
   if (myFunc.caller == null) {
      return ("该函数在全局作用域内被调用!");
   } else
      return ("调用我的是函数是" + myFunc.caller);
}
```

Function.length  //函数的形参个数，已定义默认值的参数不算在内
arguments.length //函数被调用时实际传参的个数
```
console.log(Function.length); /* 1 */
console.log((function()        {}).length); /* 0 */
console.log((function(a)       {}).length); /* 1 */
console.log((function(a, b)    {}).length); /* 2 etc. */
console.log((function(...args) {}).length); /* 0, rest parameter is not counted */
```

+ 原型方法
 Function.prototype
  isGenerator //函数是否是generator对象
  + bind(thisArg[,arg1[,arg2]]) //返回初始函数的拷贝，this的指向变了

    ```
    this.x = 9;
    var module = {
      x: 81,
      getX: function() { return this.x; }
    };

    module.getX(); // 返回 81

    var retrieveX = module.getX;
    retrieveX(); // 返回 9, 在这种情况下，"this"指向全局作用域

    // 创建一个新函数，将"this"绑定到module对象
    // 新手可能会被全局的x变量和module里的属性x所迷惑
    var boundGetX = retrieveX.bind(module);
    boundGetX(); // 返回 81
    ```

    #### 快捷调用
    ```
    var slice = Array.prototype.slice;
    slice.apply(arguments);
    ```
    等于
    ```
    var unboundSlice = Array.prototype.slice;
    var slice = Function.prototype.call.bind(unboundSlice);
    slice(arguments);
    ```
    暂时的了解是call方法的实现 :\
    ```
    function call(){
      this.apply(arguments);
    }
    ```
  + call(thisArg[,arg1[,arg2]])
  + apply(thisArg,[argsArr])

## 作用域和函数堆栈
+ 递归
指向并调用自身的方法有三种：
  1. 函数名
  2. arguments.callee
  3. 作用域下一个指向该函数的变量名

## 剩余参数
允许将不确定数量的参数表示为数组。
```
function multiply(multiplier, ...theArgs) {
  return theArgs.map(x => multiplier * x);
}

var arr = multiply(2, 1, 2, 3);
console.log(arr); // [2, 4, 6]
```
## 箭头函数
this的词法,箭头函数捕获闭包上下文的this值
```
function Person(){
  this.age = 0;

  setInterval(() => {
    this.age++; // |this| properly refers to the person object
  }, 1000);
}

var p = new Person();
```
---

也可以通过bind指定this的指向

```
function Person(){
  this.age = 0;

  setInterval(function() {
    this.age++; // |this| properly refers to the person object
  }.bind(this), 1000);
}

var p = new Person();
```

### js顶级的内建函数
1. eval(str) 将传入的字符串当js代码执行,eval的参数不是字符串会原封不动返回。
   间接调用eval,通过一个变量来引用eval,则调用引用的变量工作在全局作用域。
   ```
   function test() {
    var x = 2, y = 4;
    console.log(eval("x + y"));  // 直接调用，使用本地作用域，结果是 6
    var geval = eval;
    console.log(geval("x + y")); // 间接调用，使用全局作用域，throws ReferenceError 因为`x`未定义
  }
```

尽量不要使用eval
eval 将会返回对最后一个表达式的求值结果
```
var str = "if ( a ) { 1+1; } else { 1+2; }";
var a = true;
var b = eval(str);  // returns 2
alert("b is : " + b);
a = false;
b = eval(str);  // returns 3
alert("b is : " + b);
```

2. parseInt(string, radix)
radix 一个2到36之间的整数值
如果被解析参数的第一个字符无法被转化为数值类型，则返回NaN
返回解析后的整数值，在没有指定基数，或者基数为0的情况下：
  + 如果string是以'0X'或者'0x'开头，基数为16
  + 如果string是以'0'开头，基数是8或者16，具体是哪个参数由环境决定
  + 如果string以其他任何值开头，基数是10

将整型数值以特定基数转换成它的字符串值可以使用 intValue.toString(radix).
```
var a=16;
a.toString(2) //'10000'
```
3. 箭头函数
#### 语法
(param1, param2, …, paramN) => { statements; }

/* 当删除大括号时，它将是一个隐式的返回值，这意味着我们不需要指定我们返回*/
(param1, param2, …, paramN) => expression;

// 等价于

(param1, param2, …, paramN) => { return expression; }



// 如果只有一个参数，圆括号是可选的:
(singleParam) => { statements; }

// 等价于

singleParam => { statements; }


#### 箭头函数中使用apply和call对this并没有什么影响，只是传入了参数
```
var adder = {
  base : 1,

  add : function(a) {
    var f = v => v + this.base;
    return f(a);
  },

  addThruCall: function(a) {
    var f = v => v + this.base;
    var b = {
      base : 2
    };

    return f.call(b, a);
  }
};

console.log(adder.add(1));         // 输出 2
console.log(adder.addThruCall(1)); // 仍然输出 2（而不是3 ——译者注）
```
#### 不绑定参数
箭头函数不会在其内部暴露出参数，arguments只是指向作用域内的arguments的值。
```
var arguments = 42;
var arr = () => arguments;

arr(); // 42

function foo() {
  var f = (i) => arguments[0]+i;
  // foo函数的间接参数绑定
  return f(2);
}

foo(1); // 3
```
可以通过rest参数解决
```
function foo() {
  var f = (...args) => args[0];
  return f(2);
}

foo(1);
// 2
```

#### 像方法一样使用箭头函数
```
var obj = {
  i: 10,
  b: () => console.log(this.i, this),
  c: function() {
    console.log( this.i, this)
  }
}
obj.b();
// undefined
obj.c();
// 10, Object {...}
```

------

```
var obj = {
  a: 10
};

Object.defineProperty(obj, "b", {
  get: () => {
    console.log(this.a, typeof this.a, this);
    return this.a+10;
   // represents global object 'Window', therefore 'this.a' returns 'undefined'
  }
});
```

this不会指向调用方法的对象
箭头函数不能用作构造器，和new一起用会报错，没有原型，不能和yeild关键字一起用

#### 返回文字表达式


```
var func = () => {  foo: 1  };
// undefined!
```

这样是不行的，因为{}中的代码被解析成序列语句了，需要用（）将文字表达式包起来

```
var func = () => ({  foo: 1  });
```