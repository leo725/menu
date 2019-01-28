// pages/user/user.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    tel:'',
    mobileNo:'',
    point:"",
    orderNumber:0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.setNavigationBarTitle({
      title:'个人中心' //页面标题为路由参数
    })
    this.setData({
      userInfo: app.globalData.userInfo,
      mobileNo: app.globalData.mobileNo,
      orderNumber: app.globalData.orderNumber,
    })
    this.getTel()
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.setData({
      point: app.globalData.point,
    })
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  },
  //获取商家电话
  getTel:function(){
    wx.request({
      url: app.globalData.url + '/user/phone_admin.htm',
      data: {
        payTableId: app.globalData.payTableId
      },
      method: 'POST',
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: res => {
        if (res.data.retCode == "0") {
          this.setData({
            tel:res.data.data
          })
        }
      }
    })
  },
  // 打电话
  callPhone:function(){
    if(this.data.tel==''){
      return false;
    }
    wx.makePhoneCall({
      phoneNumber:this.data.tel
    })
  }
})