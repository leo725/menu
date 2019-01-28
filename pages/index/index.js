//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    showNav: false, // 是否展开导航
    showBottomNavFirst: true, // 底部导航是否展开
    activeIndx: 1,
    scrollToId: "id01",
    navScroll: '',
    navList: [],
    mainList: []
  },
  onShow: function() {
    console.log(getCurrentPages())
    this.getGoodsLists();
  },
  onLoad: function() {
    wx.setNavigationBarTitle({
      title: app.globalData.shopName + '—菜单' //页面标题为路由参数
    })
  },
  getGoodsLists: function() {
    wx.showLoading({
      title: '加载中'
    })
    console.log("accesstoken" + app.globalData.accessToken + '请求参数' + app.globalData.accessToken + ' accid ' + app.globalData.accountId + ' tableId ' + app.globalData.payTableId)
    if (!!app.globalData.accessToken) {
      wx.request({
        url: app.globalData.url + '/goods/goods_list.htm',
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
          console.log("获取菜单列表");
          console.log(res)
          if (res.data.retCode == '10002') {
            wx.reLaunch({
              url: '/pages/welcome/welcome'
            })
            return;
          } else if (res.data.retCode == '0') {
            var navArr = [];
            for (var i = 0; i < res.data.data.length; i++) {
              navArr.push({
                menuCateId: res.data.data[i].menuCateId,
                menuName: res.data.data[i].menuName
              })
            }
            this.setData({
              mainList: res.data.data,
              navList: navArr
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
    } else {
      this.getToken();
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
            picture: app.globalData.userInfo.avatarUrl
          },
          method: 'POST',
          header: {
            'content-type': 'application/x-www-form-urlencoded'
          },
          success: res => {
            console.log('index页面获取token')
            if (res.data.retCode == "0") {
              app.globalData.accessToken = res.data.data.accessToken;
              app.globalData.userId = res.data.data.userId; //赋值app.js的userId
              that.getGoodsLists();
            }
          }
        })
      } else {
        that.getToken()
      }
    }, 50)
  },
  // 显示隐藏导航列表
  toggleNav: function() {
    this.setData({
      showNav: !this.data.showNav,
      navScroll: 'nav-top'
    })
  },
  // 跳转到菜品详情
  prodcutDetail: function(e) {
    var mainIndex = e.currentTarget.dataset.mainindex,
      index = e.currentTarget.dataset.productindex;
    var item = this.data.mainList[mainIndex].goods[index];
    wx.navigateTo({
      url: '/pages/productDetail/productDetail?goodsId=' + item.id
    })
  },
  // 我的订单
  goToMyOrder: function() {
    wx.navigateTo({
      url: '/pages/order/order?frompage=index'
    })
  },
  // 购物车
  goToShopCar: function() {
    wx.navigateTo({
      url: '/pages/shopCar/shopCar'
    })
  },
  // 搜索
  search: function() {
    wx.navigateTo({
      url: '/pages/search/search'
    })
  },
  // 锚点跳转
  goToScroll: function(e) {
    let index = e.currentTarget.dataset.id;
    this.setData({
      activeIndx: index,
      scrollToId: 'id' + index,
      showNav: !this.data.showNav
    })
  },
  // 加入购物车
  addOne: function(e) {
    var that = this;
    var mainIndex = e.currentTarget.dataset.mainindex;
    var index = e.currentTarget.dataset.productindex;
    var item = this.data.mainList[mainIndex].goods[index];
    console.log(item)
    wx.showModal({
      content: '确定加入购物车吗？',
      success: (res) => {
        if (res.confirm) {
          wx.request({
            url: app.globalData.url + '/shopcart/save.htm',
            data: {
              accessToken: app.globalData.accessToken,
              payTableId: app.globalData.payTableId,
              goodsId: item.id,
              accountId: app.globalData.accountId,
              number: 1
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
                wx.showToast({
                  title: '加入购物车成功！',
                })
                that.getGoodsLists();
              } else {
                wx.showToast({
                  title: '数据异常',
                  image: '/images/error.png'
                })
              }
            }
          })
        }
      }
    })
  }
})