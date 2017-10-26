// pages/usercenter/ddxq/ddxq.js
import { $wuxBarcode } from '../../../tool/tool';
import { $wuxToast } from '../../../tool/tool';
import { $wuxDialog } from '../../../tool/tool';
var path = require('../../../config/path.js');
var barcode = require('../../../utils/barcode');
var app = getApp();
Page({
  data: {
    init: {},
    order: ""
  },
  onLoad: function (options) {
    var _self = this;
    var url = path.apiUrl.queryUserOrderDetail;
    var data = { orderNo: options.orderno };
    app.req.req(url, data, null, function (data) {
      _self.setData({
        init: data.data,
        order: options.orderno
      });
      barcode.code128(wx.createCanvasContext("barcode"), data.data.orderNo, 200, 80);
    })
  },
  pay:function(){
    var pay = require("../../../script/pay.js");
    var _self = this;
    if (_self.data.init.storeId == app.globalData.store.id){
      var data = {
        orderNo: _self.data.init.orderNo,
        payAmount: _self.data.init.needPayAmount,
        storeId: _self.data.init.storeId
      };
      pay.pay.getPrepayInfo(data, function (res) {
        let num = _self.data.init;
        num.status = 0;
        _self.setData({
          init: num
        })
        $wuxToast.show({
          type: 'text',
          timer: 1500,
          color: '#fff',
          text: '支付成功！',
          success: () => console.log()

        })
      });
    }else{
      $wuxToast.show({
        type: 'text',
        timer: 1500,
        color: '#fff',
        text: '订单门店与当前门店不符,请检查门店！',
        success: () => console.log()
      })
    }
  },
  // 退款页面跳转
  tuikuan: function (e) {
    var self = this;
    var num = e.target.dataset.order;
    var jiage = e.target.dataset.price;
    if (self.data.init.storeId == app.user.getStoreId()) {
      var tzdata = { "orderno": num, "price": jiage, "StoreId": app.user.getStoreId(), "commnum": self.data.init.productCount, };
      let str = JSON.stringify(tzdata);
      wx.navigateTo({ url: '../refund/enterrefund/refund?orderno=' + str })
    } else {
      $wuxToast.show({
        type: 'text',
        timer: 1500,
        color: '#fff',
        text: '您当前所在门店，与订单门店不同。请到对应门店进行退款！',
        success: () => console.log()
      })
    }

  },
  shanchu: function (e) {
    var _self = this;
    var order = e.currentTarget.dataset.jsdh;
    // console.log(e.currentTarget.dataset.jsdh);
    $wuxDialog.confirm({
      title: '取消订单',
      content: '你确定要取消这个订单吗',
      onConfirm(e) {
        var url = path.apiUrl.deleteUserOrder;
        var data = { orderNo: order,userNo: app.user.getuserNo()};
        app.req.req(url,data,null,function(data){
          console.log(data);
          $wuxToast.show({
            type: 'text',
            timer: 1500,
            color: '#fff',
            text: '订单取消成功！',
            success: () => console.log()
          });
          wx.navigateBack({
            url: '../index'
          })
        })
      },
      onCancel(e) {
        return false;
      },
    })
  },
  showToastText() {
    $wuxToast.show({
      type: 'text',
      timer: 1500,
      color: '#fff',
      text: '请将页面下方条形码出示给超市工作人员！',
      success: () => console.log('请将页面下方条形码出示给超市工作人员！')
    })
  },
  onShow:function (){
    var _self = this;
    var url = path.apiUrl.queryUserOrderDetail;
    var data = { orderNo: _self.data.order };
    app.req.req(url, data, null, function (data) {
      _self.setData({
        init: data.data
      });
      barcode.code128(wx.createCanvasContext("barcode"), data.data.orderNo, 200, 80);
    })
  }
})