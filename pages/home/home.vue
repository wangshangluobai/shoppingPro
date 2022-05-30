<template>
  <view>
    <!-- 轮播图 -->
    <swiper 
      :indicator-dots="true" 
      :autoplay="true" 
      :interval="3000" 
      :duration="1000" 
      :circular="true"
    >
      <swiper-item v-for="(item,index) in swiperList" :key="index">
        <navigator class="swiperItem" :url="'/subpkg/goods_detail/goods_detail?goods_id=' + item.goods_id">
          <image :src="item.image_src"></image>
        </navigator>
      </swiper-item>
    </swiper>
    <!-- 分类导航 -->
    <view class="navList">
      <view 
        class="navItem" 
        v-for="(item,index) in navList" 
        :key="index"
        @click="clicknavClickHandler(item)"
      >
        <image :src="item.image_src" class="navImg"></image>
      </view>
    </view>
    <!-- 楼层展示 -->
    <view class="floorList">
      <view 
        class="floorItem" 
        v-for="(item,index) in floorList" 
        :key="index"
      >
        <!-- 标题图片 -->
        <image 
          :src="item.floor_title.image_src" 
          class="floorTitle"
        ></image>
        <!-- 左右图片容器 -->
        <view class="floorImgBox">
          <!-- 左侧图片 -->
          <navigator class="leftImgBox" :url="item.product_list[0].url">
            <image 
              :src="item.product_list[0].image_src" 
              :style="{width: item.product_list[0].image_width + 'rpx'}"
              mode="widthFix"
            ></image>
          </navigator>
          <!-- 右侧图片 -->
          <view class="rightImgBox">
            <navigator 
              class="rightImgItem"
              v-for="(imgItem,imgIndex) in item.product_list"
              :key="imgIndex"
              v-if="imgIndex !== 0"
              :url="imgItem.url"
              >
              <image 
                :src="imgItem.image_src" 
                mode="widthFix"
                :style="{width:imgItem.image_width + 'rpx'}"
              ></image>
            </navigator>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
  export default {
    data() {
      return {
        // 保存请求到的轮播图数据列表
        swiperList: [],
        // 保存请求到的分类导航数据列表
        navList: [],
        // 保存请求到的楼层数据列表
        floorList: [],
      };
    },
    // 页面加载时请求数据
    onLoad() {
      // 请求轮播图数据
      this.getSwiperData()
      // 请求分类导航数据
      this.getNavList()
      // 请求楼层数据
      this.getFloorList()
    },
    methods: {
      // 请求轮播图数据
      async getSwiperData(){
        const {data: res} = await uni.$http.get('/api/public/v1/home/swiperdata')
        if(res.meta.status == 200){
          this.swiperList = res.message
        }else{
          return uni.$showMsg()
        }
      },
      // 请求分类导航数据
      async getNavList(){
        const {data: res} = await uni.$http.get('/api/public/v1/home/catitems')
        if(res.meta.status == 200){
          this.navList = res.message
        }else{
          return uni.$showMsg()
        }
      },
      // 请求楼层数据
      async getFloorList(){
        const {data: res} = await uni.$http.get('/api/public/v1/home/floordata')
        if(res.meta.status == 200){
          res.message.forEach(imgList => {
            imgList.product_list.forEach(item => {
              item.url = '/subpkg/goods_list/goods_list?' + item.navigator_url.split('?')[1]
            })
          })
          this.floorList = res.message
        }else{
          return uni.$showMsg()
        }
      },
      // 响应点击事件跳转至分类tabBar页面
      clicknavClickHandler(item){
        // 判断点击的选项
        if(item.name === '分类'){
          uni.switchTab({
            url:'/pages/cate/cate'
          })
        }
      }
    },
  }
</script>

<style lang="scss">
  // 轮播图
  swiper{
    height: 300rpx;
    .swiperItem,image{
      width: 100%;
      height: 100%;
    }
  }
  // 分类导航
  .navList{
    display: flex;
    justify-content: space-around;
    margin: 15rpx 0;
    .navImg{
      width: 128rpx;
      height: 140rpx;
    }
  }
  // 楼层渲染
  .floorTitle{
    width: 100%;
    height: 60rpx;
  }
  .rightImgBox{
    display: flex;
    flex-wrap: wrap;
    justify-content: space-around;
  }
  .floorImgBox{
    display: flex;
    padding-left: 10rpx;
  }
</style>
