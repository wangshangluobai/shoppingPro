<template>
  <view class="loginContainer">
    <uni-icons type="contact-filled" size="100" color="#afafaf"></uni-icons>
    <!-- 从@getuserinfo事件处理函数中 获取到用户的基本信息 open-type="getUserProfile"   @getUserProfile="getUserProfile"  -->
    <button type="primary" class="btnLogin" @click="userLogin">一键登录</button>
    <text class="tipsText">登录后尽享更多权益</text>
  </view>
</template>

<script>
  // 按需导入vuex方法
  import { mapMutations, mapState } from 'vuex'
  export default {
    name:"login-user",
    data() {
      return {
        
      };
    },
    computed: {
      // 映射数据
      ...mapState('mUser', ['redirectInfo'])
    },
    methods: {
      // 将mUser模块中的updateUserInfo映射过来
      ...mapMutations('mUser', ['updateUserInfo', 'updateToken', 'updateRedirectInfo']),
      userLogin(){
        // 调用获取用户信息的方法
        uni.getUserProfile({
          /** desc属性
           * desc 的属性值声明获取用户个人信息后的用途，不超过30个字符
           * 其中一个中文字符算两个 超过就失败
            * */
          desc: '获取您的基础信息用于创建账号',
          success: res => {
            // 核查是否获取成功 errMsg:getUserProfile:ok
            if(res.errMsg === 'getUserProfile:ok'){
              // 传递用户信息至仓库
              this.updateUserInfo(res.userInfo)
              // 获取登录成功之后的Token字符串
              this.getToken(res)
            }
          },
          fail: err => {
            // 核查失败 errMsg:getUserProfile:fail auth deny
            if(err.errMsg === 'getUserProfile:fail auth deny') return uni.$showMsg('获取失败！')
          },
        })
      },
      /**
       * 这里的代码一切正常 得不到token的原因在于不是自己的后台
        * */
      async getToken(info){
        // 调用微信登录接口
        const [err, res] = await uni.login().catch(err => err)
        // 核查调用结果
        if(err || res.errMsg !== 'login:ok') return uni.$showMsg('登录失败！')
        // 准备参数对象
        const query = {
          code: res.code,
          encryptedData: info.encryptedData,
          iv: info.iv,
          rawData: info.rawData,
          signature: info.signature
        }
        // 获取token
        const {data: loginResult } = await uni.$http.post('/api/public/v1/users/wxlogin', query)
        if(loginResult.meta.status !== 200) return uni.$showMsg('登陆失败！')
        // uni.$showMsg('登录成功')
        // 更新token
        this.updateToken(loginResult.message.token)
        /** 
         * 由于不能请求token 只是手写了一个，保证页面可以切换到info-user
         * */
         // 判断vuex中的 redirectInfo 是否为null 不为null则成功登录之后需要重新导航到对应的页面
         this.navigateBack()
      },
      // 返回登录之前的页面
      navigateBack(){
        // 审查redirectInfo不为null 导航方式为switchTab
        if(this.redirectInfo && this.redirectInfo.openType === 'switchTab'){
          // 调用小程序提供的uni.switchTab()API进行页面的导航
          uni.switchTab({
            // 要导航的页面地址
            url: this.redirectInfo.from,
            // 导航结束后 将仓库中的redirectInfo对象重置为null
            complete: () => {
              this.updateRedirectInfo(null)
            }
          })
        }
      },
    }
  }
</script>

<style lang="scss">
  // 将page高度撑满 不然其背景颜色很奇怪
  page{
    height: 100%;
    background-color: white;
  }
  // flex布局 垂直排列 水平|垂直方向居中 开启定位隐藏溢出
  .loginContainer{
    height: 750rpx;
    // background-color: red;
    background-color: #f8f8f8;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    position: relative;
    overflow: hidden;
    // 圆弧背景 伪类样式 决对定位 圆角 位移
    &::after{
      content: ' ';
      display:  block;
      width: 100%;
      height: 40px;
      background-color: white;
      position: absolute;
      bottom: 0;
      left: 0;
      border-radius: 100%;
      transform: translateY(50%);
    }
    // 按钮样式
    .btnLogin{
      width: 90%;
      border-radius: 100px;
      margin: 15px 0;
      background-color: tomato;
    }
    // 文本样式
    .tipsText{
      font-size: 12px;
      color: gray;
    }
  }
</style>