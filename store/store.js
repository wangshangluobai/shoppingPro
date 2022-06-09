// 导入Vue和Vuex
import Vue from 'vue'
import Vuex from 'vuex'
import moduleCart from '@/store/cart.js'
import moduleUser from '@/store/user.js'

// 将Vuex安装为Vue的插件
Vue.use(Vuex)

// 创建Store的实例对象
const store = new Vuex.Store({
  // 挂载store模块
  modules: {
    'mCart': moduleCart,
    'mUser': moduleUser,
  },
})

// 共享Store实例对象
export default store