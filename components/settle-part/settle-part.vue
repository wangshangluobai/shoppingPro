<template>
  <view class="settleContainer">
    <!-- 全选 -->
    <label class="radio" @click="changeAllState">
      <radio color="#ff6347" :checked="isFullCheck" /><text>全选</text>
    </label>
    <!-- 合计 -->
    <view class="amountBox">
      合计:<text class="amount">￥{{checkedGoodsAmount}}</text>
    </view>
    <!-- 结算 -->
    <view class="btnSettle" @click="settlement">
      结算({{checkedCount}})
    </view>
  </view>
</template>

<script>
  // 按需引入
  import { mapGetters, mapMutations, mapState } from 'vuex'
  export default {
    name:"settle-part",
    data() {
      return {
        // 倒计时的秒数
        seconds: 3,
        // 定时器
        timer: null,
      };
    },
    // 计算属性
    computed: {
      // 映射出相关数据
      ...mapGetters('mCart', ['checkedCount', 'total', 'checkedGoodsAmount']),
      ...mapState('mCart', ['cart']),
      ...mapGetters('mUser', ['addStr']),
      ...mapState('mUser', ['token']),
      // 判断选中状态商品和全部商品之间的关系
      isFullCheck(){
        return this.total === this.checkedCount
      },
    },
    // 方法
    methods: {
      // 映射方法
      ...mapMutations('mCart', ['updateAllGoodsState',]),
      ...mapMutations('mUser', ['updateRedirectInfo',]),
      // 全选点击事件
      changeAllState(){
        // 修改购物车中所有商品的选中状态
        // !this.isFullCheck表示 当前全选按钮的状态取反之后就是最新的勾选状态
        this.updateAllGoodsState(!this.isFullCheck)
      },
      // 结算检查
      settlement(){
        // 是否勾选商品
        if(!this.checkedCount) return uni.$showMsg('请选择要结算的商品！')
        // 是否已选择收货地址
        if(!this.addStr) return uni.$showMsg('请选择收货地址！')
        // 是否已登录  没有登录则调用delayNavigate()进行倒计时的导航跳转
        if(!this.token) return this.delayNavigate()
        // 实现微信支付功能
        this.payOrder()
      },
      // 展示倒计时的提示消息
      showTips(n){
        // 调用uni.showToast() 方法 展示提示消息
        uni.showToast({
          // 不展示图标
          icon: 'none',
          // 提示的消息
          title: '请登录后结算！' + n + ' 秒后自动跳转至登录页',
          // 为页面添加透明遮罩 防止点击穿透
          mask: true,
          // 1.5 秒后自动消失
          duration:1500
        })
      },
      // 延迟导航到my页面
      delayNavigate(){
        // 重置秒数
        this.seconds = 3
        // 展示提示消息 此时seconds的值等于3
        this.showTips(this.seconds)
        // 创建定时器 每隔1秒执行一次
        this.timer = setInterval(() => {
          // 秒数自减
          this.seconds --
          // 审查秒数是否<=0
          if(this.seconds <=0){
            // 清除定时器
            clearInterval(this.timer)
            // 页面跳转
            uni.switchTab({
              url: '/pages/my/my',
              // 页面跳转成功之后的回调函数
              success: () => {
                // 调用vuex的updateRedirectInfo方法 将跳转信息存储到仓库
                this.updateRedirectInfo({
                  // 跳转方式
                  openType: 'switchTab',
                  // 出发点
                  from: '/pages/cart/cart'
                })
              }
            })
            // over
            return
          }
          // 根据最新的秒数 进行消息提示
          this.showTips(this.seconds)
        }, 1000)
      },
      // 微信支付
      async payOrder(){
        // 创建订单 组织订单的信息对象
        const orderInfo = {
          // 开发期间 注释掉真正的订单价格
          // orderPrice: this.checkedGoodsAmount,
          // 写死订单总价为一分钱
          order_price: 0.01,
          consignee_addr: this.addStr,
          goods: this.cart.filter( x => x.goods_state ).map( x => ({
            goods_id: x.goods_id, 
            goods_number: x.goods_count, 
            goods_price: x.goods_price
          }))
        }
        // 发起请求创建订单
        const { data: res } = await uni.$http.post('/api/public/v1/my/orders/create', orderInfo)
        if(res.meta.status !== 200) return uni.$showMsg('创建订单失败！')
        // 得到订单编号
        const orderNumber = res.message.order_number
        /**
         * 以上 因为token不对 所以无法获取订单号 导致创建订单失败
         * 但是 找到了可以使用的token
         * */
         // 订单预支付  发起请求获取订单的支付信息
         const { data: res2 } = await uni.$http.post('/api/public/v1/my/orders/req_unifiedorder', { order_number: orderNumber})
         // 预付订单生成失败
         if(res2.meta.status !== 200) return uni.$showMsg('预付订单创建失败！')
         // 得到订单支付相关的必要参数
         const payInfo = res2.message.pay
         // 发起微信支付 调用 uni.requestPayment() 发起微信支付
         const [err, succ] = await uni.requestPayment(payInfo)
         // 未完成支付
         if(err) return uni.$showMsg('订单未支付！')
         // 完成支付 进一步审查结果
         const { data: res3 } = await uni.$http.post('/api/public/v1/my/orders/chkOrder', {order_number: orderNumber})
         // 审查结果订单未支付
         uni.showToast({
           title: '支付完成！',
           icon: 'success'
         })
         /**
          * 支付功能是真滴解决不了了  
          * */
      },
    }
  }
</script>

<style lang="scss">
  // 粘滞定位于底部 flex布局 水平居中
  .settleContainer{
    position: fixed;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 50px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    background-color: white;
    font-size: 14px;
    padding-left: 5px;
    // flex布局 侧轴居中
    .radio{
      display: flex;
      align-items: center;
    }
    .amountBox{
      .amount{
        color: #ff6347;
        font-weight: bold;
      }
    }
    // 行高垂直居中 最小宽度 水平居中
    .btnSettle{
      background-color: #ff6347;
      line-height: 50px;
      padding: 0 10px;
      min-width: 100px;
      text-align: center;
      color: white;
    }
  }
</style>