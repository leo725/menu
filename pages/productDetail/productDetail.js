// pages/productDetail/productDetail.js
const app = getApp()
var firstClick = true;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    num: 1,
    detail: {
      title: "香辣鸡中翅",
      price: 48
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    wx.setNavigationBarTitle({
      title: app.globalData.shopName + '—详情' //页面标题为路由参数
    })
    this.setData({
      goodsId: options.goodsId
    })
    this.getGoodsDetail()
  },
  getGoodsDetail: function() {
    wx.request({
      url: app.globalData.url + '/goods/goods_info.htm',
      data: {
        accessToken: app.globalData.accessToken,
        goodsId: this.data.goodsId,
        payTableId: app.globalData.payTableId
      },
      method: 'POST',
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: res => {
        wx.hideLoading();
        if (res.data.retCode == '10002') {
          wx.reLaunch({
            url: '/pages/welcome/welcome'
          })
          return;
        } else if (res.data.retCode == '0') {
          this.setData({
            detail: res.data.data
          })
        } else {
          wx.showToast({
            title: '数据异常',
            image: '/images/error.png'
          })
        }
      }
    })
  },
  // 减
  minus: function() {
    this.data.num -= 1;
    this.setData({
      num: this.data.num > 0 ? this.data.num : 1
    })
  },
  // 加
  add: function() {
    this.setData({
      num: this.data.num += 1
    })
  },
  // 返回
  goBack: function() {
    wx.navigateBack({})
  },
  // 加入购物车
  addCar: function() {
    if (!firstClick) {
      return false;
    }
    firstClick = false;
    wx.request({
      url: app.globalData.url + '/shopcart/save.htm',
      data: {
        accessToken: app.globalData.accessToken,
        payTableId: app.globalData.payTableId,
        goodsId: this.data.detail.id,
        accountId: app.globalData.accountId,
        number: this.data.num,
        id: '' // 购物车ID？？
      },
      method: 'POST',
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: res => {
        firstClick = true;
        if (res.data.retCode == '10002') {
          wx.reLaunch({
            url: '/pages/welcome/welcome'
          })
          return;
        } else if (res.data.retCode == '0') {
          wx.navigateBack({})
        } else {
          wx.showToast({
            title: '数据异常',
            image: '/images/error.png'
          })
        }
      },
      fail: err => {
        firstClick = false;
      }
    })
  }
})