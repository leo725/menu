// pages/integraHistory/integraHistory.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    orderList: [],
    nomore: false,
    pageNum: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    wx.setNavigationBarTitle({
      title: '积分订单' //页面标题为路由参数
    })
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    this.setData({
      pageNum:0
    })
    this.getOrderList()
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {
    this.data.pageNum += 1;
    this.getOrderList();
  },
  getOrderList: function() {
    if (this.data.nomore) {
      return false;
    }
    wx.showLoading({
      title: '加载中',
    })
    wx.request({
      url: app.globalData.url + '/commodity/commodity_order_list.htm',
      data: {
        accessToken: app.globalData.accessToken,
        accountId: app.globalData.accountId,
        pageNum: this.data.pageNum
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
        } else if (res.data.retCode == '50006') {
          this.setData({
            canUse: false,
            orderList: []
          })
        } else if (res.data.retCode == '0') {
          var flag=false;
          var arr = this.data.orderList.concat(res.data.data)
          if (res.data.data.length < 10) {
            flag = true;
          } else {
            flag = false;
          }
          this.setData({
            orderList: arr,
            nomore: flag
          })
        } else {
          wx.showToast({
            title: '数据异常',
            image: '/images/error.png'
          })
        }
        wx.hideLoading();
      }
    })
  }
})