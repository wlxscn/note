### Object构造函数创建一个对象包装器

    new Object([value])  *value为任一值*

 #### 属性
 + length 值为1
 + prototype 为所有Object类型的对象添加属性

 #### 方法
 + assign(target,...source) 复制一个或多个对象来创建新对象 

 String类型和Sumbol类型的属性都可以通过assign方法拷贝

 ##### 继承属性和不可枚举的属性是不能拷贝的

 ```
 var obj = Object.create({foo: 1}, { // foo 是个继承属性。
    bar: {
        value: 2  // bar 是个不可枚举属性。
    },
    baz: {
        value: 3,
        enumerable: true  // baz 是个自身可枚举属性。
    }
});

var copy = Object.assign({}, obj);
console.log(copy); // { baz: 3 }
```
----

##### 原始类型会被包装为object

```
var v1 = "abc";
var v2 = true;
var v3 = 10;
var v4 = Symbol("foo")

var obj = Object.assign({}, v1, null, v2, undefined, v3, v4); 
// 原始类型会被包装，null 和 undefined 会被忽略。
// 注意，只有字符串的包装对象才可能有自身可枚举属性。
console.log(obj); // { "0": "a", "1": "b", "2": "c" }
```
var target = Object.defineProperty({}, "foo", {
    value: 1,
    writable: false
}); // target 的 foo 属性是个只读属性。

Object.assign(target, {bar: 2}, {foo2: 3, foo: 3, foo3: 3}, {baz: 4});
// TypeError: "foo" is read-only
// 注意这个异常是在拷贝第二个源对象的第二个属性时发生的。

console.log(target.bar);  // 2，说明第一个源对象拷贝成功了。
console.log(target.foo2); // 3，说明第二个源对象的第一个属性也拷贝成功了。
console.log(target.foo);  // 1，只读属性不能被覆盖，所以第二个源对象的第二个属性拷贝失败了。
console.log(target.foo3); // undefined，异常之后 assign 方法就退出了，第三个属性是不会被拷贝到的。
console.log(target.baz);  // undefined，第三个源对象更是不会被拷贝到的。
```

##### 拷贝访问器
```
var obj = {
  foo: 1,
  get bar() {
    return 2;
  }
};

var copy = Object.assign({}, obj); 
// { foo: 1, bar: 2 }
// copy.bar的值来自obj.bar的getter函数的返回值 
console.log(copy); 

// 下面这个函数会拷贝所有自有属性的属性描述符
function completeAssign(target, ...sources) {
  sources.forEach(source => {
    let descriptors = Object.keys(source).reduce((descriptors, key) => {
      descriptors[key] = Object.getOwnPropertyDescriptor(source, key);
      return descriptors;
    }, {});

    // Object.assign 默认也会拷贝可枚举的Symbols
    Object.getOwnPropertySymbols(source).forEach(sym => {
      let descriptor = Object.getOwnPropertyDescriptor(source, sym);
      if (descriptor.enumerable) {
        descriptors[sym] = descriptor;
      }
    });
    Object.defineProperties(target, descriptors);
  });
  return target;
}

var copy = completeAssign({}, obj);
// { foo:1, get bar() { return 2 } }
console.log(copy);
```
completeAssign方法拷贝后对象bar属性没有set方法，所以copy.bar= xxx将不起作用，Object.assign()方法拷贝后的对象就可以重新设置bar属性的值


+ create(proto[,propertiesObject]) 使用指定的原型对象和其属性创建了一个新的对象。
proto指的是新创建对象的原型，propertiesObj(可选)
```
var o;

// 创建一个原型为null的空对象
o = Object.create(null);


o = {};
// 以字面量方式创建的空对象就相当于:
o = Object.create(Object.prototype);


o = Object.create(Object.prototype, {
  // foo会成为所创建对象的数据属性
  foo: { writable:true, configurable:true, value: "hello" },
  // bar会成为所创建对象的访问器属性
  bar: {
    configurable: false,
    get: function() { return 10 },
    set: function(value) { console.log("Setting `o.bar` to", value) }
}})


function Constructor(){}
o = new Constructor();
// 上面的一句就相当于:
o = Object.create(Constructor.prototype);
// 当然,如果在Constructor函数中有一些初始化代码,Object.create不能执行那些代码


// 创建一个以另一个空对象为原型,且拥有一个属性p的对象
o = Object.create({}, { p: { value: 42 } })

// 省略了的属性特性默认为false,所以属性p是不可写,不可枚举,不可配置的:
o.p = 24
o.p
//42

o.q = 12
for (var prop in o) {
   console.log(prop)
}
//"q"

delete o.p
//false

//创建一个可写的,可枚举的,可配置的属性p
o2 = Object.create({}, { p: { value: 42, writable: true, enumerable: true, configurable: true } });
```

+ Object.defineProperties(obj,props) 方法直接在一个对象上定义新的属性或修改现有属性，并返回该对象。
```
var obj = {};
Object.defineProperties(obj, {
  "property1": {
    value: true,
    writable: true
  },
  "property2": {
    value: "Hello",
    writable: false
  }
  // 等等.
});
alert(obj.property2) //弹出"Hello"
```

+ Object.defineProperty(obj,prop,value) 更精确的添加或修改对象的属性
*该方法允许精确添加或修改对象的属性。一般情况下，我们为对象添加属性是通过赋值来创建并显示在属性枚举中（for...in 或 Object.keys 方法）， 但这种方式添加的属性值可以被改变，也可以被删除。而使用 Object.defineProperty() 则允许改变这些额外细节的默认设置。例如，默认情况下，使用  Object.defineProperty() 增加的属性值是不可改变的。*

对象的属性描述符分为两种形式： 数据描述符和存取描述符
两种形式都有以下可选的键值：
 1. configurable
    当且仅当该属性的 configurable 为 true 时，该属性描述符才能够被改变，也能够被删除。默认为 false。
    表示对象的属性是否可以被删除，以及出writable特性外的其他特性是否可以被 修改
 2. enumerable  当enumerable为true的时候，该属性出现在对象的枚举属性里。默认为false
 3. value 该属性的值，默认为undefined
 4. writable 当writable为true的时候，该属性能被赋值运算符改变，默认值为false

存取描述符独有的键值
1. get 给属性提供的getter方法，默认值为undefined
2. set 给属性提供setter方法，接受唯一参数，将参数值分配给该属性


数据描述符不能与存取描述符不能混合使用
```
Object.defineProperty(o, "conflict", {
  value: 0x9f91102, 
  get: function() { 
    return 0xdeadbeef; 
  } 
});
// throws a TypeError: value appears only in data descriptors, get appears only in accessor descriptors
```
上面的代码会报错


### 修改属性
如果描述符configurable为false，只有writable的初始值为true的时候可以更改writable特性，其他的特性在都不可改变

### 一般的getters和setters
```
function Archiver() {
  var temperature = null;
  var archive = [];

  Object.defineProperty(this, 'temperature', {
    get: function() {
      console.log('get!');
      return temperature;
    },
    set: function(value) {
      temperature = value;
      archive.push({ val: temperature });
    }
  });

  this.getArchive = function() { return archive; };
}

var arc = new Archiver();
arc.temperature; // 'get!'
arc.temperature = 11;
arc.temperature = 13;
arc.getArchive(); // [{ val: 11 }, { val: 13 }]
```

+ entries(obj) 一个给定对象自己的枚举属性[key,value]对的数组
将Object转化为Map
```
var obj = { foo: "bar", baz: 42 }; 
var map = new Map(Object.entries(obj));
console.log(map); // Map { foo: "bar", baz: 42 }
```

+ freeze()
可以冻结一个对象，冻结指的是不能向这个对象添加新的属性，不能修改其已有属性的值，不能删除已有属性，以及不能修改该对象已有属性的可枚举性、可配置性、可写性。也就是说，这个对象永远是不可变的。该方法返回被冻结的对象。（浅冻结）

```
obj = {
  internal : {}
};

Object.freeze(obj);
obj.internal.a = "aValue";

obj.internal.a // "aValue"

// 想让一个对象变的完全冻结,冻结所有对象中的对象,我们可以使用下面的函数.

function deepFreeze (o) {
  var prop, propKey;
  Object.freeze(o); // 首先冻结第一层对象.
  for (propKey in o) {
    prop = o[propKey];
    if (!o.hasOwnProperty(propKey) || !(typeof prop === "object") || Object.isFrozen(prop)) {
      // 跳过原型链上的属性和已冻结的对象.
      continue;
    }

    deepFreeze(prop); //递归调用.
  }
}

obj2 = {
  internal : {}
};

deepFreeze(obj2);
obj2.internal.a = "anotherValue";
obj2.internal.a; // undefined
```

+ getOwnPropertyNames(obj) 返回指定对象的所有自身属性的属性名（包括不可枚举的属性），不会获取到原型链上的属性
```
function ParentClass() {}
ParentClass.prototype.inheritedMethod = function() {};

function ChildClass() {
  this.prop = 5;
  this.method = function() {};
}

ChildClass.prototype = new ParentClass;
ChildClass.prototype.prototypeMethod = function() {};

console.log(
  Object.getOwnPropertyNames(
    new ChildClass()  // ["prop", "method"]
  )
);
```

+ getPropertyOf(obj)  返回指定对象的原型

+ is(value1,value2)  确定两个值是否是相同的值

+ isExtendsible(obj) 对象是否可扩展
```
// 新对象默认是可扩展的.
var empty = {};
Object.isExtensible(empty); // === true

// ...可以变的不可扩展.
Object.preventExtensions(empty);
Object.isExtensible(empty); // === false

// 密封对象是不可扩展的.
var sealed = Object.seal({});
Object.isExtensible(sealed); // === false

// 冻结对象也是不可扩展.
var frozen = Object.freeze({});
Object.isExtensible(frozen); // === false
```

+ __defineGetter__(prop,func)(非标准已废弃)
可以将一个函数绑定在当前对象的指定属性上，当那个属性的值被读取时，你所绑定的函数就会被调用。
```
// 请注意，该方法是非标准的：

var o = {};
o.__defineGetter__('gimmeFive', function() { return 5; });
console.log(o.gimmeFive); // 5


// 请尽可能使用下面的两种推荐方式来代替：

// 1. 在对象字面量中使用 get 语法
var o = { get gimmeFive() { return 5; } };
console.log(o.gimmeFive); // 5

// 2. 使用 Object.defineProperty 方法
var o = {};
Object.defineProperty(o, 'gimmeFive', {
  get: function() {
    return 5;
  }
});
console.log(o.gimmeFive); // 5
```

+ __defineSetter__(prop,func)
可以将一个函数绑定在当前对象的指定属性上，当那个属性的值被设置或改变时，你所绑定的函数就会被调用。

+ __lookupGetter__(prop)
返回当前对象上指定属性的访问器函数Getter

+ __lookupSetter__(prop)
```
obj.__lookupSetter__('foo')
相当于
Object.getOwnPropertyDescriptor(obj, 'foo').set;
```

+ hasOwnProperty(prop)
指示对象是否具有指定的属性作为自身属性，会忽略从原型链继承到的属性

遍历一个对象自身所有可枚举的属性
```
var buz = {
    fog: 'stack'
};

for (var name in buz) {
    if (buz.hasOwnProperty(name)) {
        alert("this is fog (" + name + ") for sure. Value: " + buz[name]);
    }
    else {
        alert(name); // toString or something else
    }
}
```

+ prototypeObj isPrototypeOf(obj) 
测试一个对象是否存在于另一个对象的原型链上

+ propertyIsEnumerable(prop) 表明指定的属性是否是可枚举的自身属性

+ toString
用来检测对象类型
```
var toString = Object.prototype.toString;

toString.call(new Date); // [object Date]
toString.call(new String); // [object String]
toString.call(Math); // [object Math]

//Since JavaScript 1.8.5
toString.call(undefined); // [object Undefined]
toString.call(null); // [object Null]
```

+ seal
可以让一个对象密封，并返回被密封后的对象。密封对象是指那些不能添加新的属性，不能删除已有属性，以及不能修改已有属性的可枚举性、可配置性、可写性，但可能可以修改已有属性的值的对象。

+ setPrototypeOf(obj,prototype)
```
var dict = Object.setPrototypeOf({}, null);
```
