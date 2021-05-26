export default {
  namespaced: true,
  state: {
    name: 'title',
    age: 0
  },
  getters:{
    getAge(state) {
      console.log('getAge', state.age) // 多次取值，值不变时，只会打印一次
      return state.age
    },
    getName: state => state.name
  },
  mutations: {
    CHANGE_NAME(state, payload) {
      state.name = payload
    },
    CHANGE_AGE(state, payload) {
      state.age = payload
    }
  },
  actions: {
    changeName({ commit }, payload) {
      setTimeout(() => {
        commit('CHANGE_NAME', payload)
      }, 1000)
    },
    changeAge({ commit }, payload) {
      setTimeout(() => {
        commit('CHANGE_AGE', payload)
      }, 1000);
    }
  }
}