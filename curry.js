function add() {
    // 第一次执行时，定义一个数组专门用来存储所有的参数
    var _args = []
        .slice
        .call(arguments);

    // 在内部声明一个函数，利用闭包的特性保存_args并收集所有的参数值
    var adder = function () {
        var _adder = function () {
            []
                .push
                .apply(_args, [].slice.call(arguments));
            return _adder;
        };

        // 利用隐式转换的特性，当最后执行时隐式转换，并计算最终的值返回
        _adder.toString = function () {
            return _args.reduce(function (a, b) {
                return a + b;
            });
        }

        return _adder;
    }
    return adder.apply(null, [].slice.call(arguments));
}

function curry(fn) {
    var args = []
        .slice
        .call(arguments, 1);
    return function () {
        var _args = args.concat([].slice(arguments, 0))
        return fn.apply(null, _args);
    }
}

Array.prototype.merge = function (fn, chars) {
    return this
        .map(fn)
        .join(chars);
}

//functional 返回一个函数， 该函数在调用时将参数的顺序颠倒过来。
function flip(fn) {
    return function () {
        var args = []
            .slice
            .call(arguments);
        return fn.apply(this, args.reverse());
    };
}
// 返回一个新函数， 从右到左柯里化原始函数的参数。
function rightCurry(fn, n) {
    var arity = n || fn.length,
        fn = flip(fn);
    return function curried() {
        var args = []
                .slice
                .call(arguments),
            context = this;
        return args.length >= arity
            ? fn.apply(context, args.slice(0, arity))
            : function () {
                var rest = []
                    .slice
                    .call(arguments);
                return curried.apply(context, args.concat(rest));
            };
    };
}

// 統一的filter函数
function filterWith(fn) {
    return function (list) {
        return filter(list, fn);
    }
}

// 对函数的参数进行修改并执行
function useWith(fn/*, txfn, ... */) {
    var transforms = []
            .slice
            .call(arguments, 1),
        _transform = function (args) {
            return args.map(function (arg, i) {
                return transforms[i](arg);
            });
        };
    return function () {
        var args = []
                .slice
                .call(arguments),
            targs = args.slice(0, transforms.length),
            remaining = args.slice(transforms.length);
        return fn.apply(this, _transform(targs).concat(remaining));
    }
}
