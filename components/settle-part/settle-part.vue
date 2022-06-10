<template>
  <view class="settleContainer">
    <!-- 全选 -->
    <label class="radio" @click="changeAllState">
      <radio color="#ff6347" :checked="isFullCheck" /><text>全选</text>
    </label>
    <!-- 合计 -->
    <view class="amountBox">
      合计:<text class="amount">￥{{checkedGoodsAmount}}</text>
    </view>
    <!-- 结算 -->
    <view class="btnSettle">
      结算({{checkedCount}})
    </view>
  </view>
</template>

<script>
  // 按需引入
  import { mapGetters, mapMutations } from 'vuex'
  export default {
    name:"settle-part",
    data() {
      return {
        
      };
    },
    // 计算属性
    computed: {
      // 映射出相关数据
      ...mapGetters('mCart', ['checkedCount', 'total', 'checkedGoodsAmount']),
      // 判断选中状态商品和全部商品之间的关系
      isFullCheck(){
        return this.total === this.checkedCount
      },
    },
    // 方法
    methods: {
      // 映射方法
      ...mapMutations('mCart', ['updateAllGoodsState']),
      // 全选点击事件
      changeAllState(){
        // 修改购物车中所有商品的选中状态
        // !this.isFullCheck表示 当前全选按钮的状态取反之后就是最新的勾选状态
        this.updateAllGoodsState(!this.isFullCheck)
      },
    }
  }
</script>

<style lang="scss">
  // 粘滞定位于底部 flex布局 水平居中
  .settleContainer{
    position: fixed;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 50px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    background-color: white;
    font-size: 14px;
    padding-left: 5px;
    // flex布局 侧轴居中
    .radio{
      display: flex;
      align-items: center;
    }
    .amountBox{
      .amount{
        color: #ff6347;
        font-weight: bold;
      }
    }
    // 行高垂直居中 最小宽度 水平居中
    .btnSettle{
      background-color: #ff6347;
      line-height: 50px;
      padding: 0 10px;
      min-width: 100px;
      text-align: center;
      color: white;
    }
  }
</style>