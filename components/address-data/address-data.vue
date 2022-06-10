<template>
  <view>
      <!-- 地址选择按钮 -->
      <view class="addressChoose" v-if="JSON.stringify(address) === '{}'">
        <button type="primary" size="mini" class="chooseAddBtn" @click="chooseAdd">请选择收货地址 +</button>
      </view>
      <!-- 收货地址信息 -->
      <view class="addressInfo" v-else @click="chooseAdd">
        <!-- 第一行 -->
        <view class="row1">
          <!-- 左侧内容 -->
          <view class="row1Left">
            <!-- 姓名 -->
            <view class="username">
              收货人: {{address.userName}}
            </view>
          </view>
          <!-- 右侧内容 -->
          <view class="row1Right">
            <!-- 电话 -->
            <view class="phone">
              电话: {{address.telNumber}}
            </view>
            <uni-icons type="arrowright" size="16"></uni-icons>
          </view>
        </view>
        <!-- 第二行 -->
        <view class="row2">
          <view class="row2Left">
            收货地址:
          </view>
          <view class="row2Right">
            {{addStr}}
          </view>
        </view>
      </view>
      <!-- 底部边框线 -->
      <image src="/static/cart_border@2x.png" class="addressBorder"></image>
  </view>
</template>

<script>
  // 导入Vuex语法糖
  import { mapState, mapMutations, mapGetters } from 'vuex'
  export default {
    name:"address-data",
    data() {
      return {
        // 收货地址
        // address: {},
      };
    },
    // 计算属性
    computed: {
      // 映射响应数据
      ...mapState('mUser', ['address']),
      ...mapGetters('mUser', ['addStr']),
    },
    // 方法
    methods: {
      // 映射方法
      ...mapMutations('mUser', ['updateAddress']),
      // 选择收货地址
      async chooseAdd(){
        /**收货地址
         * 调用小程序提供的chooseAddress()方法 即可使用选择收货地址的功能
         * 返回值为一个数组 第一项为错误对象 第二项为成功之后的收货地址对象
          * */
        const [err, succ] = await uni.chooseAddress().catch(err => err)
        // 用户成功的选择地址后
        if(err === null && succ.errMsg === 'chooseAddress:ok'){
          // 为data里面的收货地址对象赋值
          // this.address = succ
          // 将地址保存在仓库
          this.updateAddress(succ)
        }
        /**iPhone授权失败
         * 下面授权相关的代码已失效 仅做了解
         * iPone真机无法重新授权的问题
         * 在iPone设备上 当用户取消授权之后 再次点击选择收货地址按钮时 无法弹出授权的提示框
         * 原因--> 在模拟器和安卓真机上 错误消息err.errMag的值为chooseAddress:fail auth deny
         *  在iPone真机上 错误消息err.errMsg的值为chooseAddress:fail authorize no response
         * 解决方案 进一步修改if判断的条件
          * */
        // 用户取消授权
        if(err && (err.errMsg === 'chooseAddress:fail auth deny' || err.errMsg === 'chooseAddress:fail authorize no response')){
          // 掉用this.reAuth()方法 向用户重新发起授权申请
          this.reAuth()
        }
      },
      // 重新发起收货地址的授权
       async reAuth(){
         // 提示用户对离地进行授权
         const [err2, confirmResult] = await uni.showModal({
           content: '检测到您没有开放地址权限，是否开放',
           confirmText: '确认',
           cancelText: '取消',
         })
         // 弹框异常 直接退出
         if(err2) return
         // 点击取消 
         if(confirmResult.cancel) return uni.$showMsg('授权失败！')
         // 点击确认
         if(confirmResult.confirm) return uni.openSetting({
           // 授权结束 对授权结果进行审查
           success: (settingResult) => {
             // 提示授权成功
             if(settingResult.authSetting['scope.address']) return uni.$showMsg('授权成功！')
             // 提示授权失败
             if(!settingResult.authSetting['scope.address']) return uni.$showMsg('授权失败！')
           }
         })
       }
    },
  }
</script>

<style lang="scss">
  // 块级元素 占据整行
  .addressBorder{
    display: block;
    width: 100%;
    height: 5px;
  }
  // flex布局 垂直 水平居中
  .addressChoose{
    height: 90px;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  // flex布局 垂直排列 水平居中
  .addressInfo{
    font-size: 12px;
    height: 90px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    padding: 0 5px;
    // flex布局 水平排列空隙在元素间
    .row1{
      display: flex;
      justify-content: space-between;
      .row1Left{
        .username{}
      }
      // flex布局 水平排列空隙在元素间
      .row1Right{
        display: flex;
        justify-content: space-between;
        .phone{}
      }
    }
    // flex布局 垂直方向居中
    .row2{
      display: flex;
      // justify-content: space-between;
      align-items: center;
      margin-top: 10px;
      .row2Left{
        // 文字不换行
        white-space: nowrap;
      }
      .row2Right{}
    }
  }
</style>