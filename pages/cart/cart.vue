<template>
  <view class="cartCantainer" v-if="cart.length !== 0">
    <!-- 收货地址 -->
    <address-data></address-data>
    <!-- 购物车商品列表标题 -->
    <view class="cartTitle">
      <!-- 左侧图标 -->
      <uni-icons type="shop" size="18"></uni-icons>
      <!-- 描述文本 -->
      <text class="cartTitleText">购物车</text>
    </view>
    <!-- 商品列表区 -->
    <uni-swipe-action>
      <block v-for="(goods, index) in cart" :key="index">
        <!-- 为其子节点提供滑动操作的效果 需要通过options属性来指定操作按钮的配置信息 -->
        <uni-swipe-action-item :right-options="options" @click="clickDelHandler(goods)">
          <goods-item
            :goods="goods" 
            :showRadio="true" 
            :showNum="true" 
            @radioChange='radioChangeHandler' 
            @unmChange='numberChangeHandler'
          ></goods-item>
        </uni-swipe-action-item>
      </block>
    </uni-swipe-action>
    <!-- 结算 -->
    <settle-part></settle-part>
  </view>
  <!-- 空白购物车 -->
  <view class="emptyCart" v-else>
    <image src="/static/default/default.jpg" class="emptyImg"></image>
    <text class="tipText">兜比脸都白净.</text>
  </view>
</template>

<script>
  import badgeMix from '@/mixins/tabbar-badge.js'
  import {mapState, mapMutations} from 'vuex'
  export default {
    // 将badgeMix混入到当前的页面中进行使用
    mixins: [badgeMix],
    computed: {
      // 将cart数组映射到当前页面
      ...mapState('mCart', ['cart']),
    },
    data() {
      return {
        options: [{
          text: '删除', 
          style: {
            backgroundColor: 'tomato'
          },
        }]
      }
    },
    methods: {
      // 将updateGoodsState方法映射至当前页
      ...mapMutations('mCart', ['updateGoodsState', 'updateGoodsCount', 'delGoodsItem']),
      // 自定义方法将仓库需要的数据通过参数传过去
      radioChangeHandler(e){
          this.updateGoodsState(e)
      },
      // 自定义方法将修改后的商品数量以回调参数的形式传递给仓库
      numberChangeHandler(e){
        this.updateGoodsCount(e)
      },
      // 滑动删除
      /**
       * 该组件的源码逻辑是只有在h5平台才去加载isPC函数，但是在调用的时候不区分平台，所以才会其他平台全部报错。
       * 可以在项目路径  /uni_modules/uni-swipe-action/components/uni-swipe-action-item/mpwxs.js”  中把
       * import {isPC} from "./isPC"  删除，然后把这个文件的所有的  let is_pc = isPC || false  都改成 
       * let is_pc =false 就好了（一共有三个，报错也应该是三个）
        * */
      clickDelHandler(e){
        this.delGoodsItem(e.goods_id)
      }
    },
  }
</script>

<style lang="scss">
  .cartCantainer{
    margin-bottom: 50px;
  }
  .cartTitle{
    height: 40px;
    display: flex;
    align-items: center;
    font-size: 14px;
    padding-left: 5px;
    border-bottom: 1px solid #efefef;
    .cartTitleText{
      margin-left: 10px;
    }
  }
  // 空白购物车
  .emptyCart{
    display: flex;
    flex-direction: column;
    align-items: center;
    padding-top: 150px;
    .emptyImg{
      width: 90px;
      height: 90px;
      border-radius: 50%;
    }
    .tipText{
      font-size: 12px;
      color: gray;
      margin-top: 15px;
    }
  }

</style>
