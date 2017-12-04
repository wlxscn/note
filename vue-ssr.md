### 创建一个简单的vue实例

```
// 1.创建vue实例
const Vue = require('vue)
const app = new Vue({
    template: `<div>Hello World</div>`
})

// 2.创建renderer
const renderer = require('vue-server-render').createRender()

// 3.将vue实例转化为html
render.renderToString(app, (err, html) => {
  if (err) throw err
  console.log(html)
})
```

##### 提供一个模版

```
//  <!--vue-ssr-outlet-->是vue实例内容插入的地方
<!DOCTYPE html>
<html lang="en">
  <head><title>Hello</title></head>
  <body>
    <!--vue-ssr-outlet-->
  </body>
</html>

const renderer = createRenderer({
  template: require('fs').readFileSync('./index.template.html', 'utf-8')
})
```

##### 传入的渲染上下文对象

 ```
 const context = {
  title: 'hello',
  meta: `
    <meta ...>
    <meta ...>
  `
}
renderer.renderToString(app, context, (err, html) => {
  // page title will be "Hello"
  // with meta tags injected
})
```

##### 避免状态单例 （以免形成交叉污染）

```
const Vue = require('vue')
module.exports = function createApp (context) {
  return new Vue({
    data: {
      url: context.url
    },
    template: `<div>访问的 URL 是： {{ url }}</div>`
  })
}

const createApp = require('./app')
server.get('*', (req, res) => {
  const context = { url: req.url }
  const app = createApp(context)
  renderer.renderToString(app, (err, html) => {
    // 处理错误……
    res.end(html)
  })
})
```

##### 路由和代码的分割

也需要给每个请求创建一个新的 router实例

```
// router.js
import Vue from 'vue'
import Router from 'vue-router'
Vue.use(Router)
export function createRouter () {
  return new Router({
    mode: 'history',
    routes: [
      // ...
    ]
  })
}
```

使用异步组件的时候，需要在启动渲染之前在服务器上解析所有的异步组件，在客户端需要在混合之前解析所有的异步的组件。
所以需要在路由级别完成异步组件的解析，需要使用router.onReady

```
import { createApp } from './app'
export default context => {
  // 因为有可能会是异步路由钩子函数或组件，所以我们将返回一个 Promise，
  // 以便服务器能够等待所有的内容在渲染前，
  // 就已经准备就绪。
  return new Promise((resolve, reject) => {
    const { app, router } = createApp()
    // 设置服务器端 router 的位置
    router.push(context.url)
    // 等到 router 将可能的异步组件和钩子函数解析完
    router.onReady(() => {
      const matchedComponents = router.getMatchedComponents()
      // 匹配不到的路由，执行 reject 函数，并返回 404
      if (!matchedComponents.length) {
        return reject({ code: 404 })
      }
      // Promise 应该 resolve 应用程序实例，以便它可以渲染
      resolve(app)
    }, reject)
  })
}
```

#####  数据预取和状态
使用vuex存储异步获取的数据达到服务器端和客户端数据的共享

+ 服务器端数据的预取
通过router.getMatchedComponents()获的与路由匹配的组件，如果组件有asyncData方法就调用，将解析后的状态附加到渲染上下文中
