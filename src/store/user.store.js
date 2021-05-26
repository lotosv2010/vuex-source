export default {
  namespaced: true,
  state: {
    name: 'user',
    age: 28
  },
  getters:{
    getAge(state) {
      console.log('getAge', state.age)
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