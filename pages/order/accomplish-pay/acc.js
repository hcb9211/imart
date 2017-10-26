var barcode = require('../../../utils/barcode');
var app = getApp();

Page({
	data:{
		order:{}
	},
	//订单详情
	orderinfo:function(){
		wx:wx.navigateTo({
      url: '../../usercenter/Orderdetail/index?orderno='+this.data.order.orderNo
    })
	},
	onLoad:function(options){
		console.log(options);
		var _self = this;
		var orderNo = options.orderNo;
	    var url = app.apiUrl.queryUserOrderDetail;
	    var data = {
	      orderNo:orderNo
	    };

	    app.req.req(url,data,null,function(res){
	    	if("0" == res.retCode){
    			barcode.code128(wx.createCanvasContext("barcode"), orderNo, 200, 80);  
    			res.data.orderammount = (res.data.rental - res.data.couponPayAmount - res.data.redPayAmount - res.data.promoteAmount).toFixed(2)
	    		_self.setData({
		          order:res.data
		      });
		      console.dir( _self.goods);
	    	}
	      
	    });
	},
	onReady:function(){
		
	},
	onShow:function(){
		
	},
	onHide:function(){
		
	},
	onUnload:function(){
		
	},
	onPullDownRefresh:function(){
		
	},
	onReachBottom:function(){
		
	}
})		