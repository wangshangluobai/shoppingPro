<template>
  <view>
    <!-- 自定义搜索组件 -->
     <!-- :bgcolor="'red'" :radius="'6'" 可在此设置组件背景颜色及圆角度数 -->
    <top-search @searchClick='toSearch'></top-search>
    <view class="scrollViewContainer">
      <!-- 左侧滑动导航栏 -->
      <scroll-view scroll-y="true" :style="{height: windowH + 'px'}" class="leftScroll">
        <block v-for="(cateList,index) in scrollList" :key="inedx">
          <view :class="['leftScrollItem', index === active ? 'active' : '']" @click="clickLeftItemHandler(index)">
            {{cateList.cat_name}}</view>
        </block>
      </scroll-view>
      <!-- 右侧滑动展示栏 -->
      <scroll-view scroll-y="true" :style="{height: windowH + 'px'}" :scroll-top="scrollTop">
        <!-- 滚动区域二级分类 -->
        <view v-for="(rightItem, index) in scrollListLV2" :key="index">
          <!-- 滚动区域二级分类标题 -->
          <view class="rightItemTitle">
            /{{rightItem.cat_name}}/
          </view>
          <!-- 滚动区域三级分类 -->
          <view class="rightItemImgLV3">
            <view class="rightItem" v-for="(itemLV3, indexLV3) in rightItem.children" :key="indexLV3"
              @click="toGoodsList(itemLV3)">
              <!-- 图片 -->
              <image :src="itemLV3.cat_icon"></image>
              <!-- 文本 -->
              <text>{{itemLV3.cat_name}}</text>
            </view>
          </view>
        </view>
      </scroll-view>
    </view>
  </view>
</template>

<script>
  export default {
    data() {
      return {
        // 设备屏幕可用高度
        windowH: 0,
        // 滚动区域数据
        scrollList: [],
        // active样式标识
        active: 0,
        // 滚动区域二级数据
        scrollListLV2: [],
        // 滚动高度修正
        scrollTop: 0,
      };
    },
    // 页面加载时调用
    onLoad() {
      // 获取设备系统信息
      const sysInfo = uni.getSystemInfoSync()
      this.windowH = sysInfo.windowHeight - 50
      this.getScrollList()
    },
    methods: {
      // 发送请求 获取scrollList数据
      async getScrollList() {
        const {
          data: res
        } = await uni.$http.get('/api/public/v1/categories')
        if (res.meta.status == 200) {
          this.scrollList = res.message
          // 收集滚动区域二级数据
          this.scrollListLV2 = res.message[0].children
        } else {
          return uni.$showMsg()
        }
      },
      // 左边滚动区域点击事件
      clickLeftItemHandler(i) {
        // 为active样式标识 切换为相应点击的值
        this.active = i
        // 根据点击项切换相应的二级菜单数据
        this.scrollListLV2 = this.scrollList[i].children
        // 修正滚动区域位置
        this.scrollTop = this.scrollTop === 0 ? 1 : 0
      },
      // 跳转商品详情页面 点击事件
      toGoodsList(i) {
        uni.navigateTo({
          url: '/subpkg/goods_list/goods_list?cid=' + i.cat_id
        })
      },
      toSearch(){
        uni.navigateTo({
          url: '/subpkg/search/search'
        })
      },
    }
  }
</script>

<style lang="scss">
  // 滚动展示区域
  .scrollViewContainer {
    display: flex;

    .leftScroll {
      width: 120px;

      .leftScrollItem {
        background-color: #f7f7f7;
        line-height: 60px;
        text-align: center;
        font-size: 12px;

        &.active {
          background-color: #FFFFFF;
          position: relative;

          &::before {
            content: '';
            display: block;
            width: 3px;
            height: 30px;
            background-color: tomato;
            position: absolute;
            top: 50%;
            left: 0;
            transform: translateY(-50%);
          }
        }
      }
    }

    // 右侧轮动区域二级展示
    .rightItemTitle {
      font-size: 12px;
      font-weight: bold;
      text-align: center;
      padding: 15px 0;
    }

    // 右侧轮动区域三级展示
    .rightItemImgLV3 {
      display: flex;
      flex-wrap: wrap;

      .rightItem {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        margin-bottom: 20px;
        width: 33.33%;

        image {
          width: 60px;
          height: 60px;
        }

        text {
          font-size: 12px;
        }
      }
    }
  }
</style>
