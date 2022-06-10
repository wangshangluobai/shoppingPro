export default{
  // 为当前模块开启命名空间
  namespaced: true,
  // 模块的state数据
  state: ()=> ({
    /**变量描述及获取
     * 购物车的数据 用来存储购物车中每个商品的信息对象
     * 每个对象都包含6个属性
     * id name price count small_logo state 
     * 使用本地存储配合JSON获取数据 防止刷新失去信息 
      */
     cart: JSON.parse(uni.getStorageSync('Cart') || '[]'),
  }),
  // 模块的mutations方法
  mutations: {
    // 添加商品至购物车
    addToCart(state, goods){
      /**添加购物车方法处理
       * 根据提交的商品ID 检测购物车中是否存在该商品
       * 存在 则findResult为undefined 反之 为查找商品信息对象
        */
       const findResult = state.cart.find((x) => x.goods_id === goods.goods_id)
       // 对查询结果进行判定
       if(!findResult){
         // 如果购物车中没该商品 则直接push
         state.cart.push(goods)
       }else{
         // 如果存在 则更新数量
         findResult.goods_count++
       }
       // 通过commit 调用mCart中的saveToStorage
       this.commit('mCart/saveToStorage')
    },
    // 将仓库中的数据存储到本地
    saveToStorage(state){
      uni.setStorageSync('Cart', JSON.stringify(state.cart))
    },
    // 更新购物车商品的选中状态
    updateGoodsState(state, goods){
      // 根据goods_id查询购物车中对应是哪个商品的信息对象
      const findResult = state.cart.find(x => x.goods_id === goods.goods_id)
      // 查询到对应的商品对象信息
      if(findResult){
        // 更新对应商品的勾选状态
        findResult.goods_state = goods.goods_state
        // 持久化存储到本地
        this.commit('mCart/saveToStorage')
      }
    },
    // 更新购物车中商品的数量
    updateGoodsCount(state, goods){
      // 根据 goods_id 查询购物车中对应 的信息对象
      const findResult = state.cart.find(x => x.goods_id === goods.goods_id)
      if(findResult){
        // 更新对应商品的数量
        findResult.goods_count = goods.goods_count
        // 持久化存储到本地
        this.commit('mCart/saveToStorage')
      }
    },
    // 根据ID从购物车中删除对应的商品信息
    delGoodsItem(state, id){
      // 根据goods_id 过滤出要删除的对象
      state.cart = state.cart.filter(x => x.goods_id !== id)
      // 持久化存储
      this.commit('mCart/saveToStorage')
    },
    // 更新所有商品的勾选状态
    updateAllGoodsState(state, newState){
      // 循环更新购物车中每件商品的勾选状态
      state.cart.forEach(x => x.goods_state = newState)
      // 持久化存储
      this.commit('mCart/saveToStorage')
    }
  },
  // 模块的getters属性
  getters: {
    // 同级购物车中商品的总数量
    total(state){
      /* let c = 0
      // 循环计量商品数量 累加到c
      state.cart.forEach(x => c += x.goods_count)
      return c */
      return state.cart.reduce((total, item) => total += item.goods_count, 0)
    },
    // 勾选的商品的总数量
    checkedCount(state){
      /**商品总量计算方法
       * 先使用filter方法 从购物车中过滤已勾选的商品
       * 再使用reduce方法 将已勾选的商品的总数量进行累加
       * reduce()的返回值就是已勾选的总数量
        */
      return state.cart.filter(x => x.goods_state).reduce((total, item) => total += item.goods_count, 0)
    },
    // 已勾选的商品总价
    checkedGoodsAmount(state){
      /**计算选中商品总价方法
       * 先使用filter方法 从购物车中过滤已勾选的商品
       * 再使用reduce方法 将已勾选的商品数量 * 单价之后 进行累加
       * reduce() 的返回值就是已勾选的商品的总价
       * 最后调用toFixed(2)方法 保留两位小数
        */
      return state.cart.filter(x => x.goods_state)
        .reduce((total, item) => total += item.goods_count * item.goods_price, 0)
        .toFixed(2)
    }
  },
}