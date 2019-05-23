// pages/record/record.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
  
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
      var that = this
      this.setData({
          loading: "block",
      });
      wx.getStorage({
          key: 'session',
          success: function(res) {
              wx.request({
                  url: app.globalData.url + "/get_use_log",
                  data: {
                      key: res.data,
                  },
                  success: function(res){
                      if (res.data.code == 0) {
                          var data = res.data.data;
                          for (var i = 0; i < data.length; i++) {
                              data[i]['icon'] = data[i]['status'] === "已完成" ? "../../images/record/finished.png" : "../../images/record/doing.png"
                          }
                          that.setData({
                              use_log: res.data.data,
                              no_data: res.data.data.length > 0 ? "none" : "block",
                          })
                      }
                  },
                  complete: function(res){
                      that.setData({
                          loading: "none",
                      });
                  }
              })
          },
      })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
  
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
  
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
  
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
      var that = this;
      this.setData({
          loading: "block",
      });
      wx.getStorage({
          key: 'session',
          success: function (res) {
              wx.request({
                  url: app.globalData.url + "/get_use_log",
                  data: {
                      key: res.data,
                  },
                  success: function (res) {
                      if (res.data.code == 0) {
                          var data = res.data.data;
                          for(var i = 0; i < data.length; i++){
                              data[i]['icon'] = data[i]['end'] == "" ? "../../images/record/doing.png" : "../../images/record/finished.png"
                          }

                          that.setData({
                              use_log: data,
                              no_data: data.length > 0 ? "none" : "block",
                          })
                      }
                  },
                  complete: function (res) {
                      that.setData({
                          loading: "none",
                      });
                  }
              })
          },
      })
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
  
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  }
})