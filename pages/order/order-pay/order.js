var app = getApp();

import { $wuxToast } from '../../../tool/tool'

var hex_sha1 = require('../../../utils/sha.js')
var orderpay = require('../../../script/pay.js')


Page({
  /*** 页面的初始数据*/
  data: {
    
    goods:{

    },
    bindphone:{
        mobile:"",
        smsCode:"",
        countdown:0,
        countdownstr:"获取验证码",
        recommendMobile:"",
        issend:true,
        visible:false
    },
    balance:{
      useBalance:false, //是否使用优惠券
      balancemoney:0, //用于支付的余额
      payprice:0 //需要支付金额
    },
    coupon:{
      value:0
    },
    hidden: false
  },
  tijiao:function(e){
    console.log(JSON.stringify(e));
    console.log(JSON.stringify(e.detail))
    
  },
  bindPhoneInput: function (e) {
    var _self = this;
    _self.data.bindphone.mobile = e.detail.value;
    _self.setData({
      bindphone: _self.data.bindphone
    })
  },
  //
  bindrecommendMobileInput:function(e){
    var _self = this;
    _self.data.bindphone.recommendMobile = e.detail.value;
    this.setData({
      bindphone: _self.data.bindphone
    })
  },
  /**验证码获取*/ 
  bindCodeInput: function(e){
    var _self = this;
    _self.data.bindphone.smsCode = e.detail.value;
    this.setData({
      bindphone: _self.data.bindphone
    })
  },
  //发送验证码
  sendcode:function(e){
    // expression
    var _self = this;
    var mobile = _self.data.bindphone.mobile;
    var issend = _self.data.bindphone.issend;
    if(!issend){
      return false;
    }
    _self.data.bindphone.issend = false;
    _self.setData({
      bindphone: _self.data.bindphone
    })

    var myreg = /^(((13[0-9]{1})|(15[0-9]{1})|(17[0-9]{1})|(18[0-9]{1}))+\d{8})$/;
    if(!mobile || !myreg.test(mobile)){
        app.toast.show("请输入有效的手机号码")
        _self.data.bindphone.issend = true;
        _self.setData({
          bindphone: _self.data.bindphone
        })
        return false;
    }
    var url = app.apiUrl.sendSmsCode;
    var data = {
      mobile:mobile,
      verificationCodeType:"2" //0-注册登录修改密码 1-提现 2-绑定手机号
    }
    app.req.req(url,data,null,function(res){
      if("0" == res.retCode){
          var voice_interval = 60;
          var int1 = setInterval(function(){
              var i = voice_interval--;
              _self.data.bindphone.countdownstr ="已发送("+i+")";
              _self.setData({
                bindphone: _self.data.bindphone
              });

              if(0 == i){
                  clearInterval(int1);
                  _self.data.bindphone.countdownstr ="获取验证码";
                  _self.data.bindphone.issend = true;
                  _self.setData({
                    bindphone: _self.data.bindphone
                  });
              }
          },1000);
      }else{
        _self.data.bindphone.issend = true;
        _self.setData({
          bindphone: _self.data.bindphone
        });
          app.toast.show(res.retMsg)
      }
    },function(){
      _self.data.bindphone.issend = true;
      _self.setData({
        bindphone: _self.data.bindphone
      })
       app.toast.show("发送验证码失败")
       return false;
    })
  },
  //绑定手机号
  bindMobileNumber:function(e){
    var _self = this;
    var mobile = _self.data.bindphone.mobile;
    var smsCode = _self.data.bindphone.smsCode;
    var recommendMobile = _self.data.bindphone.recommendMobile;
    var url = app.apiUrl.bindMobileNumber;
    var data = {
      mobile:mobile,
      smsCode:smsCode,
      recommendMobile:recommendMobile,
      userNo:app.user.getuserNo(),
      verificationCodeType:"2" //0-注册登录修改密码 1-提现 2-绑定手机号
    }
    if ((recommendMobile == "") || (app.checknumalphabet(recommendMobile))){
      app.req.req(url, data, null, function (res) {
        if (res) {
          if ("0" == res.retCode) {
            app.toast.show("绑定成功")
            app.user.setmoblie(mobile)
            _self.data.bindphone.visible = false;
            _self.setData({
              bindphone: _self.data.bindphone
            })
          } else {
            app.toast.show(res.retMsg)
          }
        } else {
          app.toast.show("绑定失败")
        }
      })
    }else{
      app.toast.show("推荐码或推荐手机号不合法，请检查后再提交！")
    }
  },
  //取消
  back:function(){
    var _self = this;
    _self.data.bindphone.visible = false;
    _self.setData({
      bindphone: _self.data.bindphone
    })
  },
  updatebalancemoney:function(){
    var _self = this;
    // var balance = _self.data.order.balance; //账户余额
    var couponvalue = _self.data.coupon.value;
    var totalPromPrice =  _self.data.order.totalPromPrice;
    //减去优惠券的价格
    totalPromPrice =(totalPromPrice - couponvalue).toFixed(2);
    //余额
    var balancemoney = _self.data.balance.balancemoney;
    var payprice = 0;
    if(balancemoney > totalPromPrice){
      balancemoney = totalPromPrice;
    }
    payprice = (totalPromPrice - balancemoney).toFixed(2);
    _self.data.balance.balancemoney = balancemoney;
    _self.data.balance.payprice = payprice;

    _self.setData({
      balance: _self.data.balance
    })

  },
  restorebalancemoney:function(){
    // _self.data.balance.payprice =  _self.data.order.totalPromPrice;
    // _self.data.balance.balancemoney =  _self.data.order.balancemoney;


  },
  //使用余额
  useBalancechange:function(){
    var _self = this;
    if(_self.data.balance.useBalance == false){
      _self.data.balance.useBalance = true;
      _self.data.balance.balancemoney = _self.data.order.balance;
      _self.updatebalancemoney();
    }else{
      _self.data.balance.balancemoney = 0;
      _self.data.balance.useBalance = false;
      _self.updatebalancemoney();
    }
    
    _self.setData({
      balance: _self.data.balance
    })
  },
  selectcouponpage:function(){
    var couponList = this.data.order.couponList;
     var couponstr = JSON.stringify(couponList);
      wx.navigateTo({
        url: '../CashCoupon/CashCoupon?couponlist='+couponstr,
      })
  },
  ordersubmit:function(e){
    var _self = this;
    //判断是否绑定手机号
    if(!app.user.getMobile()){
      _self.data.bindphone.visible = true;
      _self.setData({
        bindphone: _self.data.bindphone
      })
    return false;
    }
    
    //判断是否已经提交过订单
    if(_self.data.payorderinfo){
      console.log("已经提交过订单");
      orderpay.pay.getPrepayInfo(_self.data.payorderinfo,function(obj){
        wx.redirectTo({
          url: '../accomplish-pay/acc?orderNo='+obj.orderNo,
        })
      },function(obj){
        console.log(obj);
      });
      return false;
    }
    var pay = _self.data.order;
    var goods = _self.data.goods;
    var order = {
      userNo: app.user.getuserNo(),
      rental: pay.totalPrice, //优惠前总额
      amount:  pay.totalPromPrice, //优惠后总金额
      promoteAmount: pay.coupon, //优惠金额
      storeId: pay.storeId, //设备ID
    };
    var payInfo = {
      useBalance:"0",  //是否使用余额 0不适用 1使用
      payAmount: pay.totalPromPrice, //需要支付金额
      balance: pay.balance, //余额
      useCouponCard: "0", //是否使用卡券 0不使用 1使用
      couponCardList:[],//优惠券
    }
    //判断是否使用了余额
    if(_self.data.balance.useBalance){
        payInfo.useBalance = "1"; //设置为使用
    }
    //判断是否使用卡券
    if(_self.data.coupon.value > 0){
        payInfo.useCouponCard = "1";
        var couponCardList = [];
        couponCardList.push(_self.data.coupon.couponId);
        payInfo.couponCardList = couponCardList;
    }
    order.payInfo = payInfo;

    var commodityList = [];
    var tempgoods ={}; //临时商品信息
    for (var i =0; i< goods.goodsList.length; i++) {
      var barCode = goods.goodsList[i].barCode;
      tempgoods[barCode] = goods.goodsList[i];
    }
    //订单下的商品列表
    for (var i =0; i< pay.goodslist.length; i++) {
        var good = {
          commodityCode: pay.goodslist[i].goodsCode, //商品编号(条形码)
          commodityName: tempgoods[pay.goodslist[i].barCode].commodityName, //商品名称
          count: pay.goodslist[i].count, //数量
          price: pay.goodslist[i].price, //原价(单价)
          promotePrice: pay.goodslist[i].promotePrice, //优惠价(单价)
          amount: pay.goodslist[i].amount,//优惠前总金额
          promoteAmount: pay.goodslist[i].promoteAmount, //优惠总金额
          promType: pay.goodslist[i].promType, //优惠类型
          promCode: pay.goodslist[i].promCode //优惠编码
        }
        commodityList.push(good);
    }
    order.commodityList = commodityList;
    
    //sign加密
    // var signobj = {
    //   amount:order.amount,
    //   balance:order.payInfo.balance,
    //   payAmount:order.payInfo.payAmount,
    //   promoteAmount:order.promoteAmount,
    //   rental:order.rental,
    //   storeId:order.storeId,
    //   useBalance:order.payInfo.useBalance,
    //   useCouponCard:order.payInfo.useCouponCard,
    //   userNo:order.userNo


    // }
    var signarray = [];
    signarray.push(app.signkey);
    signarray.push(order.amount.toFixed(2));
    signarray.push(order.payInfo.balance.toFixed(2));
    signarray.push(order.payInfo.payAmount.toFixed(2));
    signarray.push(order.promoteAmount.toFixed(2));
    signarray.push(order.rental.toFixed(2));
    signarray.push(order.storeId);
    signarray.push(order.payInfo.useBalance);
    signarray.push(order.payInfo.useCouponCard);
    signarray.push(order.userNo);
    signarray = signarray.sort();
    // signobj = _self.objKeySort(signobj);
    var sign = "";
    for(var ind in signarray){
        sign += signarray[ind].toString();
    }
    console.log(sign);
    order.sign = hex_sha1.hex_sha1(sign);
    console.log(order);

    var url = app.apiUrl.submitOrder;
    var data = {
      orderReq:JSON.stringify(order)
    }
    console.log(data);
    app.req.req(url,data,null,function(data){
      console.log("提交订单返回");
      console.log(data);
      if("0" == data.retCode){
        var payStatus = data.data.payStatus;
        var orderNo = data.data.orderNo;
        var needPayAmount = data.data.needPayAmount;
        var payobj = {
          orderNo:orderNo,
          payAmount:needPayAmount,
          storeId:order.storeId
        }
        if('0' == payStatus){
            _self.setData({
              payorderinfo:payobj
            });
            // _self.getPrepayInfo(payobj);
            console.log(pay);
            orderpay.pay.getPrepayInfo(payobj,function(obj){
              wx.redirectTo({
                url: '../accomplish-pay/acc?orderNo='+obj.orderNo,
              })
            },function(obj){

            });
        }else{
         wx.redirectTo({
            url: '../accomplish-pay/acc?orderNo='+payobj.orderNo,
          })
        }
      }else{
        $wuxToast.show({
          type: 'text',
          timer: 1000,
          color: '#fff',
          text: data.retMsg
        })
      }
    });

    // var sigin = app.signkey + pay.oder.promoteAmount.toString()+pay.oder.rental.toString()+
    //                         pay.oder.rental.toString()+

  },
  /*** 生命周期函数--监听页面加载*/
  onLoad: function (options) { 
    var goods = JSON.parse(options.orderinfo);
    var _self = this;
    var url = app.apiUrl.queryGoodsPriceForOrderByStoreId;
    var data = {
      userNo: app.user.getuserNo(),
      storeId:app.user.getStoreId()
    };
    
    app.req.req(url,data,null,function(data){
        if("0" == data.retCode){
          _self.data.balance.payprice = data.data.totalPromPrice;
           _self.setData({
            order: data.data,
            goods: goods,
            balance:_self.data.balance
          });
        }
    });
  },
  /*** 生命周期函数--监听页面初次渲染完成*/
  onReady: function () { },
  /** * 生命周期函数--监听页面显示*/
  onShow: function () { },
  /*** 生命周期函数--监听页面隐藏*/
  onHide: function () { },
  /*** 生命周期函数--监听页面卸载*/
  onUnload: function () { },
  /*** 页面相关事件处理函数--监听用户下拉动作*/
  onPullDownRefresh: function () { },
  /*** 页面上拉触底事件的处理函数*/
  onReachBottom: function () { },
  /*** 用户点击右上角分享*/
  onShareAppMessage: function () { }
})