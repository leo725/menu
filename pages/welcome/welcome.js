// pages/welcome/welcome.js
const app = getApp()
Page({
  /**
   * 页面的初始数据
   */
  data: {
    shopName: app.globalData.shopName,
    hasRooted: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    hasUserNumber: false
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    console.log(options+"welcome的options")
    var scene = decodeURIComponent(options.scene);
    var flag = false;
    if (scene) {
      if (typeof scene == 'string') {
        var idsArr = scene.split(',');
        if (idsArr[0] != undefined && idsArr[0] != 'undefined') {
          app.globalData.payTableId = idsArr[0];
          wx.setStorage({
            key: 'payTableId',
            data: idsArr[0]
          })
        }
        if (idsArr[1] != undefined && idsArr[1] != 'undefined') {
          app.globalData.accountId = idsArr[1];
          wx.setStorage({
            key: 'accountId',
            data: idsArr[1],
          })
        }
        if (idsArr[0] != undefined && idsArr[0] != 'undefined' && idsArr[1] != undefined && idsArr[1] != 'undefined') {
          flag = true;
        }
      }
    }
    if (!flag) {
      wx.showToast({
        title: '请扫描二维码进入小程序'
      })
    }
    var that = this;
    wx.showLoading({
      title: '加载中'
    })
    wx.getStorage({
      key: 'userNumber',
      success: function(res) {
        if (res.data) {
          that.setData({
            hasUserNumber: true
          })
        }
      },
    })
    wx.getStorage({
      key: 'payTableId',
      success: function(res) {
        app.globalData.payTableId = res.data;
        that.getShopInfo();
      },
    })
    wx.getSetting({
      success: res => {
        // 已授权
        if (res.authSetting['scope.userInfo']) {
          this.setData({
            hasRooted: true
          })
        }
        if (app.globalData.userInfo) {
          that.getToken(); //调用获取token的接口
        } else if (that.data.canIUse) {
          // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
          // 所以此处加入 callback 以防止这种情况
          app.userInfoReadyCallback = res => {
            that.getToken(); //调用获取token的接口
          }
        } else {
          // 在没有 open-type=getUserInfo 版本的兼容处理
          wx.getUserInfo({
            success: res => {
              app.globalData.userInfo = res.userInfo
              that.getToken(); //调用获取token的接口
            }
          })
        }
      }
    })
  },
  // 获取餐桌信息
  getShopInfo: function() {
    var that = this;
    console.log(app.globalData.payTableId + '获取餐桌信息')
    wx.request({
      url: app.globalData.url + '/user/merchant_info.htm',
      data: {
        payTableId: app.globalData.payTableId
      },
      method: 'POST',
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: res => {
        console.log('餐桌信息');
        console.log(res)
        if (res.data.retCode == '0') {
          app.globalData.shopName = res.data.data.name;
          app.globalData.accountId = res.data.data.id;
          wx.setNavigationBarTitle({
            title: app.globalData.shopName //页面标题为路由参数
          })
          this.setData({
            shopName: app.globalData.shopName
          })
          this.setData({
            hasUserNumber: res.data.data.isUse == 'n' ? false : true
          })
          app.globalData.mobileNo = res.data.data.mobileNo;
        } else if (res.data.retCode == '20001') {
          wx.showModal({
            title: '提示',
            content: res.data.errMsg,
          })
        } else {
          wx.showToast({
            title: '数据异常',
            image: '/images/error.png'
          })
        }
        wx.hideLoading()
      }
    })
  },
  // 获取用户信息
  getUserInfo: function(e) {
    var that = this;
    if (e.detail.userInfo) {
      //用户按了允许授权按钮
      app.globalData.userInfo = e.detail.userInfo;
      if (!app.globalData.accessToken) {
        that.getToken(); //调用获取token的接口
      }
      var n = 0;
      var timer = setInterval(function () {
        n++;
        if (!!app.globalData.accessToken) {
          clearInterval(timer)
          wx.hideLoading()
          if (that.data.hasUserNumber) {
            wx.switchTab({
              url: '/pages/index/index'
            });
          } else {
            wx.redirectTo({
              url: '/pages/login/login'
            });
          }
        }else if (n >= 50) {
          clearInterval(timer);
          wx.hideLoading();
          wx.showModal({
            content: '加载失败，请稍后再试',
          })
        }
      }, 100);
    } else {
      // 点击取消按钮
      wx.showModal({
        title: '提示',
        cancelText: "下次再说",
        confirmText: "重新授权",
        content: '该页面需要获取您的公开信息，请到小程序的设置中打开用户授权！',
        success: function(res) {
          if (res.confirm) {
            wx.openSetting({
              success: function(res) {
                if (!res.authSetting["scope.userInfo"] || !res.authSetting["scope.userLocation"]) {
                  //这里是授权成功之后 填写你重新获取数据的js
                  wx.getUserInfo({
                    success: function(res) {
                      app.globalData.userInfo = res.userInfo;
                      that.getToken(); //调用获取token的接口
                      if (that.data.hasUserNumber) {
                        wx.redirectTo({
                          url: '/pages/index/index'
                        });
                      } else {
                        wx.redirectTo({
                          url: '/pages/login/login'
                        });
                      }

                    }
                  })
                }
              }
            })
          } else if (res.cancel) {
            console.log('用户点击取消')
          }
        }
      })
    }
  },
  // 获取Token
  getToken: function() {
    var that = this;
    setTimeout(function() {
      if (app.globalData.openId != null && app.globalData.openId != undefined && app.globalData.openId != '') {
        wx.request({
          url: app.globalData.url + '/user/login.htm',
          data: {
            openId: app.globalData.openId,
            name: app.globalData.userInfo.nickName,
            picture: app.globalData.userInfo.avatarUrl,
            payTableId: app.globalData.payTableId
          },
          method: 'POST',
          header: {
            'content-type': 'application/x-www-form-urlencoded'
          },
          success: res => {
            console.log('获取token')
            console.log(res)
            console.log({
              openId: app.globalData.openId,
              name: app.globalData.userInfo.nickName,
              picture: app.globalData.userInfo.avatarUrl,
              payTableId: app.globalData.payTableId,
              sex: app.globalData.userInfo.gender
            })
            if (res.data.retCode == "0") {
              app.globalData.accessToken = res.data.data.accessToken;
              app.globalData.userId = res.data.data.id; //赋值app.js的userId
              app.globalData.point = res.data.data.number;
              app.globalData.orderNumber = res.data.data.orderNumber;
              app.globalData.birthday = res.data.data.birNo;
              app.globalData.sex = res.data.data.sex
            }
          }
        })
      } else {
        that.getToken()
      }
    }, 50)
  },
  // 开始点菜
  goNext: function() {
    var that = this;
    wx.showLoading({
      title: '加载中'
    })
    if (!app.globalData.accessToken) {
      that.getToken();
    }
    var n=0;
    var timer = setInterval(function() {
      n++;
      if (!!app.globalData.accessToken) {
        clearInterval(timer)
        wx.hideLoading()
        if (that.data.hasUserNumber) {
          wx.switchTab({
            url: '/pages/index/index'
          });
        } else {
          wx.redirectTo({
            url: '/pages/login/login'
          });
        }
      }else if (n >= 50) {
        clearInterval(timer);
        wx.hideLoading();
        wx.showModal({
          content: '加载失败，请稍后再试',
        })
      }
    },100)
  }
})