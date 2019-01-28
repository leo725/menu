// pages/integralMall/integralMall.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    goodsList: [],
    point: 0,
    canUse:true // 是否使用积分
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    wx.setNavigationBarTitle({
      title: '积分商城' //页面标题为路由参数
    })
    this.setData({
      point: app.globalData.point
    })
    this.getGoodsList();
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

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
  getGoodsList: function() {
    wx.showLoading({
      title: '加载中',
    })
    wx.request({
      url: app.globalData.url + '/commodity/commodity_list.htm',
      data: {
        accessToken: app.globalData.accessToken,
        accountId: app.globalData.accountId,
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
        } else if(res.data.retCode=='50006'){
          this.setData({
            canUse:false,
            goodsList:[]
          })
        } else if (res.data.retCode == '0') {
          this.setData({
            goodsList: res.data.data
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
  },
  addOne: function(e) {
    wx.showModal({
      title: '确认兑换',
      content: '确认兑换此商品吗？',
      success: param=>{
        if(param.cancel){return false;}
        var index = e.currentTarget.dataset.index;
        var item = this.data.goodsList[index];
        wx.showLoading({
          title: '加载中',
        })
        wx.request({
          url: app.globalData.url + '/commodity/commodity_order_create.htm',
          data: {
            commodityId: item.id,
            num: 1,
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
              app.globalData.point = res.data.data;
              this.setData({
                point: app.globalData.point
              })
              wx.navigateTo({
                url: '/pages/exchangeSuccess/exchangeSuccess'
              })
            } else if (res.data.retCode == '10001') {
              wx.showModal({
                content: '兑换失败，积分不足',
                showCancel: false
              })
              wx.show
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
    
  }
})