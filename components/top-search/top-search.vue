<template>
  <view class="search-container" :style="{ 'background-color': bgcolor }" @click="searchHandler">
    <view class="search-box" :style=" { 'border-radius': radius + 'px' }">
      <!-- 使用uni-ui图标 -->
      <uni-icons type="search" size="17"></uni-icons>
      <text class="placeholder">搜索</text>
    </view>
  </view>
</template>

<script>
  export default {
    name:"top-search",
    props: {
      // 背景颜色
      bgcolor: {
        type: String,
        default: 'tomato'
      },
      // 圆角尺寸
      radius: {
        type: Number,
        default: 18 // px
      },
    },
    data() {
      return {
        
      };
    },
    methods: {
      searchHandler(){
        this.$emit('searchClick')
      }
    },
  }
</script>

<style lang="scss">
  .search-container{
    height: 50px;
    // background-color: tomato;
    display: flex;
    align-items: center;
    padding: 0 10px;
    .search-box{
      height: 36px;
      background-color: #FFFFFF;
      // border-radius: 18px;
      width: 100%;
      display: flex;
      justify-content: center;
      align-items: center;
      .placeholder{
        font-size: 15px;
        margin-left: 5px;
      }
    }
  }
</style>