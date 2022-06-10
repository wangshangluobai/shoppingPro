<template>
  <view class="userInfoContainer">
    <!-- 头像昵称 -->
    <view class="topBox">
      <image :src="userinfo.avatarUrl" class="avatar"></image>
      <view class="nickname">{{userinfo.nickName}}</view>
    </view>
    <!-- 面板的列表区域 -->
    <view class="panelList">
      <!-- 第一个面板 -->
      <view class="panel">
        <!-- panel的主体区域 -->
        <view class="panelBody">
          <!-- panel的item项 -->
          <view class="panelItem">
            <text>8</text>
            <text>收藏的店铺</text>
          </view>
          <view class="panelItem">
            <text>11</text>
            <text>收藏的商品</text>
          </view>
          <view class="panelItem">
            <text>6</text>
            <text>关注的商品</text>
          </view>
          <view class="panelItem">
            <text>268</text>
            <text>足迹</text>
          </view>
        </view>
      </view>
      <!-- 第二个面板 -->
      <view class="panel">
        <view class="panelTitle">我的订单</view>
        <view class="panelBody">
          <view class="panelItem">
            <image src="/static/my-icons/icon1.png" class="icon"></image>
            <text>待付款</text>
          </view>
          <view class="panelItem">
            <image src="/static/my-icons/icon2.png" class="icon"></image>
            <text>待收货</text>
          </view>
          <view class="panelItem">
            <image src="/static/my-icons/icon3.png" class="icon"></image>
            <text>退款|退货</text>
          </view>
          <view class="panelItem">
            <image src="/static/my-icons/icon4.png" class="icon"></image>
            <text>全部订单</text>
          </view>
        </view>
      </view>
      <!-- 第三个面板 -->
      <view class="panel">
        <view class="panelListItem">
          <text>收货地址</text>
          <uni-icons type="arrowright" size="15"></uni-icons>
        </view>
        <view class="panelListItem">
          <text>联系客服</text>
          <uni-icons type="arrowright" size="15"></uni-icons>
        </view>
        <view class="panelListItem" @click="logout">
          <text>退出登录</text>
          <uni-icons type="arrowright" size="15"></uni-icons>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
  // 按需引入vuex方法
  import { mapState, mapMutations } from 'vuex'
  export default {
    name:"info-user",
    // 计算属性
    computed:{
      // 映射数据来
      ...mapState('mUser', ['userinfo']),
    },
    data() {
      return {
        
      };
    },
    methods: {
      ...mapMutations('mUser', ['updateUserInfo', 'updateToken', 'updateAddress']),
      // 退出登录事件
      async logout(){
        // 确认
        const [err, succ] = await uni.showModal({
          title: '提示',
          content: '确认退出登录么？'
        }).catch(err => err)
        if(succ && succ.confirm){
          // 确认退出 清空仓库中userinfo token address
          this.updateUserInfo({})
          this.updateToken('')
          this.updateAddress({})
        }
      }
    },
  }
</script>

<style lang="scss">
  .userInfoContainer{
    height: 100%;
    // 修改背景色
    background-color: #f4f4f4;
    .topBox{
      height: 400rpx;
      background-color: tomato;
      display: flex;
      justify-content: center;
      align-items: center;
      flex-direction: column;
      .avatar {
        width: 90px;
        height: 90px;
        border-radius: 45px;
        border: 2px solid #fff;
        box-shadow: 0 1px 5px black;
      }
    }
  }
  .panelList{
    padding: 0 10px;
    position: relative;
    top: -12px;
    .panel{
      background-color: white;
      border-radius: 3px;
      margin-bottom: 8px;
      .panelTitle{
        line-height: 45px;
        padding-left: 10px;
        font-size: 15px;
        border-bottom: 1px solid #f4f4f4;
      }
      .panelBody{
        display: flex;
        justify-content: space-around;
        .panelItem{
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: space-around;
          padding: 10px 0;
          font-size: 13px;
          .icon{
            width: 35px;
            height: 35px;
          }
        }
      }
    }
  }
  .panelListItem{
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 15px;
    padding: 0 10px;
    line-height: 45px;
  }
</style>