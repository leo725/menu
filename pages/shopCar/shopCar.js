// pages/shopCar/shopCar.js
const app = getApp()
var firstClick = true;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    payTableId: app.globalData.payTableId, // 桌号
    userNumber: 0, // 人数
    productNumber: 0, //商品数量
    total: 0,
    carLists: [],
    payTableNum:""
  },
  onLoad: function() {
    wx.setNavigationBarTitle({
      title: app.globalData.shopName + '—购物车' //页面标题为路由参数
    })
  },
  onShow: function() {
    this.getCarList()
  },
  /** 
   * 获取购物车列表
   */
  getCarList: function() {
    wx.showLoading({
      title: '加载中',
    })
    wx.request({
      url: app.globalData.url + '/shopcart/cart_list.htm',
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
        wx.hideLoading()
        if (res.data.retCode == '10002') {
          wx.reLaunch({
            url: '/pages/welcome/welcome'
          })
          return;
        } else if (res.data.retCode == '0') {
          this.setData({
            carLists: res.data.data.froms,
            payTableId: res.data.data.payTableId,
            total: res.data.data.total,
            userNumber: res.data.data.peopleNum,
            payTableNum: res.data.data.payTableNum
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
  /**
   * 清空购物车
   */
  clearCar: function() {
    if (this.data.carLists.length <= 0) {
      return false;
    }
    wx.showModal({
      title: "",
      content: "确定要清空购物车吗？",
      success: (res) => {
        if (res.confirm) {
          this.setData({
            carLists: [],
            total: 0,
            productNumber: 0
          })
          wx.request({
            url: app.globalData.url + '/shopcart/del_cart.htm',
            data: {
              accessToken: app.globalData.accessToken,
              type: 'all',
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
              } else if (res.data.retCode == '0') {
                this.getCarList();
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
  },
  /**
   * 返回主页继续点菜
   */
  goToIndex: function() {
    wx.navigateBack({
      delta: 0
    })
  },
  /**
   * 下单
   */
  submitOrder: function() {
    if (!firstClick) {
      return false;
    }
    firstClick = false;
    wx.showLoading({
      title: '加载中',
    })
    var carts = [];
    for (var i = 0; i < this.data.carLists.length; i++) {
      carts.push(this.data.carLists[i].id)
    }
    wx.request({
      url: app.globalData.url + '/order/create_order.htm',
      data: {
        accessToken: app.globalData.accessToken,
        carts: carts.join(),
        userNum: this.data.userNumber,
        payTableId: app.globalData.payTableId,
        userId: app.globalData.userId
      },
      method: 'POST',
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: res => {
        firstClick = true;
        if (res.data.retCode == '0') {
          wx.switchTab({
            url: '/pages/order/order'
          })
          app.globalData.orderId = res.data.data.id
        } else if (res.data.retCode == '10002') {
          wx.reLaunch({
            url: '/pages/welcome/welcome'
          })
          return;
        } else {
          wx.showToast({
            title: '数据异常',
            image: '/images/error.png'
          })
        }
        wx.hideLoading()
      },
      fail: err => {
        firstClick = true
      }
    })

  },
  /**
   * 减
   */
  minus: function(e) {
    var index = e.currentTarget.dataset.id;
    this.data.carLists[index].number--;
    var item = this.data.carLists[index];
    if (this.data.carLists[index].number <= 0) {
      wx: wx.showModal({
        title: '',
        content: '不想要该商品了吗？',
        success: (res) => {
          if (res.confirm) {
            this.data.carLists.splice(index, 1)
            wx.request({
              url: app.globalData.url + '/shopcart/del_cart.htm',
              data: {
                accessToken: app.globalData.accessToken,
                cartId: item.id,
                type: 'one',
                accountId: app.globalData.accountId,
                payTableId: app.globalData.payTableId
              },
              method: 'POST',
              header: {
                'content-type': 'application/x-www-form-urlencoded'
              },
              success: res => {
                if (res.data.retCode == '0') {
                  this.getCarList()
                } else if (res.data.retCode == '10002') {
                  wx.reLaunch({
                    url: '/pages/welcome/welcome'
                  })
                  return;
                } else {
                  wx.showToast({
                    title: '数据异常',
                    image: '/images/error.png'
                  })
                }
              }
            })
          } else {
            this.data.carLists[index].number = 1;
          }
          this.setData({
            carLists: this.data.carLists
          })
        }
      })
    }
    else {
      wx.request({
        url: app.globalData.url + '/shopcart/save.htm',
        data: {
          accessToken: app.globalData.accessToken,
          payTableId: app.globalData.payTableId,
          goodsId: item.goodsId,
          accountId: app.globalData.accountId,
          number: item.number,
          id: item.id
        },
        method: 'POST',
        header: {
          'content-type': 'application/x-www-form-urlencoded'
        },
        success: res => {
          if (res.data.retCode == '0') {
            this.getCarList()
          } else if (res.data.retCode == '10002') {
            wx.reLaunch({
              url: '/pages/welcome/welcome'
            })
            return;
          } else {
            wx.showToast({
              title: '数据异常',
              image: '/images/error.png'
            })
          }
        }
      });
    }

  },
  /**
   * 加
   */
  add: function(e) {
    var index = e.currentTarget.dataset.id;
    this.data.carLists[index].number++;
    var item = this.data.carLists[index];
    wx.request({
      url: app.globalData.url + '/shopcart/save.htm',
      data: {
        accessToken: app.globalData.accessToken,
        payTableId: app.globalData.payTableId,
        goodsId: item.goodsId,
        accountId: app.globalData.accountId,
        number: item.number,
        id: item.id
      },
      method: 'POST',
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: res => {
        if (res.data.retCode == '0') {
          this.getCarList()
        } else if (res.data.retCode == '10002') {
          wx.reLaunch({
            url: '/pages/welcome/welcome'
          })
          return;
        } else {
          wx.showToast({
            title: '数据异常',
            image: '/images/error.png'
          })
        }
      }
    });
    this.setData({
      carLists: this.data.carLists
    })
  }
})