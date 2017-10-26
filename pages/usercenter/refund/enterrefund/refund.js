// pages/usercenter/refund/refund.js
import { $wuxToast } from '../../../../tool/tool';
var path = require('../../../../config/path.js');
var sha1 = require('../../../../utils/sha.js');
var app = getApp();
var page = Page({
  data: {
    order:"",
    price:"",
    tuikuan: {},
    commnumber:0,
    tkyy:{"tkly":"","tkjy":""}
  },
  // 开始加载
  onLoad: function (options) {
    var self = this;
    let item = JSON.parse(options.orderno);
    self.setData({
      order: item.orderno,
      price: item.price,
      commnumber: item.commnum
    })
    console.log(JSON.stringify(item));
  },
  /*页面跳转*/
  tiaozhuan: function(){
    let _self = this;
    let datasign = "08abbeb0192dc41232222bc0dfdb2a52494f4d24" + app.user.getuserNo() + _self.data.order;
    let tuikuanyuanyin = _self.data.tkyy.tkly + "|" + _self.data.tkyy.tkjy;
    let url = path.apiUrl.chargeBack;
    let data = {
      orderNo: _self.data.order,
      remarks: tuikuanyuanyin,
      sign: sha1.hex_sha1(datasign),
      userNo: app.user.getuserNo()
    };
    app.req.req(url,data,null,function(data){
      // console.log(JSON.stringify(data))
      if (data.retCode == "0") {
        var tkdata = data.data;
        data.data.price = _self.data.price;
        data.data.commnumber = _self.data.commnumber;
        wx.redirectTo({ url: '../exitrefund/exitrefund?tkxx=' + JSON.stringify(tkdata) })
      } else {
        $wuxToast.show({
          type: 'text',
          timer: 1500,
          color: '#fff',
          text: data.retMsg,
          success: () => console.log('文本提示')
        })
      }
    })
    // console.log(tuikuanyuanyin);
    // wx:wx.request({
    //   url: path.apiUrl.chargeBack,
    //   data: {
    //     orderNo: _self.data.order,
    //     remarks: tuikuanyuanyin,
    //     sign: sha1.hex_sha1(datasign),
    //     userNo: app.user.getuserNo()
    //   },
    //   header: { 'Content-Type': 'application/x-www-form-urlencoded' },
    //   method: "POST",
    //   dataType: "json",
    //   success: function(res) {
    //     console.log(JSON.stringify(res))
    //     if (res.data.retCode == "0"){
    //       var tkdata = res.data.data;
    //       res.data.data.price = _self.data.price;
    //       res.data.data.commnumber = _self.data.commnumber;
    //       wx.navigateTo({ url: '../exitrefund/exitrefund?tkxx=' + JSON.stringify(tkdata) })
    //     }else{
    //       $wuxToast.show({
    //         type: 'text',
    //         timer: 1500,
    //         color: '#fff',
    //         text: res.data.retMsg,
    //         success: () => console.log('文本提示')
    //       })
    //     }
    //   },
    //   fail: function(res) {},
    //   complete: function(res) {},
    // })
  },
  /**退款理由选择 */
  radioChange: function (e) {
    let _self = this;
    let val = e.currentTarget.dataset.val;
    if (e.currentTarget.dataset.val == "ly"){
      let yuanyin = _self.data.tkyy;
      yuanyin.tkly = e.detail.value;
      _self.setData({
        tkyy:yuanyin
      })
    }else{
      let jinayi = _self.data.tkyy;
      jinayi.tkjy = e.detail.value;
      _self.setData({
        tkyy:jinayi
      })
    }
  },
})