// pages/setting/setting.js
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
    app.globalData.p11 = +e.target.dataset.no
  },

  press_2: function (e) {
    app.globalData.p12 = +e.target.dataset.no
  },

  press_3: function (e) {
    app.globalData.p13 = +e.target.dataset.no
  },

  press_4: function (e) {
    app.globalData.p14 = +e.target.dataset.no
  },

//  press_5: function (e) {
//    app.globalData.p15 = +e.target.dataset.no
//  },


  start_bl: function (e) {
    var code = app.globalData.p11+app.globalData.p12+app.globalData.p13+app.globalData.p14+app.globalData.p15 + 1280;
    // console.log(code.toString());
    app.globalData.bt.writeData(this, code.toString());
  }
})