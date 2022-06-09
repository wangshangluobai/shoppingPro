import { mapGetters } from 'vuex'

// 导出一个mixin对象
export default{
  data(){
    return {
    }
  },
  computed: {
    ...mapGetters('mCart', ['total']),
  },
  watch:{
    // 监控total的变化
    total: {
      handler(newVal){
        // 重新调用该方法，此时值是新的
        this.setBadge()
      }
    }
  },
  onShow(){
    // 在页面刚展示的时候 设置数字徽标
    this.setBadge()
  },
  methods: {
    setBadge(){
      // 调用 uni.setTabBarBadge()方法 为购物车设置右上角的徽标
      uni.setTabBarBadge({
        // 索引 从0开始计算
        index: 2,
        // text的值必须是字符串 不能是数字
        text: this.total + ''
      })
    },
  },
}