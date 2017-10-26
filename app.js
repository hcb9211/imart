//app.js
var request = require('/script/request.js');
var path = require('/config/path.js');
import { $wuxLoading } from '/tool/tool'
import { $wuxToast } from '/tool/tool'


App({
  onLaunch: function() {
    //调用API从本地缓存中获取数据
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs);
    
  },

  getUserInfo: function(cb) {
    var _this = this
     console.dir( this.globalData.userInfo);
    if (this.globalData.userInfo) {
      typeof cb == "function" && cb(this.globalData.userInfo)
    } else {
      //调用登录接口
      wx.login({
        success:function(r){
          // console.log(r.code);
          if(r.code){

            wx.getUserInfo({
              success: function(res) {
                var data = {
                  code:r.code,
                  encryptedData:res.encryptedData,
                  iv:res.iv
                }
               console.dir( data);
                _this.req.req(_this.apiUrl.miniProgramLoginForMobile,data,null,function(res){
                  
                  _this.globalData.userInfo = res.data;
                  console.dir( _this.globalData.userInfo);
                  typeof cb == "function" && cb(_this.globalData.userInfo)
                });
                // var d=that.globalData;//这里存储了appid、secret、token串    
                //   // var l='https://api.weixin.qq.com/sns/jscode2session?appid='+d.appid+'&secret='+d.secret+'&js_code='+r.code+'&grant_type=authorization_code';    
                // var l='https://api.weixin.qq.com/sns/jscode2session?appid='+d.appid+'&secret='+d.secret+'&js_code='+r.code+'&grant_type=authorization_code';
                // console.log(l);
                // return ;

                // that.globalData.userInfo = res.userInfo
                // typeof cb == "function" && cb(that.globalData.userInfo)
              },
              fail:function(res){
                wx.openSetting({
                  success: (res) => {
                    
                     res.authSetting = {
                       "scope.userInfo": true,
                       "scope.userLocation": true
                     }
                     _this.getUserInfo();
                  }
                })

              }
            })
            
                 
          }
        }
      })
    
    }
  },

  globalData: {
    userInfo: "",
    store:{},
    appid:'wxcacf596450e45b74',//appid需自己提供，此处的appid我随机编写  
    secret:'b4fe3346368441b895c5deea40a32356',//secret需自己提供，此处的secret我随机编写  
  },
  req:{
    req:request.request
  },
  apiUrl: path.apiUrl,
  wuxLoading:$wuxLoading,
  extend:function(des, src, override){
     if(src instanceof Array){  
         for(var i = 0, len = src.length; i < len; i++)  
              extend(des, src[i], override);  
     }  
     for( var i in src){  
         if(override || !(i in des)){  
             des[i] = src[i];  
         }  
     }  
     return des;  
  },
  user:{
    getuserNo:function(){
      var app = getApp();
      return app.globalData.userInfo.userNo;
      // return "1000000000000000347";
    },
    getStoreId:function(){
      var app = getApp();
      return app.globalData.store.id;
      // return "50b2ab0671b24756b63f1f22e7fb3f4a";
    },
    getOpenId:function(){
      var app = getApp();
      return app.globalData.userInfo.openId;
      // return "o0xAJ0ZudTFo0jSrIylCyNMKdXOA";
    },
    getUser:function(){
      var app = getApp();
      return app.globalData.userInfo;
    },
    getMobile:function(){
      var app = getApp();
      return app.globalData.userInfo.mobile 
    },
    setmoblie:function(mobile){
      var app = getApp();
      app.globalData.userInfo.mobile = mobile;
    }
  },
  pay:{
    key:"yimao20170830wanghaixuan11111111", //支付秘钥
    appId:"wxcacf596450e45b74" //appid
  },
  signkey:"08abbeb0192dc41232222bc0dfdb2a52494f4d24",
  toast:{
    show:function(text){
      $wuxToast.show({
        type: 'text',
        timer: 1000,
        color: '#fff',
        text: text
      })
    }
  },
  checknumalphabet:function(value){
    //判断验证码是否合法是返回true，不合法返回false
    var Regx = /^[A-Za-z0-9]*$/;
    if (Regx.test(value)) {return true;}
    else {return false;}
  }
})
