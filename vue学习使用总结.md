学习使用vue也有六个月了，总感觉自己使用的方式有点问题，但总归是开发出相应的项目了。下面是几点总结：

### vue的数据绑定

利用es5的Object.defineProperty()，改变对象的getter和setter属性描述器，实现view-model数据的绑定

### vue组件的通信方式

+ 父组件往子组件传递，通过props传递数据；子组件可以通过emit派发事件跟父组件通信

+ bus作为事件通信的中心 bus.$on,bus.$emit，主要用于兄弟组件之间的通信

+ vuex(模块化的使用)

```
import Vuex from "vuex";
import Vue from "vue";
import settlementModule from './left/index.js'
import settlementNavModule from './nav/nav.js'
import settlementMainModule from './main/main.js'
import settlementFilterModule from './filter/filter.js'


Vue.use(Vuex);

export default new Vuex.Store({
  modules: {
    settlementModule,
    settlementNavModule,
    settlementMainModule,
    settlementFilterModule
  }
})
```

### vue指令

*全局指令*

```
Vue.directive('clickout', {
    bind(el, binding, vnode) {
       function documentHandler(ev) {
          if(el.contains(ev.target)) {
              return false;
          }
          if(binding.expression) {
              binding.value(e);
          }
       }; 
       el.__vueClickOutside__ = documentHandler;
       document.addEventListener('click', documentHandler);
    },
    update() {

    },
    destroy() {
        document.removeEventListener('click', el.__vueClickOutside__);
        delete el.__vueClickOutside__;
    }
})
```

> vnode表示vue编译生成的虚拟节点，vnode.context表示指令所处的组件作用域 [vnode class](https://github.com/vuejs/vue/blob/dev/src/core/vdom/vnode.js)。
可以通过vnode.context._isMounted来判断指令所在组件是否已经装载完毕来进行操作

### mixin混合
当组件存在一些公用的逻辑，可以使用mixins

### filter的使用

```
  Vue.filter("point2", function (value, number) {
    if (!value && value != 0) {
      return ""
    }
    let result = "";
    if (Number(number)||Number(number)==0) {
      result = Number(value).toFixed(Number(number))
    } else {
      result = Number(value).toFixed(2)
    }
    return result;
  });
```  