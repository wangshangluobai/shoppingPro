<template>
  <view>
    <view class="goodsList">
      <view v-for="(goods, index) in goodsList" :key="index" @click="toDetail(goods)">
        <goods-item :goods="goods"></goods-item>
      </view>
    </view>
  </view>
</template>

<script>
  export default {
    data() {
      return {
        queryObj: {
          // 查询关键词
          query: '',
          // 分类ID
          cid: '',
          // 页数索引
          pagenum: 1,
          // 每页长度
          pagesize: 10,
        },
        // 存储请求到的商品数据
        goodsList: [],
        // 保存商品总条数
        total: 0,
        // 节流阀
        isloading:false,
      };
    },
    methods: {
      async getGoodsList(cb){
        // 开启节流阀
        this.isloading = true
        /**捕获出乎意料的错误
         * 有些错误单靠判断状态码不可行 status不存在会直接报错 并不能执行到下一步
         * 使用try catch来捕获错误 提示获取失败
         * */
        try{
          /** 注意事项
           * 在这里不同的检索关键字会导致响应502  据我猜测这是因为中文会被编码转换为其他形式
           * 服务器可以处理这种形式  但是若检索关键字为英文 则不会出现转换 导致检索失败返回502
           * 后台应该只是对中文 数字做出应对
           * 我的方法太傻了 应当加强对$http的熟悉程度 不能什么事都想到三元 不利于思维成长
           * ${this.query ? 'query='+this.query : 'cid='+this.cid}/pagenum=${this.pagenum}/pagesize=${this.pagesize}
           * */
          /* if(this.total-this.goodsList.length < this.queryObj.pagesize){
            this.queryObj.pagesize = this.total-this.goodsList.length
          } */
          const {data:res} = await uni.$http.get('/api/public/v1/goods/search', this.queryObj)
          // 关闭节流阀
          this.isloading = false
          // 检查是否存在回调 存在便执行
          cb&&cb()
          if(res.meta.status!==200) return uni.$showMsg()
          const { goods,total } = res.message
          this.goodsList = [...this.goodsList,...goods]
          this.total = total
        }catch(e){
          //TODO handle the exception
          return uni.$showMsg()
        }
      },
      toDetail(goods){
        uni.navigateTo({
          url: '/subpkg/goods_detail/goods_detail?goods_id=' + goods.goods_id
        })
      }
    },
    // 页面加载时请求数据
    onLoad(options) {
      // 标题
      uni.setNavigationBarTitle({
        title: 'OtherChannel'
      })
      // 这种方法只能二选一 且外部需要包裹一层 还需要解构赋值 两种方式差不多
      // option.cid ? this.cid = option.cid : this.query = option.query
      this.queryObj.query = options.query || ''
      this.queryObj.cid = options.cid || ''
      this.getGoodsList()
    },
    // 上拉触底回调
    onReachBottom() {
      // 根据总数|每次请求长度|当前页码计算是否还有数据可被请求
      // this.goodsList.length>=this.total
      if(this.queryObj.pagenum * this.queryObj.pagesize >= this.total) return uni.$showMsg('数据加载完毕')
      // 根据节流阀判断是否处理本次请求
      if(this.isloading) return
      // 页码自增1
      this.queryObj.pagenum++
      // 根据新的页码再次请求
      this.getGoodsList()
    },
    // 下拉刷新
    onPullDownRefresh() {
      // 重置数据
      this.queryObj.pagenum = 0,
      this.total = 0,
      this.isloading = false,
      this.goodsList = []
      // 重新发起请求
      this.getGoodsList(()=>{uni.stopPullDownRefresh()})
    },
  }
</script>

<style lang="scss">

</style>
