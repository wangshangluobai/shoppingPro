// 按需引入vuex方法
import { mapGetters } from 'vuex'

// 导出一个mixin对象
export default{
  // 数据
  data(){
    return {
    }
  },
  // 计算属性
  computed: {
    ...mapGetters('mCart', ['total']),
  },
  // 监视属性
  watch:{
    // 监控total的变化
    total: {
      handler(newVal){
        // 重新调用该方法，此时值是新的 当total的值为0时 隐藏tabBar的数字徽标
        newVal ? this.setBadge() : uni.removeTabBarBadge({index: 2})
      }
    },
  },
  // 生命周期钩子
  onShow(){
    // 在页面刚展示的时候 设置数字徽标 当total的值为0时 不调用tabBar的数字徽标方法
    this.total && this.setBadge()
  },
  // 方法
  methods: {
    setBadge(){
      // 调用 uni.setTabBarBadge()方法 为购物车设置右上角的徽标
      uni.setTabBarBadge({
        // 索引 从0开始计算
        index: 2,
        // text的值必须是字符串 不能是数字
        text: this.total + ''
        // text: this.total ? '' : this.total + ''
        // text: this.total + '' && this.total + ''
      })
    },
  },
}