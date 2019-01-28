// pages/userInfo/userInfo.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    changeSex: false,
    checked: 1,
    endDate: "",
    birthday: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    wx.setNavigationBarTitle({
      title: '个人信息' //页面标题为路由参数
    })
    this.setData({
      userInfo: app.globalData.userInfo,
      birthday: app.globalData.birthday,
      checked: app.globalData.sex
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },

  // 获取当前日期
  getEndDate: function() {
    var now = new Date();
    var year = now.getFullYear();
    var month = now.getMonth() + 1;
    var day = now.getDate();
    if (month > 0 && month < 10) {
      month = '0' + month;
    }
    if (day > 0 && day < 10) {
      day = '0' + day;
    }
    this.setData({
      endDate: year + '-' + month + '-' + day
    })
  },
  // 选择时间结束
  changeBirthday: function(e) {
    if (this.data.birthday != 'no') {
      wx.showModal({
        content: '已经设置过生日，不能修改',
      })
      return false;
    };
    wx.showModal({
      content: '生日只能修改一次,确定修改吗？',
      success: res => {
        if (res.confirm) {
          this.setData({
            birthday: e.detail.value
          })
          this.changeUserInfo();
        } else {
          return false;
        }
      }
    })

  },
  // 点击改变性别
  changeSexFun: function() {
    this.setData({
      changeSex: true
    })
  },
  // 选择性别
  radioChange: function(e) {
    var that = this;
    setTimeout(function() {
      that.setData({
        changeSex: false,
        checked: e.detail.value
      })
      that.changeUserInfo()
    }, 250)
    
  },
  // 提交用户信息
  changeUserInfo: function() {
    wx.showLoading({
      title: '加载中'
    })
    var obj={
      accessToken: app.globalData.accessToken,
      userId:app.globalData.userId,
      sex: this.data.checked,
    }
    if(this.data.birthday!='no'){
      obj.birthday = this.data.birthday;
      app.globalData.birthday = this.data.birthday;
    }
    wx.request({
      url: app.globalData.url + '/user/update_user.htm',
      data: obj,
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
          app.globalData.sex = this.data.checked;
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
        wx.hideLoading()
      }
    })
  }
})