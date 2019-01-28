// pages/login/login.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    numberArray: [],
    num: 20, // 最多人数
    selectedIndex: 0,
    otherInfo: '', // 备注
    hasRooted: false, // 是否授权
    canIUse: wx.canIUse('button.open-type.getUserInfo')
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    wx.setNavigationBarTitle({
      title: app.globalData.shopName //页面标题为路由参数
    })
    this.setData({
      shopName: app.globalData.shopName
    })
    var that = this;

    // 获取是否选择过人数，如果是则
    if (false) {
      wx.redirectTo({
        url: '/pages/index/index'
      });
      return false;
    }
    this.getNumberList(); // 加载人数列表
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
  // 未授权 -- 授权并点餐
  getUserInfo: function(e) {

  },
  // 获取token
  getToken: function() {

  },
  /**
   * 开始点餐
   */
  goToIndex: function() {
    wx.showLoading({
      title: '加载中'
    })
    var that = this;
    app.globalData.userNumber = this.data.selectedIndex + 1;
    wx.setStorage({
      key: 'userNumber',
      data: that.data.selectedIndex + 1,
    })
    wx.request({
      url: app.globalData.url + '/user/use_num.htm',
      data: {
        userNum: this.data.selectedIndex + 1,
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
        } else if (res.data.retCode == '0') {
          wx.switchTab({
            url: '/pages/index/index'
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
  // 选择人数
  selectFun: function(e) {
    var index = e.currentTarget.dataset.index;
    this.setData({
      selectedIndex: index
    })
  },
  // 加载人数列表
  getNumberList: function() {
    var arr = [];
    for (var i = 0; i < this.data.num; i++) {
      arr.push(i + 1)
    }
    this.setData({
      numberArray: arr
    })
  }
})