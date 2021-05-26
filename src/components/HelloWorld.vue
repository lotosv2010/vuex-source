<template>
  <div class="hello">
    <h3>{{ msg }} {{getName + ',' + age}}</h3>
    <hr>
    <h3>根模块</h3>
    <h4><button @click="changeName">修改名字</button></h4>
    <h4><button @click="changeAge(parseInt((Math.random() * 100)))">修改年龄(异步)</button></h4>
    <h4><span>this.$store.state.name: </span>{{ this.$store.state.name}}</h4>
    <h4><span>this.$store.getters.getAge: </span>{{ this.$store.getters.getAge}}</h4>
    <hr>
    <h3>home模块</h3>
    <h4><button @click="changeHomeName">修改名字</button></h4>
    <h4><button @click="changeHomeAge">修改年龄(异步)</button></h4>
    <h4><span>this.$store.state.home.name: </span>{{ this.$store.state.home.name}}</h4>
    <h4><span>this.$store.getters.home.getAge: </span>{{ this.$store.getters['home/getAge']}}</h4>
    <h3>home -> title模块</h3>
    <h4><button @click="changeTitleName">修改名字</button></h4>
    <h4><button @click="changeTitleAge">修改年龄(异步)</button></h4>
    <h4><span>this.$store.state.home.title.name: </span>{{ this.$store.state.home.title.name}}</h4>
    <h4><span>this.$store.getters.home.title.getAge: </span>{{ this.$store.getters['home/title/getAge']}}</h4>
    <h3>user模块</h3>
    <h4><button @click="changeUserName">修改名字</button></h4>
    <h4><button @click="changeUserAge">修改年龄(异步)</button></h4>
    <h4><span>this.$store.state.user.name: </span>{{ this.$store.state.user.name}}</h4>
    <h4><span>this.$store.getters.user.getAge: </span>{{ this.$store.getters['user/getAge']}}</h4>
    
  </div>
</template>

<script>
import { mapState, mapGetters, mapMutations, mapActions } from '../plugins/vuex/index'

export default {
  name: 'HelloWorld',
  props: {
    msg: String
  },
  computed: {
    ...mapState(['age']),
    ...mapGetters(['getName'])
  },
  mounted() {
    setTimeout(() => {
      this.$store.state.name = 'jack'
      this.$store.state.age = 30
    }, 2000);
  },
  methods: {
    ...mapMutations(['CHANGE_NAME']),
    ...mapActions(['changeAge']),
    changeName() {
      // this.$store.commit('CHANGE_NAME', 'sb')
      this.CHANGE_NAME('sb')
    },
    // changeAge() {
    //   this.$store.dispatch('changeAge', parseInt((Math.random() * 100)))
    // },
    changeHomeName() {
      this.$store.commit('home/CHANGE_NAME', 'sb-home')
    },
    changeHomeAge() {
      this.$store.dispatch('home/changeAge', parseInt((Math.random() * 100)))
    },
    changeUserName() {
      this.$store.commit('user/CHANGE_NAME', 'sb-user')
    },
    changeUserAge() {
      this.$store.dispatch('user/changeAge', parseInt((Math.random() * 100)))
    },
    changeTitleName() {
      this.$store.commit('home/title/CHANGE_NAME', 'sb-home-title')
    },
    changeTitleAge() {
      this.$store.dispatch('home/title/changeAge', parseInt((Math.random() * 100)))
    },
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h3 {
  margin: 40px 0 0;
}
</style>
