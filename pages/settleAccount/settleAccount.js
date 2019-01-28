// pages/settleAccount/settleAccount.js
const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    payTableId: '', // 桌号
    moneyTotal: 0, // 总金额
    showLists: false, //显示详情
    orderLists:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    wx.setNavigationBarTitle({
      title: app.globalData.shopName + '—付款'//页面标题为路由参数
    })
    this.setData({
      payTableId: app.globalData.payTableId,
      moneyTotal: options.totalMoney
    })
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
            orderLists: res.data.data.orderDetails
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
        
      }
    })
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  },
  // 继续点菜
  goToIndex: function() {
    wx.switchTab({
      url:"/pages/index/index"
    })
  },
  // 我的订单
  goToMyOrder: function() {
    wx.switchTab({
      url: '/pages/order/order'
    })
  },
  toggleLists: function() {
    this.setData({
      showLists: !this.data.showLists
    })
  }
})