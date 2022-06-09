export default{
  // 开启命名空间
  namespaced: true,
  // state 数据
  state: () => ({
    // 收货地址
    address: JSON.parse(uni.getStorageSync('address') || '{}'),
  }),
  // 方法
  mutations: {
    // 更新收货地址
    updateAddress(state, address){
      state.address = address
      this.commit('mUser/saveAddressToStorage')
    },
    // 持久化存储到本地
    saveAddressToStorage(state){
      uni.setStorageSync('address', JSON.stringify(state.address))
    }
  },
  //数据包装器
  getters: {
    addStr(state){
      const { provinceName, cityName, countyName, detailInfo} = state.address
      if(!provinceName) return ''
      // 拼接省 市 区 详细地址 的字符串并返回
      return provinceName+cityName+countyName+detailInfo
    },
  },
}