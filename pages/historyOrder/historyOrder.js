// pages/historyOrder/historyOrder.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    currpage:0,
    orderList:[],
    nomore:false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    wx.setNavigationBarTitle({
      title: '历史订单' //页面标题为路由参数
    })
    this.getOrderList();
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    this.data.currpage+=1;
    this.getOrderList();
  },

  getOrderList: function() {
    if(this.data.nomore){
      return false;
    }
    wx.showLoading({
      title: '加载中'
    })
    wx.request({
      url: app.globalData.url + '/order/order_history.htm',
      data: {
        accessToken: app.globalData.accessToken,
        payTableId: app.globalData.payTableId,
        pageNum: this.data.currpage
      },
      method: 'POST',
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: res => {
        if (res.data.retCode == "0") {
          var falg = false;
          var arr = this.data.orderList.concat(res.data.data)
          if(res.data.data.length<10){
            falg =true;
          }else{
            falg = false;
          }
          this.setData({
            orderList: arr,
            nomore: falg
          })
        }else if(res.data.retCode=='10002'){
          wx.reLaunch({
            url: '/pages/welcome/welcome'
          })
          return;
        }else{
          wx.showToast({
            title: '数据异常',
            image: '/images/error.png'
          })
        }
        wx.hideLoading()
      }
    })
  }
})