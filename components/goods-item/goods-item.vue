<template>
  <view>
    <view class="goodsItem">
      <!-- 左侧图片 -->
      <view class="leftImage">
        <radio :checked='goods.goods_state' color="tomato" v-if="showRadio"  @click='radioClickHandler'></radio>
        <image :src="goods.goods_small_logo||defaultPic"></image>
      </view>
      <!-- 右侧信息 -->
      <view class="rightMsg">
        <!-- 商品名称 -->
        <view class="goodsName">{{goods.goods_name}}</view>
        <!-- 价格及其他 -->
        <view class="goodsInfo">
          <view class="goodsPrice">{{goods.goods_price | tofixed}}</view>
          <!-- 商品数量 -->
          <uni-number-box :min="1" :value="goods.goods_count" v-if="showNum" @change="numChangeHandler"></uni-number-box>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
  import publicData from '@/mixins/public-data.js'
  export default {
    name:"goods-item",
    mixins: [publicData],
    props: {
      goods: {
        type: Object,
        default: {}
      },
      // 控制左侧图片的展示与否
      showRadio: {
        type: Boolean,
        // 如果没有指定showRadio属性的值 则默认不展示
        default: false,
      },
      //  是否展示价格右侧的NumberBox
      showNum: {
        type: Boolean,
        default: false,
      },
    },
    data() {
      return {};
    },
    methods: {
      // radio组件的点击处理
      radioClickHandler(){
        /**
         * 通过this.$emit()触发外届通过@绑定的radioChange事件
         * 同时将商品的ID和勾选状态 作为参数传递给radioChange事件处理函数
          * */
        this.$emit('radioChange',{
          // 商品的ID
          goods_id: this.goods.goods_id,
          // 商品最新的勾选状态
          goods_state: !this.goods.goods_state
        })
      },
      // 商品数量变化
      numChangeHandler(val){
        this.$emit('unmChange', {
          // 商品的ID 根据ID进行下步操作
          goods_id: this.goods.goods_id,
          // 商品的最新数量
          goods_count: +val
        })
      },
    },
  }
</script>

<style lang="scss">

  // 商品每行
  .goodsItem{
    // 使goods-item项占满整个屏幕的宽度
    width: 750rpx;
    // 设置盒子模型为border-box
    box-sizing: border-box;
    display: flex;
    margin: 10px 5px;
    border-bottom: 1px solid #f0f0f0;
    // 左侧图片
    .leftImage{
      margin-right: 5px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      image{
        width: 100px;
        height: 100px;
        display: block;
      }
    }
    // 右侧信息
    .rightMsg{
      display: flex;
      flex: 1;
      flex-direction: column;
      justify-content: space-between;
        margin-right: 15px;
      .goodsName{
        font-size: 13px;
        word-break:break-all;
      }
      // 商品详情
      .goodsInfo{
        display: flex;
        align-items: center;
        justify-content: space-between;
        .goodsPrice{
          color: tomato;
          font-size: 16px;
        }
      }
    }
  }
 
</style>