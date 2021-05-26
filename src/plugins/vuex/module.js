import { forEachValue } from "./utils"

class Module {
  constructor(rawModule) {
    this._raw = rawModule // 原来的模块(用户定义的)
    this._children = {} // 子模块
    this.state = rawModule.state // 当前模块的状态
  }
  getChild(key) {
    return this._children[key]
  }
  addChild(key, module) {
    this._children[key] = module
  }
  forEachMutation(fn) {
    if(this._raw.mutations) {
      forEachValue(this._raw.mutations, fn)
    }
  }
  forEachAction(fn) {
    if(this._raw.actions) {
      forEachValue(this._raw.actions, fn)
    }
  }
  forEachGetter(fn) {
    if(this._raw.getters) {
      forEachValue(this._raw.getters, fn)
    }
  }
  forEachChild(fn) {
    forEachValue(this._children, fn)
  }
  get namespaced() {
    return !!this._raw.namespaced
  }
}

export default Module