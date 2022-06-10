<template>
  <view class="container">
    <!-- 用户未登录渲染结构 -->
    <login-user v-if="!token"></login-user>
    <!-- 用户登录后渲染结构 -->
    <info-user v-else></info-user>
  </view>
</template>

<script>
  import badgeMix from '@/mixins/tabbar-badge.js'
  // 按需引入vuex语法糖
  import { mapState } from 'vuex'
  export default {
    // 将badgeMix混入到当前页面中进行使用
    mixins: [badgeMix],
    data() {
      return {
        
      };
    },
    computed: {
      // 从仓库获取token
      ...mapState('mUser', ['token']),
    }
  }
</script>

<style lang="scss">
  page,.container{
    height: 100%;
  }
</style>
