import applyMixin from "./mixin"
import ModuleCollection from "./module-collection"
import { forEachValue } from "./utils"

// 暴露Vue
export let Vue

/**
 * 获取最新的状态
 * @param {*} store 
 * @param {*} path 
 */
function getState(store, path) {
  let local = path.reduce((newState, current) => {
      return newState[current]; 
  }, store.state);
  return local
}

/**
 * 初始化模块
 * @param {容器} store 
 * @param {根模块} rootState 
 * @param {路径} path 
 * @param {格式化后的数据} module 
 */
const installModule = (store, rootState, path, module) => {
  // 给当前订阅的事件，增加一个命名空间
  // 例如:home/changeAge user/changeAge home/title/changeAge
  let namespaced = store._modules.getNamespaced(path) // 返回前缀
  // console.log(namespaced)
  
  // 状态
  // 将所有的子模块的状态安装到父模块的状态上
  if(path.length > 0) { // vuex 可以动态的添加模块
    let parent = path.slice(0, -1).reduce((memo, current) => {
      return memo[current]
    }, rootState)

    // 如果这个对象本身不是响应式的，那么 Vue.set 就相当于 obj[属性] = 值
    Vue.set(parent, path[path.length - 1], module.state)
  }

  module.forEachMutation((mutation, key) => {
    key = namespaced + key
    store._mutations[key] = store._mutations[key] || []
    store._mutations[key].push((payload) => {
      mutation.call(store, getState(store, path), payload, namespaced)
      store._subscribes.forEach(fn => {
        fn(mutation, store.state) // 用最新的状态
      })
    })
  })
  module.forEachAction((action, key) => {
    key = namespaced + key
    store._actions[key] = store._actions[key] || []
    store._actions[key].push((payload) => {
      action.call(store, store, payload)
    })
  })
  module.forEachGetter((getter, key) => {
    key = namespaced + key
    // 模块中getters的名字重复会覆盖
    store._wrappedGetters[key] = function() {
      return getter(getState(store, path))
    }
  })
  module.forEachChild((child, key) => {
    // 递归加载模块
    installModule(store, rootState, path.concat(key), child)
  })
}

function restStoreVM(store, state) {
  const computed = {} // 定义计算属性
  store.getters = {} // 定义 store 中的 getters

  forEachValue(store._wrappedGetters, (fn, key) => {
    computed[key] = () => {
      return fn(store.state)
    }
    Object.defineProperty(store.getters, key, {
      get: () => store._vm[key] // 去计算属性取值
    })
  })
  store._vm = new Vue({
    data: {
      $$state: state
    },
    computed // 计算属性有缓存特性
  })
}

// 容器初始化
export class Store {
  // options 就是 new Vuex.Store({state, mutation, actions, getters, modules, plugins, strict, devtools })
  constructor(options) {
    const state = options.state
    // 1.数据格式化，格式化的结果是树结构
    this._modules = new ModuleCollection(options)

    // 2.安装模块
    this._actions = {}
    this._mutations = {}
    this._wrappedGetters = {}
    this._subscribes = []

    // 根模块的状态中，要将子模块通过模块名定义在根模块上
    installModule(this, state, [], this._modules.root)
    // console.log(state)

    // 3.将状态和getters都定义在当前vm上
    restStoreVM(this, state)

    // 4.插件
    options.plugins.forEach(plugin => plugin(this))
  }
  get state() {
    return this._vm._data.$$state
  }
  // 在严格模式下，commit 和 dispatch 是有区别的
  commit = (type, payload) => { // 保证当前this，永远指向当前 store 实例
    // 调用 commit 其实就是去找绑定在 mutations 上的用户方法
    this._mutations[type].forEach(fn => fn.call(this, payload))
  }
  dispatch = (type, payload) => {
    this._actions[type].forEach(fn => fn.call(this, payload))
  }
  replaceState(state) {
    this._vm._data.$$state = state;
  }
  subscribe(fn) {
    this._subscribes.push(fn)
  }
}

// 插件安装
// Vue.use 方法回调用插件的 install 方法，此方法中的参数就是 Vue 的构造器
export const install = (_Vue) => {
  Vue = _Vue
  // 需要将跟组件注入的store 分派给每一个组件(子组件)
  applyMixin(Vue)
}
