### 宏任务和微任务的划分
 + macro-task: script整体代码，setTimeout,setInterval,setImmediate,I/O,UI-rendering
 + micro-task: process.nextTick,Promise,Object.observe,MutationObserver
 + setTimeout和Promise称为任务源，进入任务队列的是他们指定的具体执行任务。

### 任务的执行顺序
先执行script中任务，然后执行micro-task中的任务，当所有的micro-task中的任务执行完毕。循环再次从macro-task中开始，等到其中一个任务队列执行完毕，然后再执行所有的micro-task,一直循环下去。
