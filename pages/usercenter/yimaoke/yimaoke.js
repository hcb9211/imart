import { $wuxToast } from '../../../tool/tool';
var path = require('../../../config/path.js');
var app = getApp();
Page({
  data:{
    num: ''
  },
  init:function(e){
    this.setData({
      num: e.detail.value
    })
    console.log(JSON.stringify(this.data.num))
  },
  updata:function(){
    var _self = this;
    var url = path.apiUrl.bindRecommendMobile;
    var data = {
      mobile:"",
      // recommendMobile: _self.data.inpval,
      recommendMobile: "23hy",
      // userNo: app.user.getuserNo()
      userNo: "1000000000000002165"
    };
    console.log(JSON.stringify(url))
    console.log(JSON.stringify(data))
    app.req.req(url,data,null,function(data){
      console.log(JSON.stringify(data));
      if (data.data.retCode == 0){
        $wuxToast.show({
          type: 'text',
          timer: 1500,
          color: '#fff',
          text: '订单取消成功！',
          success: () => console.log()
        });
      }else{
        $wuxToast.show({
          type: 'text',
          timer: 1500,
          color: '#fff',
          text: '请稍后再试！',
          success: () => console.log()
        });
      }
    })
  }
})