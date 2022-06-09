// 向外暴露
export default{
  data(){
    return {
      // 默认图片
      defaultPic: '/static/default/default.jpg',
    }
  },
  filters: {
    // 将数字调整 带两位小数点
    tofixed(num){
      return Number(num).toFixed(2)
    }
  },
}