// 将方法依次放入队列，后续拿出来依次执行
// queue的方式
function LazyMan(name) {
    if (!(this instanceof LazyMan)) {
        return new LazyMan();
    }

    this.queue = [];

    this.queue.push(() => {
        console.log(`hello ${name}`);
        this.next();
    })


    setTimeout(() => {
        this.next();
    });
}

LazyMan.prototype.next = function () {
    if (this.queue.length > 0) {
        this.queue.shift()();
    }
}

LazyMan.prototype.eat = function eat(food) {
    this.queue.push(() => {
        console.log(`eat ${food}`)
        this.next();
    });
    return this;
};

LazyMan.prototype.sleep = function sleep(sec) {
    this.queue.push(() => {
        setTimeout(() => {
            console.log(`wake up after  ${sec}s`);
            this.next();
        }, sec * 1000);
    });
    return this;
};

LazyMan.prototype.sleepFirst = function sleepFirst(sec) {
    this.queue.unshift(() => {
        setTimeout(() => {
            console.log(`wake up after ${sec}s`);
            this.next();
        }, sec * 1000);
    });
    return this;
};

LazyMan('glm').eat('apple').sleep(2).eat('banana').sleepFirst(3).eat('peach');
