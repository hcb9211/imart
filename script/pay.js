import { $wuxToast } from '../tool/tool';
var hex_sha1 = require('../utils/sha.js')

var app = getApp();
var pay = {
	getPrepayInfo:function(order,cb,failcb){
		var url = app.apiUrl.getWeixinPrepayInfo;
	    var _self = this;
	    var data = {
	      openId:app.user.getOpenId(),
	      orderNo:order.orderNo,
	      payAmount:order.payAmount.toFixed(2),
	      storeId:order.storeId,
	      title:'001'
	    };
	    //加密
	    var signarray = [];
	    var sign = "";
	    signarray[0] = app.signkey;
	    for(var ind in data){
	        signarray.push(data[ind]);
	    }
	    signarray = signarray.sort();
	    for(var ind in signarray){
	        sign += signarray[ind].toString();
	    }
	    console.log(sign);
	    console.log("sign")
	    data.sign = hex_sha1.hex_sha1(sign);

	    app.req.req(url,data,null,function(data){
	      if("0" == data.retCode){
	        order.prepayId = data.data.prepayId;
	        _self.pay(order,cb);
	      }else{
	      	typeof failcb == "function" && failcb(order)
	         $wuxToast.show({
	            type: 'text',
	            timer: 1000,
	            color: '#fff',
	            text: data.retMsg
	          })
	      }
	    })
	},
	 //支付
	  pay:function(order,cb,failcb) {
	    var _self = this;
	    var MD5 = require('../utils/md5');
	    var appId = app.pay.appId;
	    var key = app.pay.key;
	    var timestamp = Date.parse(new Date()).toString(); 
	    var nonceStr = "123";
	    var signType= "MD5";
	    var prepay_id = "prepay_id="+order.prepayId;
	    var paySignStr = "appId="+appId+"&nonceStr="+nonceStr+"&package="+prepay_id+
	    "&signType="+signType+"&timeStamp="+timestamp+"&key="+key;
	    console.dir(MD5);
	    var paySign = MD5.hexMD5(paySignStr);

	    wx.requestPayment({
	      'timeStamp': timestamp,
	      'nonceStr': nonceStr,
	      'package': prepay_id,
	      'signType': 'MD5',
	      'paySign': paySign,
	      'success':function(res){
	        typeof cb == "function" && cb(order)
	        console.log("成功");
	        console.dir(res);
	      },
	      'fail':function(res){
	      	if("requestPayment:fail" == res.errMsg){
	      		$wuxToast.show({
	            type: 'text',
	            timer: 1000,
	            color: '#fff',
	            text: "支付失败"
	          })
	      	}
	        console.log("支付失败");
	        console.log(res);
	        
	      	typeof failcb == "function" && failcb(order)
	       
	      },
	      'complete':function(res){
	         console.log("都会执行");
	        console.dir(res);
	      }
	    })
	  }
}

module.exports = {
  pay : pay
}