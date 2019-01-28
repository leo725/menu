// pages/search/search.js
const app = getApp()
var firstClick = true;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    searchList: []
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    wx.setNavigationBarTitle({
      title: app.globalData.shopName + '—搜索' //页面标题为路由参数
    })
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  },
  getSearch: function(e) {
    wx.showLoading({
      title: '加载中'
    });
    wx.request({
      url: app.globalData.url + '/goods/goods_list.htm',
      data: {
        accessToken: app.globalData.accessToken,
        accountId: app.globalData.accountId,
        goodsName: e.detail.value,
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
        }
        if (res.data.retCode == '0') {
          for (var i = 0; i < res.data.data.length; i++) {
            for (var j = 0; j < res.data.data[i].goods.length; j++) {
              res.data.data[i].goods[j].num = 1;
            }
          }
          console.log(res.data.datas)
          this.setData({
            searchList: res.data.data
          })
        } else if (res.data.retCode == '10002') {
          wx.reLaunch({
            url: '/pages/welcome/welcome'
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
  goToIndex: function() {
    wx.navigateBack({
      delta: 0
    })
  },
  goToDetail: function(e) {
    var firstIndex = e.currentTarget.dataset.firstindex
    var index = e.currentTarget.dataset.index;
    var item = this.data.searchList[firstIndex].goods[index];
    wx.redirectTo({
      url: '/pages/productDetail/productDetail?goodsId=' + item.id
    })
  },
  add: function(e) {
    var firstIndex = e.currentTarget.dataset.firstindex
    var index = e.currentTarget.dataset.index;
    var item = this.data.searchList[firstIndex].goods[index];
    item.num++;
    this.setData({
      searchList: this.data.searchList
    })
  },
  minus: function(e) {
    var firstIndex = e.currentTarget.dataset.firstindex
    var index = e.currentTarget.dataset.index;
    var item = this.data.searchList[firstIndex].goods[index];
    item.num--;
    if (item.num <= 0) {
      item.num = 1
    };
    this.setData({
      searchList: this.data.searchList
    })
  },
  addCar: function(e) {
    if (!firstClick) {
      return false;
    }
    firstClick = false;
    var firstIndex = e.currentTarget.dataset.firstindex
    var index = e.currentTarget.dataset.index;
    var item = this.data.searchList[firstIndex].goods[index];
    wx.request({
      url: app.globalData.url + '/shopcart/save.htm',
      data: {
        accessToken: app.globalData.accessToken,
        payTableId: app.globalData.payTableId,
        goodsId: item.id,
        accountId: app.globalData.accountId,
        number: item.num
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