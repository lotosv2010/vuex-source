import Vue from 'vue'
import Vuex from '../plugins/vuex/index'
// import Vuex from 'vuex'
import user from './user.store'
import home from './home.store'

Vue.use(Vuex)

function persists(store) { // 每次去服务器上拉去最新的 session、local
  let local = localStorage.getItem('VUEX:state');
  if (local) {
      store.replaceState(JSON.parse(local)); // 会用local替换掉所有的状态
  }
  store.subscribe((mutation, state) => {
      // 这里需要做一个节流  throttle lodash
      localStorage.setItem('VUEX:state', JSON.stringify(state));
  });
}

const store = new Vuex.Store({
  plugins: [
    persists
  ],
  state: {
    name: 'robin',
    age: 8
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
  },
  modules: {
    home,
    user
  }
})

export default store