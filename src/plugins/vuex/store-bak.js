import applyMixin from "./mixin"
import { forEachValue } from "./utils"

// 暴露Vue
export let Vue

// 容器初始化
export class Store {
  // options 就是 new Vuex.Store({state, mutation, actions, getters, modules, plugins, strict, devtools })
  constructor(options) {
    const state = options.state
    const computed = {} // getters 缓存使用

    // 2.添加getters逻辑
    // getters 属性具有缓存的
    this.getters = {}
    forEachValue(options.getters, (fn, key) => {
      // 将用户的 getters 定义在实例上
      computed[key] = () => fn(this.state)
      Object.defineProperty(this.getters, key, {
        // 当执行取值时，执行计算属性逻辑
        get: () => this._vm[key]
      })
    })

    // 1.添加状态逻辑
    this._vm = new Vue({
      data: { // 属性如果是通过$ 开头的，默认不会将这个属性挂载到实例上
        $$state: state // 会将$$state 对应的对象，都通过 defineProperty来进行属性劫持
      },
      computed
    })

    // 3.添加mutations逻辑
    this.mutations = {}
    forEachValue(options.mutations, (fn, key) => { // 绑定 mutations
      this.mutations[key] = (payload) => fn(this.state, payload)
    })
    // 4.添加actions逻辑
    this.actions = {}
    forEachValue(options.actions, (fn, key) => {
      this.actions[key] = (payload) => fn(this, payload)
    })
  }
  get state() {
    return this._vm._data.$$state
  }
  // 在严格模式下，commit 和 dispatch 是有区别的
  commit = (type, payload) => { // 保证当前this，永远指向当前 store 实例
    // 调用 commit 其实就是去找绑定在 mutations 上的用户方法
    this.mutations[type](payload)
  }
  dispatch = (type, payload) => {
    this.actions[type](payload)
  }
}

// 插件安装
// Vue.use 方法回调用插件的 install 方法，此方法中的参数就是 Vue 的构造器
export const install = (_Vue) => {
  Vue = _Vue
  // 需要将跟组件注入的store 分派给每一个组件(子组件)
  applyMixin(Vue)
}
