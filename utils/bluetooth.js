var deviceList = ['Ma Tong'];
var deviceId = "";
var uuid = "";
var chuuid = "";
var app = getApp();

// 蓝牙初始化
// that是小程序JS对象
function bluetoothInit(that){
  wx.showLoading({
    title: '正在初始化蓝牙',
  })
  console.log("蓝牙", "开始初始化蓝牙");
  wx.openBluetoothAdapter({
    success: function(res){
      console.log("蓝牙", "蓝牙初始化成功")
      checkStatus(that);
    },
    fail: function(res){
      console.log("蓝牙", "蓝牙初始化失败");
      wx.hideLoading();
      wx.showModal({
        title: '提示',
        content: '蓝牙初始化失败，请检查蓝牙设置',
        showCancel: false,
      });
    }
  })
}

// 获取蓝牙适配器状态-是否开启，是否在搜索状态等
function checkStatus(that, flag){
  console.log("蓝牙", "开始检查蓝牙适配器是否开启以及是否在搜索状态");
  wx.getBluetoothAdapterState({
    success: function(res) {
      var available = res.available;
      var discovering = res.discovering;
      if(!available){
        wx.hideLoading();
        wx.showToast({
          title: '蓝牙不可用',
          icon: 'success',
          during: 2000,
        })
        stopBluetooth(that);
      }

      if(!discovering){
        if (flag == undefined) {
          // wx.hideLoading();
          // wx.showLoading({
          //   title: '搜索可用的蓝牙设备',
          // })
          startSearch(that);
        }
      }else{
        if(flag != undefined){
          wx.hideLoading();
          wx.showLoading({
            title: '搜索蓝牙中',
          })
        }
      }
    },
    fail: function(res){
      console.log("蓝牙", "蓝牙信息获取失败");
      wx.hideLoading();
      wx.showModal({
        title: '提示',
        content: '蓝牙适配器信息获取失败，请检查蓝牙设置',
        showCancel: false,
      });
      stopBluetooth(that);
    }
  })
}

// 搜索蓝牙设备
function startSearch(that){
  console.log("蓝牙", "开始搜索蓝牙设备");
  wx.startBluetoothDevicesDiscovery({
    allowDuplicatesKey: true,
    interval: 1000,
    success: function (res) {
      // 当找到新设备的事件监听
      wx.onBluetoothDeviceFound(function (res) {
        console.log(res);
        if (res.devices[0]) {
          var flag = true;
          for (var i = 0; i < res.devices.length; i++) {
            if (findDevice(res.devices[i].name)) {
              deviceId = res.devices[i].deviceId;
              conDevice(that, deviceId); // 连接符合条件的设备
              stopSearch(that); // 关闭蓝牙搜索
              flag = false;
              break;
            }
          }
          if (flag) {
            console.log("蓝牙", "没有匹配的蓝牙设备");
          }
        }else{
          console.log("蓝牙", "未搜索到蓝牙设备");
        }
      })
    },
    fail: function (res) {
      wx.hideLoading();
      wx.showToast({
        title: '蓝牙未能开启搜索',
        icon: 'success',
        during: 2000,
      })
      stopBluetooth(that);
    }
  })
}

// 连接蓝牙设备
function conDevice(that, deviceId) {
  console.log("蓝牙", "开始连接蓝牙设备");
  wx.createBLEConnection({
    deviceId: deviceId,
    success: function(res) {
      console.log(res)
      console.log("蓝牙", "蓝牙设备连接成功,设备ID是：" + deviceId);
      wx.hideLoading();
      wx.showToast({
        title: '蓝牙设备连接成功',
        icon: 'success',
        during: 2000, 
      })
      
      getServices(that, deviceId);
      // connedDevice(that, deviceId);
    },
    fail: function(res){
      console.log(res);
      console.log("蓝牙", "蓝牙设备连接失败");
      wx.hideLoading();
      wx.showModal({
        title: '错误',
        content: '蓝牙设备连接失败',
        showCancel: false,
      });
      stopBluetooth(that);
    }
  })
}

// 停止搜索蓝牙设备
function stopSearch(that) {
  wx.stopBluetoothDevicesDiscovery({
    success: function(res) {
      console.log("蓝牙", "已搜索到设备，停止蓝牙设备的搜索");
    },
  })
}

// 停止蓝牙的生命周期
function stopBluetooth(that){
  wx.closeBluetoothAdapter({
    success: function(res) {
      wx.showToast({
        title: '蓝牙已关闭',
        icon: 'success',
        during: 2000,
      })
    },
  })
}

// 已连接设备
function connedDevice(that, deviceId){
  wx.getConnectedBluetoothDevices({
    services: [deviceId],
    success: function(res) {
      console.log(res);
    },
  })
}

// 获取蓝牙服务里列表
function getServices(that, deviceId){
  wx.getBLEDeviceServices({
    deviceId: deviceId,
    success: function(res) {
      console.log("蓝牙服务信息", res);
      var len = res.services.length;
      if (len > 0){
        for(var i = 0; i < len; i++){
          uuid = res.services[i].uuid;
          getCharacteristics(that, deviceId, uuid);
        }
      }
    },
  })
}

// 获取蓝牙服务的特征值
function getCharacteristics(that, deviceId, uuid){
  wx.getBLEDeviceCharacteristics({
    deviceId: deviceId,
    serviceId: uuid,
    success: function(res) {
      console.log("主服务特征值", res)
      var len = res.characteristics.length;
      for (var i = 0; i < len; i++){
        if (res.characteristics[i].properties.write) {
          chuuid = res.characteristics[i].uuid;
          chValueChange(that, deviceId, uuid, chuuid);
          setTimeout(function(){}, 1100)
          write(that, deviceId, uuid, chuuid, "test");
          break;
        }
      }
    },
  })
}

function write(that, deviceId, uuid, chuuid, value){
  let buffer = str2ab(value)
  console.log("发送的值是: ", ab2str(buffer));

  wx.writeBLECharacteristicValue({
    deviceId: deviceId,
    serviceId: uuid,
    characteristicId: chuuid,
    value: buffer,
    success: function(res) {
      wx.showToast({
        title: '测试操作成功',
        duration: 1000,
      });
      console.log('测试发送成功', res);
    },
    fail: function(res){
      wx.showToast({
        title: '测试操作失败',
        icon: "fail",
        duration: 1000,
      });
      console.log("测试发送失败", res)
    }
  })
}

function read(that, deviceId, uuid, chuuid){
  wx.readBLECharacteristicValue({
    deviceId: deviceId,
    serviceId: uuid,
    characteristicId: chuuid,
    success: function(res) {},
  })
}

// 监听蓝牙设备的特征值变化
function chValueChange(that, deviceId, uuid, chuuid) {
  wx.notifyBLECharacteristicValueChange({
    state: true,
    deviceId: deviceId,
    serviceId: uuid,
    characteristicId: chuuid,
    complete(res) {
      wx.onBLECharacteristicValueChange(function (res) {
        var val = ab2strU16(res.value)
        console.log("特征值变化", val);
        request(that, val);
      });
    },
    fail(res) {
      console.log(res);
    }
  })
}

function findDevice(deviceName){
  // if(!deviceList){
  //   wx.request({
  //     url: '',
  //     method: 'POST',
  //     success: function(res){
  //       if(res.data.status == 1 && res.data.data != ''){
  //         deviceList = JSON.parse(res.data.data);
  //       }
  //     }
  //   })
  // }

  if(deviceList){
    var len = deviceList.length;
    for(var i = 0; i < len; i++){
      if (deviceName == deviceList[i]){
        return true;
      }
    }
  }
  return false;
}


// ArrayBuffer转为字符串，参数为ArrayBuffer对象, 字符串编码为一个字节
const ab2str = function (buf) {
  return String.fromCharCode.apply(null, new Uint8Array(buf));
}

// ArrayBuffer转为字符串，参数为ArrayBuffer对象字符串编码为js默认编码
const ab2strU16 = function (buf) {
  return String.fromCharCode.apply(null, new Uint16Array(buf));
}
// 字符串转为ArrayBuffer对象，参数为字符串
const str2ab = function(str) {
  var buf = new ArrayBuffer(str.length * 2); // 每个字符占用2个字节
  var bufView = new Uint16Array(buf);
  for (var i = 0, strLen = str.length; i < strLen; i++) {
    bufView[i] = str.charCodeAt(i);
  }
  return buf;
}


function dictData(value){
  const dict = {
    "256":"1",
    "257":"2",
    "258":"3",
    "259":"4",
    "260":"5",
    "261":"6",
    "262":"7",
    "263":"8",
    "264":"9",
    "265":"10",
    "266":"11",
    "267":"12",
    "268":"13",
    "269":"14",
    "270":"15",
    "271":"16",
    "272":"17",
    "273":"18",
    "274":"19",
    "275":"20",
    "276":"21",
    "277":"22",
    "278":"23",
    "279":"24",
    "280":"25",
    "281":"26",
    "282":"27",
    "283":"28",
    "284":"29",
    "285":"30",
    "286":"31",
    "287":"32",
    "288":"33",
    "289":"34",
    "290":"35",
    "291":"36",
    "292":"37",
    "293":"38",
    "294":"39",
    "295":"40",
    "296":"41",
    "297":"42",
    "298":"43",
    "299":"44",
    "300":"45",
    "301":"46",
    "302":"47",
    "303":"48",
    "304":"49",
    "305":"50",
    "306":"51",
    "307":"52",
    "308":"53",
    "309":"54",
    "310":"55",
    "311":"56",
    "312":"57",
    "313":"58",
    "314":"59",
    "315":"60",
    "316":"61",
    "317":"62",
    "318":"63",
    "319":"64",
    "320":"65",
    "321":"66",
    "322":"67",
    "323":"68",
    "324":"69",
    "325":"70",
    "326":"71",
    "327":"72",
    "328":"73",
    "329":"74",
    "330":"75",
    "331":"76",
    "332":"77",
    "333":"78",
    "334":"79",
    "335":"80",
    "336":"81",
    "337":"82",
    "338":"83",
    "339":"84",
    "340":"85",
    "341":"86",
    "342":"87",
    "343":"88",
    "344":"89",
    "345":"90",
    "346":"91",
    "347":"92",
    "348":"93",
    "349":"94",
    "350":"95",
    "351":"96",
    "352":"97",
    "353":"98",
    "354":"99",
    "355":"100",
    "356":"101",
    "357":"102",
    "358":"103",
    "359":"104",
    "360":"105",
    "361":"106",
    "362":"107",
    "363":"108",
    "512":"109",
    "513":"110",
    "514":"111",
    "515":"112",
    "516":"113",
    "517":"114",
    "518":"115",
    "519":"116",
    "520":"117",
    "521":"118",
    "522":"119",
    "523":"120",
    "524":"121",
    "525":"122",
    "526":"123",
    "527":"124",
    "528":"125",
    "529":"126",
    "530":"127",
    "531":"128",
    "532":"129",
    "533":"130",
    "534":"131",
    "535":"132",
    "536":"133",
    "537":"134",
    "538":"135",
    "539":"136",
    "540":"137",
    "541":"138",
    "542":"139",
    "543":"140",
    "544":"141",
    "545":"142",
    "546":"143",
    "547":"144",
    "548":"145",
    "549":"146",
    "550":"147",
    "551":"148",
    "552":"149",
    "553":"150",
    "554":"151",
    "555":"152",
    "556":"153",
    "557":"154",
    "558":"155",
    "559":"156",
    "560":"157",
    "561":"158",
    "562":"159",
    "563":"160",
    "564":"161",
    "565":"162",
    "566":"163",
    "567":"164",
    "568":"165",
    "569":"166",
    "570":"167",
    "571":"168",
    "572":"169",
    "573":"170",
    "574":"171",
    "575":"172",
    "576":"173",
    "577":"174",
    "578":"175",
    "579":"176",
    "580":"177",
    "581":"178",
    "582":"179",
    "583":"180",
    "584":"181",
    "585":"182",
    "586":"183",
    "587":"184",
    "588":"185",
    "589":"186",
    "590":"187",
    "591":"188",
    "592":"189",
    "593":"190",
    "594":"191",
    "595":"192",
    "596":"193",
    "597":"194",
    "598":"195",
    "599":"196",
    "600":"197",
    "601":"198",
    "602":"199",
    "603":"200",
    "604":"201",
    "605":"202",
    "606":"203",
    "607":"204",
    "608":"205",
    "609":"206",
    "610":"207",
    "611":"208",
    "612":"209",
    "613":"210",
    "614":"211",
    "615":"212",
    "616":"213",
    "617":"214",
    "618":"215",
    "619":"216",
    "768":"217",
    "769":"218",
    "1024":"219",
    "1025":"220",
    "1026":"221",
    "1280":"222",
    "1281":"223",
    "1282":"224",
    "1283":"225",
    "1284":"226",
    "1285":"227",
    "1286":"228",
    "1287":"229",
    "1288":"230",
    "1289":"231",
    "1290":"232",
    "1291":"233",
    "1292":"234",
    "1293":"235",
    "1294":"236",
    "1295":"237",
    "1296":"238",
    "1297":"239",
    "1298":"240",
    "1299":"241",
    "1300":"242",
    "1301":"243",
    "1302":"244",
    "1303":"245",
    "1304":"246",
    "1305":"247",
    "1306":"248",
    "1307":"249",
    "1308":"250",
    "1309":"251",
    "1310":"252",
    "1311":"253",
    "65535":"254"
  }
  return dict[value]
}


// 对外接口
function writeData(that, value){
  console.log('old.value', value)
  var value = dictData(value);
  console.log('new.value', value)
  var buffer = str2ab(value)
  console.log("发送的值是: ", ab2str(buffer));

  console.log('deviceId: ', deviceId.toString());
  console.log('serviceId: ', uuid.toString());
  console.log('characteristicId: ', chuuid.toString());

  // wx.showModal({
  //   title: '提示',
  //   content: 'deviceId: ' + deviceId.toString() + 'serviceId: ' + uuid.toString() + 'characteristicId: ' + chuuid.toString(),
  //   success(res) {
  //     if (res.confirm) {
  //       console.log('用户点击确定')
  //     } else if (res.cancel) {
  //       console.log('用户点击取消')
  //     }
  //   }
  // })

  wx.writeBLECharacteristicValue({
    deviceId: deviceId,
    serviceId: uuid,
    characteristicId: chuuid,
    value: buffer,
    success: function (res) {
      wx.showToast({
        title: '操作成功',
        duration: 1000,
      });
      console.log('发送成功', res);
    },
    fail: function (res) {
      wx.showToast({
        title: '操作失败',
        icon: "fail",
        duration: 1000,
      });
      console.log("发送失败", res)
    }
  })
}


// 受到特征值的时候发送http请求
function request(that, val){
  var flag = 0;
  if(val == "A2"){
    flag = 1;
  }else if(val == "A3"){
    flag = 2;
  }

  if(flag > 0){
    wx.getStorage({
      key: 'session',
      success: function(key) {
        wx.request({
          url: app.globalData.url + "/use_log_action",
          data: {
            flag: flag,
            key: key.data
          },
          success: function (res) {
            if (res.data.code != 0) {
              wx.showModal({
                title: '错误',
                content: res.data.msg,
                showCancel: false,
              });
            } else {
              wx.showToast({
                title: res.data.msg,
                duration: 2000
              });
            }
          }
        })
      },
    })
  }
}

module.exports.bluetoothInit = bluetoothInit; 
module.exports.stopBluetooth = stopBluetooth;
module.exports.writeData = writeData; 
module.exports.checkStatus = checkStatus;