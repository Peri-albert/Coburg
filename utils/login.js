var app = getApp();

function login(callback){
  wx.login({
    success: function (res) {
      if (res.code) {
        wx.request({
          url: app.globalData.url + "/wx_login",
          data: {
            code: res.code,
          },
          success: function (res) {
            if (res.data.code == 0) {
              wx.setStorage({
                key: 'session',
                data: res.data.data,
              })
              if (callback != undefined) {
                callback();
              }
            } else {
              console.log("登录失败", res.data.msg);
            }
          }
        })
      } else {
        wx.showModal({
          title: '错误',
          content: '登录失败，请重试',
          showCancel: false,
        })
      }
    }
  })
}

module.exports.login = login;