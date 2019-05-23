// pages/mine/mine.js
var app = getApp();

Page({

    /**
     * 页面的初始数据
     */
    data: {
        edit: true,
        editText: "更新",
        original: {
            "weight": "--",
            "height": "--",
            "age": "--",
            "sex": "--",
            "heart_rate": "--",
            "blood_pressure": "--",
            "BMI": "--"
        },
        editData: {
            "weight": "--",
            "height": "--",
            "age": "--",
            "sex": "--",
            "heart_rate": "--",
            "blood_pressure": "--",
            "BMI": "--"
        }
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        var that = this;
        wx.getStorage({
            key: 'session',
            success: function (res) {
                var session = res.data;
                wx.request({
                    url: app.globalData.url + "/get_user_info",
                    data: {
                        "key": session
                    },
                    success: function (res) {
                        if (res.data.code == 0) {
                            that.setData({
                                original: res.data.data,
                                editData: res.data.data,
                            });
                        } else {
                            wx.showModal({
                                title: '错误',
                                content: res.data.msg,
                                showCancel: false,
                            });
                        }
                    }
                })
            },
            fail: function (res){
                wx.showModal({
                    title: '未登录',
                    content: '您尚未登录',
                    showCancel: false
                });
            }
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

    edit: function(){
        var edit = this.data.editText == "更新" ? false : true;
        this.setData({
            edit: edit,
            editText: edit ? "更新" : "取消",
            data: this.data.original,
        });
    },

    onedit: function(e){
        console.log(e);
        var id = e.target.id
        var data = this.data.editData;
        data[id] = e.detail.value
        this.setData({
            editData: data,
        })
    },

    submit: function(){
        var that = this;
        var data = this.data.editData;
        wx.getStorage({
            key: 'session',
            success: function (res) {
                var session = res.data;
                wx.request({
                    url: app.globalData.url + "/save_user_info",
                    data: {
                        "key": session,
                        "data": data,
                    },
                    success: function (res) {
                        if (res.data.code == 0) {
                            that.setData({
                                edit: true,
                                editText: "更新",
                                original: res.data.data,
                                editData: res.data.data,
                            });
                        } else {
                            wx.showModal({
                                title: '错误',
                                content: res.data.msg,
                                showCancel: false,
                            });
                        }
                    }
                })
            },
        })
    }
})