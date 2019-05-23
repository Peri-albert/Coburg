// pages/rear_pressure/rear_pressure.js
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
  
  },

  press_1: function (e) {
      app.globalData.p1 = +e.target.dataset.no
  },

  press_2: function (e) {
      app.globalData.p2 = +e.target.dataset.no
  },

  press_3: function (e) {
      app.globalData.p3 = +e.target.dataset.no
  },

  press_4: function (e) {
      app.globalData.p4 = +e.target.dataset.no
  },

  start_bl: function (e) {
    var code = app.globalData.p1+app.globalData.p2+app.globalData.p3+app.globalData.p4 + 256;
    // console.log(code.toString());
    app.globalData.bt.writeData(this, code.toString());
  }
})