// pages/order/order.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    payTableId: "",
    frompage: 'index',
    orderTime: '', // 下单时间
    userNumber: 0,
    needPay: 0,
    hadPay: 0,
    orderLists: [],
    payTableNum:'',
    orderNo:""
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    wx.setNavigationBarTitle({
      title: app.globalData.shopName + '—订单' //页面标题为路由参数
    })
    console.log(app.globalData)
    this.setData({
      payTableId: app.globalData.payTableId,
      payTableNum: app.globalData.payTableNum,
      userNumber: app.globalData.userNum
    })
    
  },
  onShow:function(){
    this.getOrderData();
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  },
  getOrderData:function(){
    wx.showLoading({
      title: '加载中'
    })
    wx.request({
      url: app.globalData.url + '/order/order_info.htm',
      data: {
        accessToken: app.globalData.accessToken,
        payTableId: app.globalData.payTableId
      },
      method: 'POST',
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: res => {
        if (res.data.retCode == '10002') {
          wx.reLaunch({
            url: '/pages/welcome/welcome'
          })
          return;
        } else if (res.data.retCode == '0') {
          this.setData({
            orderLists: res.data.data.orderDetails,
            needPay: res.data.data.totalPrice,
            orderTime: res.data.data.updateTime,
            userNumber: res.data.data.userNum,
            payTableNum: res.data.data.payTableNo,
            orderNo: res.data.data.orderNo
          })
        } else if(res.data.retCode == '20003'){
          this.setData({
            orderLists: []
          })
        } else {
          wx.showToast({
            title: '数据异常',
            image: '/images/error.png'
          })
        }
        wx.hideLoading()
      },
      fail: err => {
        console.log(err, 'err')
      }
    })
  },
  goToIndex: function() {
    wx.navigateBack({
      delta: 0
    })
  },
  goToShopCar: function() {
    wx.redirectTo({
      url: '/pages/shopCar/shopCar'
    })
  },
  goToSettleAccount: function() {
    if (this.data.orderLists.length <= 0 || this.data.needPay <= 0) {
      wx.showModal({
        title: '',
        content: '订单空空如也，先去点菜吧！',
        success: res => {
          if(res.confirm){
            wx.switchTab({
              url: '/pages/index/index'
            })
          }
        }
      })
      return false;
    }
    wx.navigateTo({
      url: '/pages/settleAccount/settleAccount?totalMoney=' + this.data.needPay
    })
  }
})