// pages/index/indexF.js
import { $wuxDialog } from '../../tool/tool'
import { $wuxToast } from '../../tool/tool'
import { $wuxRefresher } from '../../tool/tool'
import { $select } from '../../tool/tool'
var path = require('../../config/path.js')


var app = getApp();
Page({
  /**
   * 页面的初始数据 
   */
  data: {
    background: [         
      'http://blob00.blob.core.chinacloudapi.cn/ieemoo-blob/mobile-picture/1.png',
      'http://blob00.blob.core.chinacloudapi.cn/ieemoo-blob/mobile-picture/2.png',
      'http://blob00.blob.core.chinacloudapi.cn/ieemoo-blob/mobile-picture/3.png',
      'http://blob00.blob.core.chinacloudapi.cn/ieemoo-blob/mobile-picture/4.png'
      ],
    indicatorDots: false,
    vertical: true,
    autoplay: true,
    interval: 2000,
    duration:500,
    storename : '请选择门店',
    good:{
      name:''
    },
    manual:{
      num:"",
      visible:false,
      storename:"",
    },
    storelist:[], //门店列表
    items: [
      {
        title: new Date,
        content: '由各种物质组成的巨型球状天体，叫做星球。星球有一定的形状，有自己的运行轨道。',
      },
      {
        title: new Date,
        content: '由各种物质组成的巨型球状天体，叫做星球。星球有一定的形状，有自己的运行轨道。',
      }
    ]
    
  },

  clicknum:function(e){
      var _self = this;
      var nums = e.currentTarget.dataset.num;
      var str = nums.toString();
      var num = _self.data.manual.num + str;
      _self.data.manual.num = num;
      _self.setData({
        manual: _self.data.manual
      })
    },
  manualpage:function(e){
    var _self = this;
     _self.data.manual.num = "";
     _self.data.manual.visible = true;
     _self.data.manual.storename = _self.data.storename;
     _self.setData({
        manual: _self.data.manual
      })

  },
  //删除
  delnum:function(e){
    var _self = this;
    if( _self.data.manual.num.length == 0){
      return false;
    }
    var num = _self.data.manual.num.substring(0, _self.data.manual.num.length -1)
    _self.data.manual.num = num;
    _self.setData({
      manual: _self.data.manual
    })
  },
  //确认
  enternum:function(e){
      var _self = this;
      var num = _self.data.manual.num;
      if(num.length == 0){
        app.toast.show("请输入条码")
        return false;
      }
      if(_self.data.manual.num.length < 8){
        app.toast.show("请输入完整的条码");
        return false;
    }
      _self.queryPruductDetailN(num,function(){
        _self.backBtn();
      });
  },
  //返回
  backBtn : function(e){
     var _self = this;
     _self.data.manual.num = "";
     _self.data.manual.visible = false;
     _self.setData({
        manual: _self.data.manual
      })
     // queryPruductDetailN(_selfdata.manual.num);
  },
  shopCountinput:function(e){
    var _self = this;
    _self.data.good.shopCount = parseInt(e.detail.value);
    self.setData({
      good:_self.data.good
    })
  },
  deccount:function(){
    var _self = this;
    if (_self.data.good.shopCount>1){
      _self.data.good.shopCount -= 1;
      _self.setData({
        good:_self.data.good
      })
    }
   
    
  },
  addcount:function(){
    var _self = this;
    if(_self.data.good.commodityCode.indexOf("28") == 0){
      app.toast.show("散称商品无法修改数量");
      return false;
    }
    if(_self.data.good.shopCount >= 1){
       _self.data.good.shopCount += 1;
      _self.setData({
          good:_self.data.good
      })
    }
   
  },
  hide:function(){
    var _self = this;
    _self.data.good.visible = false;
    _self.setData({
      good:_self.data.good
    })
  },
  addcart:function(){
     var _self = this;
    console.log(_self.data.good.shopCount);
    
    var good = _self.data.good;
    var url = app.apiUrl.addICartGoodsForShopping;
    //判断是否
    var data = {
      barCode:good.barCode,
      code:good.commodityCode,
      goodsNo:good.goodsNo,
      price:good.nowPrice,
      shopCount:good.shopCount,
      storeId:app.user.getStoreId(),
      type:good.type,
      userNo:app.user.getuserNo(),
    }
    app.req.req(url,data,null,function(data){
      console.log(data);
            if("0" == data.retCode){
               
                _self.data.good.visible = false;
                _self.setData({
                  good:_self.data.good
                })
                $wuxToast.show({
                  type: 'success',
                  timer: 1000,
                  color: '#fff',
                  text: '添加成功'
                })
            }else{
              app.toast.show(data.retMsg);
            }
          },function(){
             $wuxToast.show({
                type: 'success',
                timer: 1000,
                color: '#fff',
                text: '加入失败'
              })
          })
        
  },
  scan : function(){
    var _self = this;
    wx.scanCode({
        onlyFromCamera: false,  
        success : (res) =>{
          _self.queryPruductDetailN(res.result);
          console.dir('success' + JSON.stringify(res));
        },
        fail : (res) =>{
           console.dir('fail' + JSON.stringify(res));
        },
        complete : (res) =>{
          console.dir('complete' + JSON.stringify(res));
        },
      })
  },
  //查询商品详情
  queryPruductDetailN:function(code,cb){
    
    var _self = this;
    var url = app.apiUrl.queryPruductDetailN;
    var reqdata = {
      barCode:code,
      storeId:app.user.getStoreId()
    };
  
    app.req.req(url,reqdata,null,function(data){
      console.log(data);
      if("0" == data.retCode){
        //回调事件
        var good = data.data[0];
        good.visible = true;
        good.shopCount = 1;
        _self.setData({
          good:good
        })
        return typeof cb == "function" && cb()  
      }else{
        app.toast.show(data.retMsg);
      }
    })
        
  },
  masktap: function(){
    var _self = this;
    wx.getLocation({
      success: function(res) {
        var lon = (res.longitude).toFixed(2);
        var lat = (res.latitude).toFixed(2);
        var url = path.apiUrl.queryNearByStores;
        var storedata = {
           startDistance: "0",
           endDistance: "1000",
           icartFlag : 1,
           lat1: lat,
           lng1: lon,
           pageNo : 0,
           pageSize : 9999
        }
        app.req.req(url,storedata,null,function(res){
          $select.select({
            title: '选择门店',
            content: '门店选错可能造成您的经济损失，且不能正常出店哦~',
            list: res.data,
            onConfirm: function (e, obj) {
              app.globalData.store = obj;
              _self.setData({
                storename: app.globalData.store.name
              })
            }
          })
        })
      },
    })
  },
  sucbean : function(){
    wx.navigateTo({
      // url: 'sucbean/sucbean',
      url:'discoupon/discoupon'
    })
  },
  getLocation : function(){
    wx.chooseLocation({
      success: function(res) {
        $wuxDialog.alert({
          title:'提示',
          content:JSON.stringify(res)
        })
      },
    })

      wx.getLocation({
        type: 'wgs84',
        success: function(res) {
          $wuxDialog.alert({
            title:'提示',
            content: JSON.stringify(res.latitude + '**' + res.longitude)
          })
        },
      })
  },
  /**
   * 生命周期函数--监听页面加载
   */ 
  onLoad: function (options) {
    app.getUserInfo();
   
    // wx.navigateTo({
    //   url: '../order/accomplish-pay/acc?orderNo=1617092103170118'
    // })
    var _self = this;
    wx.getLocation({
      success: function(res) {
        var lon = (res.longitude).toFixed(2);
        var lat = (res.latitude).toFixed(2);
        var url = path.apiUrl.queryNearByStores;
        var storedata = {
           startDistance: "0",
           endDistance: "1000",
           icartFlag : 1,
           lat1: lat,
           lng1: lon,
           pageNo : 0,
           pageSize : 9999
        }
        app.req.req(url,storedata,null,function(res){
          app.globalData.store = res.data[0];
          _self.setData({
            storename: app.globalData.store.name,
            storelist: res.data
          })
        })
      },
    })
  },
  touchstart(e) {
    this.refresher.touchstart(e)
  },
  touchmove(e) {
    this.refresher.touchmove(e)
  },
  touchend(e) {
    this.refresher.touchend(e)
  }, 
  // onShareAppMessage(){
  //   console.log(214323432);
  // }
})