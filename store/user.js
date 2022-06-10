export default{
  // 开启命名空间
  namespaced: true,
  // state 数据
  state: () => ({
    // 收货地址 使用本地存储配合JSON持久化存储数据
    address: JSON.parse(uni.getStorageSync('address') || '{}'),
  }),
  // 方法
  mutations: {
    // 更新收货地址
    updateAddress(state, address){
      state.address = address
      // 持久化存储
      this.commit('mUser/saveAddressToStorage')
    },
    // 持久化存储到本地
    saveAddressToStorage(state){
      uni.setStorageSync('address', JSON.stringify(state.address))
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