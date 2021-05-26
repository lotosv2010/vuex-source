export default function applyMixin(Vue) {
  // vue内部会把生命周期函数，拍平成一个数组
  Vue.mixin({
    beforeCreate: vuexInit // 初始化
  })
}

function vuexInit() {
  // 1.给所有的组件增加$store 属性，指向我们创建的store 实例
  // console.log(this.$options.name)
  const options = this.$options // 获取用户所有的选项
  if(options.store) { // 根实例
    this.$store = options.store
  } else if(options.parent && options.parent.$store){ // 子孙组件
    this.$store = options.parent.$store
  }
}