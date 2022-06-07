<template>
  <view>
      <!-- 顶部搜索组件 -->
      <view class="search-box">
        <uni-search-bar
          @confirm="search" 
          @input="input" 
          :radius="100" 
          cancelButton="none">
        </uni-search-bar>
      </view>
      <!-- 搜索建议列表-->
      <view class="suggList" v-if='searchResults.length!==0'>
        <view class="suggItem" v-for="(item, index) in searchResults" :key="index" @click="toDetail(item)">
          <view class="goodsName">{{item.goods_name}}</view>
          <uni-icons type='arrowright' size='16'></uni-icons>
        </view>
      </view>
      <!-- 搜索历史 -->
      <view class="searchHistory" v-else>
        <!-- 标题区 -->
        <view class="historyTitle">
          <text>搜索历史</text>
          <uni-icons type="trash" size="17" @click="clearHistoryKW"></uni-icons>
        </view>
        <!-- 列表区 -->
        <view class="historyList">
          <uni-tag :text='item' v-for="(item, index) in histories" :key="index" @click="toGoodsList(item)">{{item}}</uni-tag>
        </view>
      </view>
  </view>
</template>

<script>
  export default {
    data() {
      return {
        // 延时器
        timer: null,
        // 关键字
        kw: '',
        // 搜索结果列表
        searchResults: [],
        // 搜索历史
        historyList: [],
      };
    },
    methods: {
      // 请求搜索结果列表数据
      async getSearchResults(){
        // 首先判断关键词是否为空
        if(this.kw===''){
          // 将搜索结果置空
          this.searchResults = []
          // 不做请求
          return
        }
        const {data: res} = await uni.$http.get('/api/public/v1/goods/qsearch', {query: this.kw})
        if(res.meta.status == 200){
          this.searchResults = res.message
        }
        this.saveSearchHistory()
      },
      // input 输入处理函数
      input(e){
        // 定时器重新计时
        clearTimeout(this.timer)
        // 计时
        this.timer = setTimeout(()=>{
          // 500毫秒内没有变化 则开始提交关键词
          this.kw = e.trim()
          this.getSearchResults()
        },500)
      },
      toDetail(item){
        uni.navigateTo({
          url: '/subpkg/goods_detail/goods_detail?goods_id=' + item.goods_id
        })
      },
      saveSearchHistory(){
        // this.historyList.push(this.kw)
        // 根据已存在搜索历史创建set数组
        const set = new Set(this.historyList)
        // 在添加之前删除与新添加的搜索历史值相等的值 不然新的值不会被添加 导致新的搜索历史在数组中的位置不变
        set.delete(this.kw)
        // 添加新的搜索历史 
        set.add(this.kw)
        // 将处理完毕的数据 重新赋予historyList
        this.historyList = Array.from(set)
        // 将数据持久化存储到本地
        uni.setStorageSync('historyKW', JSON.stringify(this.historyList))
      },
      // 清空搜索历史数据
      clearHistoryKW(){
        //首先将渲染出来的数据清除
        this.historyList = []
        uni.setStorageSync('historyKW', '[]')
        // uni.clearStorage()
      },
      toGoodsList(item){
        uni.navigateTo({
          url: '/subpkg/goods_list/goods_list?query=' + item
        })
      }
    },
    // 计算属性
    computed: {
      // 避免dom的过渡操作
      histories(){
          return [...this.historyList].reverse()
      },
    },
    onLoad() {  
      uni.setNavigationBarTitle({
        title: 'OtherChannel'
      })
      this.historyList = JSON.parse(uni.getStorageSync('historyKW') || '[]')
    },
  }
</script>

<style lang="scss">
  .search-box{
    position: sticky;
    top: 0;
    z-index: 999;
  }
  // 搜索建议
  .suggList{
    padding: 0 5px;
    .suggItem{
      display: flex;
      align-items: center;
      justify-content: space-between;
      font-size: 12px;
      padding: 13px 0;
      border-bottom: 1px solid #efefef;
    }
    .goodsName{
      // 文本不换行
      white-space: nowrap;
      // 超出部分隐藏
      overflow: hidden;
      // 文本溢出后使用...
      text-overflow: ellipsis;
    }
  }
  // 搜索历史
  .searchHistory{
    padding: 0 5px;
    .historyTitle{
      display: flex;
      justify-content: space-between;
      height: 40px;
      align-items: center;
      font-size: 13px;
      border-bottom: 1px solid #efefef;
    }
    .uni-tag{
      background-color: tomato;
      margin-top: 5px;
      margin-right: 5px;
    }
  }
</style>
