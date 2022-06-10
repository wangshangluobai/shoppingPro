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
      <view class="price">{{goodsDetailInfo.goods_price | tofixed}}</view>
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
  import publicData from '@/mixins/public-data.js'
  // 引入仓库
  import {mapState, mapMutations, mapGetters} from 'vuex'
  export default {
    mixins: [publicData],
    computed: {
      ...mapState('mCart', ['cart']),
      // 映射total
      ...mapGetters('mCart', ['total']),
    },
    watch: {
      // 监听total值的变化 通过第一个形参得到变化后的值
      /* total(newVal){
        // 使用数组find()方法 找到购物车按钮的配置对象
        const findResult = this.options.find((x) => x.text === '购物车')
        if(findResult){
          // 动态为购物车按钮的info属性赋值
          findResult.info = newVal
        }
      }, */
      total: {
        // handler 属性用来定义侦听器的function处理函数
        handler(newVal){
          const findResult = this.options.find((x) => x.text === '购物车')
          if(findResult){
            // 动态为购物车按钮的info属性赋值
            findResult.info = newVal
          }
        },
        // immediate 属性用来声明此侦听器 是否在页面初次加载完毕后立即调用
        immediate: true
      }
    },
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
          info: 0
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
      ...mapMutations('mCart', ['addToCart']),
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
      buttonClick(e){
        // 判断点击的按钮
        if(e.content.text === '加入购物车'){
          // 结构赋值
          const {goods_id, goods_name, goods_price, goods_small_logo} = this.goodsDetailInfo
          // 组织商品信息对象
          const goodsInfo = {
            goods_id,
            goods_name,
            goods_price,
            goods_count: 1,
            goods_small_logo,
            goods_state: true
          }
          // 添加商品信息对象至仓库
          this.addToCart(goodsInfo)
        }
      }
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
