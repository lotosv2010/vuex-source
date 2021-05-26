import Module from "./module"
import { forEachValue } from "./utils"

/**
 * this.root = {
 *  _raw: '根模块',
 *  _children: {
 *   home: {
 *     _raw: 'home模块',
 *     _children: {}
 *     state: 'home模块的状态'
 *   },
 *   user: {
 *     _raw: 'home模块',
 *     _children: {}
 *     state: 'home模块的状态'
 *   }
 *  },
 *  state: '根模块的状态'
 * }
 */
class ModuleCollection {
  constructor(options) {
    this.register([], options) // stack 栈结构 ['根对象', 'home', 'title']
  }
  register(path, rootModule) {
    // 格式化后的结果
    let newModule = new Module(rootModule)

    if(path.length == 0) {
      // 根模块
      this.root = newModule
    } else {
      const parent = path.slice(0, -1).reduce((memo, current) => {
        return memo.getChild(current)
      }, this.root)
      parent.addChild(path[path.length - 1], newModule)
    }
    if(rootModule.modules) { // 有子模块的情况
      // 循环模块
      forEachValue(rootModule.modules, (module, moduleName) => {
        this.register(path.concat(moduleName), module)
      })
    }
  }
  getNamespaced(path) {
    let root = this.root // 从根模块开始找
    return path.reduce((str, key) => {
      root = root.getChild(key) // 不停的去找当前模块
      return str + (root.namespaced ? `${key}/` : ``)
    }, '')
  }
}
export default ModuleCollection