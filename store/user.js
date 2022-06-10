export default{
  // 开启命名空间
  namespaced: true,
  // state 数据
  state: () => ({
    // 收货地址 使用本地存储配合JSON持久化存储数据
    address: JSON.parse(uni.getStorageSync('address') || '{}'),
    // 登录成功之后的token字符串
    token: uni.getStorageSync('token') || '',
    // 用户基本信息
    userinfo: JSON.parse(uni.getStorageSync('userinfo') || '{}'),
    // 重定向的object对象 对象 { openType, from }
    redirectInfo: null
  }),
  // 方法
  mutations: {
    // 更新收货地址
    updateAddress(state, address){
      state.address = address
      // 持久化存储
      this.commit('mUser/saveAddressToStorage')
    },
    // 将地址持久化存储到本地
    saveAddressToStorage(state){
      uni.setStorageSync('address', JSON.stringify(state.address))
    },
    // 将用户信息持久化存储到本地
    saveUserInfoToStorage(state){
      uni.setStorageSync('userinfo', JSON.stringify(state.userinfo))
    },
    // 将token字符串持久化存储到本地
    saveTokenToStorage(state){
      uni.setStorageSync('token', state.token)
    },
    // 更新用户信息
    updateUserInfo(state, userinfo){
      state.userinfo = userinfo
      // 持久化存储用户信息
      this.commit('mUser/saveUserInfoToStorage')
    },
    updateToken(state, token){
      state.token = token
      // 持久化存储
      this.commit('mUser/saveTokenToStorage')
    },
    // 更新重定向的信息对象
    updateRedirectInfo(state, info){
      state.redirectInfo = info
    }
  },
  //数据包装器
  getters: {
    // 添加收货地址
    addStr(state){
      // 结构赋值各个参数
      const { provinceName, cityName, countyName, detailInfo} = state.address
      // 判断数据是否存在
      if(!provinceName) return ''
      // 拼接省 市 区 详细地址 的字符串并返回
      return provinceName + cityName + countyName + detailInfo
    },
  },
}