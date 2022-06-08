<template>
  <view>
    <view class="goodsItem">
      <!-- 左侧图片 -->
      <view class="leftImage">
        <image :src="goods.goods_small_logo||defaultPic"></image>
      </view>
      <!-- 右侧信息 -->
      <view class="rightMsg">
        <!-- 商品名称 -->
        <view class="goodsName">{{goods.goods_name}}</view>
        <!-- 价格及其他 -->
        <view class="goodsInfo">
          <view class="goodsPrice">{{goods.goods_price | tofixed}}</view>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
  export default {
    name:"goods-item",
    props: {
      goods: {
        type: Object,
        default: {}
      }
    },
    data() {
      return {
        // 默认图片
        defaultPic: '/static/default/default.jpg',
      };
    },
    filters: {
      // 将数字调整 带两位小数点
      tofixed(num){
        return Number(num).toFixed(2)
      }
    },
  }
</script>

<style lang="scss">

  // 商品每行
  .goodsItem{
    display: flex;
    margin: 10px 5px;
    border-bottom: 1px solid #f0f0f0;
    // 左侧图片
    .leftImage{
      margin-right: 5px;
      image{
        width: 100px;
        height: 100px;
        display: block;
      }
    }
    // 右侧信息
    .rightMsg{
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      .goodsName{
        font-size: 13px;
      }
      // 商品详情
      .goodsInfo{
        .goodsPrice{
          color: tomato;
          font-size: 16px;
        }
      }
    }
  }
</style>