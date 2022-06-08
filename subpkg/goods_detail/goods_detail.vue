<template>
  <view v-if="goodsDetailInfo.goods_name" class="goodsDetailContainer">
    <!-- 轮播图 -->
    <swiper :indicator-dots="true" :autoplay="true" :interval="3000" :duration="1000" :circular="true">
      <swiper-item v-for="(img, index) in goodsDetailInfo.pics" :key="index">
        <image :src="img.pics_big" @click="preview(index)"></image>
      </swiper-item>
    </swiper>
    <!-- 商品信息区域 -->
    <view class="goodsInfoBox">
      <!-- 商品价格 -->
      <view class="price">{{goodsDetailInfo.goods_price}}</view>
      <!-- 商品信息主体区域 -->
      <view class="goodsInfoBody">
        <!-- 商品的名字 -->
        <view class="goodsName">{{goodsDetailInfo.goods_name}}</view>
        <!-- 收藏 -->
        <view class="favi">
          <uni-icons type="star" size="18" color="gray"></uni-icons>
          <text>收藏</text>
        </view>
      </view>
      <!-- 运费 -->
      <view class="yf"> 快递： 免运费 </view>
    </view>
    <!-- 商品详细信息 -->
    <rich-text :nodes="goodsDetailInfo.goods_introduce"></rich-text>
    <!-- 商品导航组件区域 -->
    <view class="goodsNav">
      <uni-goods-nav 
        :fill="true"  
        :options="options" 
        :buttonGroup="buttonGroup"  
        @click="onClick" 
        @buttonClick="buttonClick" 
      />
    </view>
  </view>
</template>

<script>
  export default {
    data() {
      return {
        // 请求到的商品详情数据
        goodsDetailInfo: {},
        // 商品导航数据
        options: [{
          icon: 'shop',
          text: '店铺',
        	infoColor: "red"
        }, {
          icon: 'cart',
          text: '购物车',
          info: 2
        }],
        buttonGroup: [{
            text: '加入购物车',
            backgroundColor: '#ff0000',
            color: '#fff'
          },
          {
            text: '立即购买',
            backgroundColor: '#ffa200',
            color: '#fff'
          }
        ]
      };
    },
    methods: {
      // 获取商品详细信息
      async getGoodsDetail(id) {
        const {
          data: res
        } = await uni.$http.get('/api/public/v1/goods/detail?goods_id=' + id)
        if (res.meta.status !== 200) return uni.$showMsg()
        // 改造富文本内容结构
        res.message.goods_introduce = res.message.goods_introduce.replace(/<img /g, '<img style="display:block;"').replace(/webp/g, 'jpg')
        this.goodsDetailInfo = res.message
      },
      // 轮播图预览
      preview(i) {
        uni.previewImage({
          current: i,
          // 将图片地址收集
          urls: this.goodsDetailInfo.pics.map(x => x.pics_big)
        })
      },
      // 点击响应事件
      onClick(e){
        if(e.content.text === '购物车'){
          // 跳转至购物车页面
          uni.switchTab({
            url: '/pages/cart/cart'
          })
        }
      },
    },
    // 加载时回调
    onLoad(options) {
      // 请求数据
      this.getGoodsDetail(options.goods_id)
    },
  }
</script>

<style lang="scss">
  // 商品详情整体容器
  .goodsDetailContainer{
    padding-bottom: 50px;
  }
  // 轮播图
  swiper {
    height: 750rpx;
    // 图片
    image {
      width: 100%;
      height: 100%;
    }
  }
  // 商品信息
  .goodsInfoBox {
    padding: 10px;
    padding-right: 0;
    // 价格
    .price {
      color: tomato;
      font-size: 18px;
      margin: 10px 0;
    }
    // 其他信息
    .goodsInfoBody {
      display: flex;
      justify-content: space-between;
      // 商品名字
      .goodsName {
        font-size: 13px;
        margin-right: 10px;
      }
      // 收藏
      .favi {
        width: 120px;
        font-size: 12px;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        border-left: 1px solid tomato;
        color: gray;
      }
    }
    // 运费信息
    .yf {
      font-size: 12px;
      color: gray;
      margin: 10px 0;
    }
  }
  // 商品导航信息
  .goodsNav{
    position: fixed;
    bottom: 0;
    left: 0;
    width: 100%;
  }
</style>
