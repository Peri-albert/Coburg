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
      app.globalData.p5 = +e.target.dataset.no
  },

  press_2: function (e) {
      app.globalData.p6 = +e.target.dataset.no
  },

  press_3: function (e) {
      app.globalData.p7 = +e.target.dataset.no
  },

  press_4: function (e) {
      app.globalData.p8 = +e.target.dataset.no
  },

  start_bl: function (e) {
    var code = app.globalData.p5+app.globalData.p6+app.globalData.p7+app.globalData.p8 + 512;
    // console.log(code.toString());
    app.globalData.bt.writeData(this, code.toString());
  }
})