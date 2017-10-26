// pages/usercenter/refund/exitrefund/exitrefund.js
import { $wuxBarcode } from '../../../../tool/tool';
var barcode = require('../../../../utils/barcode');
Page({
  data: {
    xinxi:{}
  },
  /*** 生命周期函数--监听页面加载*/
  onLoad: function (options) {
    let _self = this;
    let item = JSON.parse(options.tkxx);
    _self.setData({
      xinxi:item
    })
    barcode.code128(wx.createCanvasContext("barcode"), item.chargeBackOrderNo, 200, 80);  
    // console.log(JSON.stringify(item));
    // console.log(JSON.stringify(JSON.parse(options.tkxx)));
  },
})