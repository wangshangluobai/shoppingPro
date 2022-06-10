
// #ifndef VUE3
import Vue from 'vue'
import App from './App'
import store from '@/store/store.js'
/**
 * 导入网络请求的包 @escook/request-miniprogram
 * 小程序不支持axios 且 wx原生请求方式不得行
 */
import { $http } from '@escook/request-miniprogram'

// 挂载到全局对象uni上
uni.$http = $http
// 请求基础路径  注意 真机预览|二维码预览数据请求失败 将https改为http
$http.baseUrl = 'https://www.uinav.com'
// 请求拦截器
$http.beforeRequest = function(options){
  uni.showLoading({
    title:'数据加载中...'
  })
  // 判断请求的是否为有权限的API接口
  if(options.url.indexOf('/my/') !== -1){
    // 为请求头添加身份字段认证
    options.header = {
      // 字段的值可以直接从vuex中获取
      Authorization: store.state.mUser.token,
    }
  }
}
// 响应拦截器
$http.afterRequest = function(options){
  uni.hideLoading()
}
// 封装全局弹框方法
uni.$showMsg = function(title = '数据请求失败！', duration = 1500){
  uni.showToast({
    title,
    duration,
    icon:'none'
  })
}

Vue.config.productionTip = false

App.mpType = 'app'

const app = new Vue({
    ...App,
    store
})
app.$mount()
// #endif

// #ifdef VUE3
import { createSSRApp } from 'vue'
import App from './App.vue'
export function createApp() {
  const app = createSSRApp(App)
  return {
    app
  }
}
// #endif