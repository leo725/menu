//app.js
App({
  onLaunch: function(options) {
    console.log('扫码获取到的数据')
    console.log(options)
    var that = this;
    // 从二维码获取商户id 和 桌贴id
    var scene = decodeURIComponent(options.query.scene);
    console.log(scene)
    var flag = false;
    if (scene) {
      if (typeof scene == 'string') {
        var idsArr = scene.split(',');
        if (idsArr[0] != undefined && idsArr[0] != 'undefined') {
          that.globalData.payTableId = idsArr[0];
          wx.setStorage({
            key: 'payTableId',
            data: idsArr[0]
          })
        }
        if (idsArr[1] != undefined && idsArr[1] != 'undefined') {
          that.globalData.accountId = idsArr[1];
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
    if(!flag){
      wx.showToast({
        title: '请扫描二维码进入小程序'
      })
    }
    // 登录
    wx.login({
      success: res => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
        if (res.code) {
          getOpenId(res.code)

          function getOpenId(code) {
            wx.request({
              url: that.globalData.url + '/user/get_openid.htm',
              data: {
                code: code
              },
              method: 'POST',
              header: {
                'content-type': 'application/x-www-form-urlencoded'
              },
              success: function(data) {
                if (data.data.retCode == "0") {
                  if (data.data.data.openId == 'null' || data.data.data.openId == null) {} else {
                    that.globalData.openId = data.data.data.openId;
                    that.globalData.seesionKey = data.data.data.seesionKey;
                  }
                }
              },
              fail: function(error) {
                console.info("获取用户openId失败");
              }
            })
          }
        } else {
          console.log('获取用户登录态失败！' + res.errMsg)
        }
      }
    })
    // 获取用户信息
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              // 可以将 res 发送给后台解码出 unionId
              console.log(res)
              this.globalData.userInfo = res.userInfo;
              // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
              // 所以此处加入 callback 以防止这种情况
              if (this.userInfoReadyCallback) {
                this.userInfoReadyCallback(res)
              }
            }
          })
        }
      }
    })
  },
  //接口路径 https://apiorderding.manggeek.com//http://127.0.0.1:8080/orderding/api//http://192.168.0.116:8080/orderding/api
  globalData: {
    userInfo: null,
    url: "https://apiorderding.manggeek.com",
    openId: '',
    seesionKey: "",
    accessToken: '',
    userNumber: 0,
    payTableId: '', // 桌贴ID
    shopName: '',
    accountId: '', // 商家ID
    deskNumber: '', //桌号
    cartId: '', // 购物车ID
    piont:'', // 积分
    mobileNo:'', // 商家电话
    sex:'',
  }
})