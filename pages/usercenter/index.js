//数据获取路径  
import { $wuxToast } from '../../tool/tool';
import { $wuxDialog } from '../../tool/tool';
var path = require('../../config/path.js');
var app = getApp();
Page({
 /*** 页面的初始数据*/
  data: {
    // 导航栏
    navigation: [
      { value: "全部", num: 0, whit: false, pageNo: 1, dat: "all", status: "", leng: "8"}, 
      { value: "待付款", num: 0, whit: true, pageNo: 1, dat: "pay", status: "2", leng: "8"}, 
      { value: "待复核", num: 0, whit: true, pageNo: 1, dat: "recheck", status: "0", leng: "8"}, 
      { value: "已完成", num: 0, whit: true, pageNo: 1, dat: "achieve", status: "3", leng: "8"}
    ],
    // 用户头像 昵称加载 数字
    user:{},
    // 所有订单
    all:[],
    // 待支付订单
    pay: [],
    // 待复核订单
    recheck: [],
    // 已完成订单
    achieve: [],
    // 导航栏按钮确定
    classif:0
  },
  /*导航栏转换*/
  classify:function(e){
    var _self = this;
    var index = e.currentTarget.dataset.classify;
    var navigationlist = _self.data.navigation;
    for (var i = 0; i < navigationlist.length; i++) { navigationlist[i].whit = true;}
    navigationlist[index].whit = false;
    _self.setData({ navigation: navigationlist, classif:index});
    if (index == 0 && _self.data.all.length == 0) { _self.init(0) }
    else if (index == 1 && _self.data.pay.length == 0) { _self.init(1) }
    else if (index == 2 && _self.data.recheck.length == 0) { _self.init(2) }
    else if (index == 3 && _self.data.achieve.length == 0) { _self.init(3) }
  },
  /*所有订单数据获取*/
  init:function(e){
    var index = e;
    var _self = this; 
    var list;
    if (index == 0) { 
      list = _self.data.all;
    }else if(index == 1){
      list = _self.data.pay;
    } else if (index == 2) {
      list = _self.data.recheck;
    }else{
      list = _self.data.achieve;
    }
    var url = path.apiUrl.queryUserOrder;
    var data = {
      pageNo: _self.data.navigation[index].pageNo,
      pageSize: 8,
      status: _self.data.navigation[index].status,
      storeId: "",
      userNo: app.user.getuserNo()
    };
    console.log(JSON.stringify(data));
    app.req.req(url,data,null,function(data){
      for (var i = 0; i < data.data.length; i++) {
        list.push(data.data[i]);
      };
      var nav = _self.data.navigation;
      nav[index].leng = data.data.length;
      if (index == 0) { _self.setData({ all: list, navigation:nav });}
      else if (index == 1) { _self.setData({ pay: list, navigation: nav}); }
      else if (index == 2) { _self.setData({ recheck: list, navigation: nav }); }
      else { _self.setData({ achieve: list, navigation: nav }); }
    })
  },
  /*订单详情页面跳转 */
  tiaozhaun:function(e){
    var _self = this;
    var orderNo = e.currentTarget.id;
    wx:wx.navigateTo({
      url: 'Orderdetail/index?orderno='+orderNo,
    })
  },
  /**导航栏数据获取 */
  daohang:function(){
    var _self = this;
    var url = path.apiUrl.queryUserOrderNum;
    var data = { userNo: app.user.getuserNo()};
    app.req.req(url,data,null,function(data){
      var classlif = _self.data.navigation;
      classlif[0].num = data.data.total;
      classlif[1].num = data.data.paying;
      classlif[2].num = data.data.checking;
      classlif[3].num = data.data.payed;
      _self.setData({
        navigation: classlif
      })
    })
  },
  /** * 生命周期函数--监听页面加载*/
  onLoad: function (options) {
    var _self = this;
    _self.init(0);
    _self.daohang();
  /**用户头像昵称获取 */
    _self.setData({ user: app.globalData.userInfo});
  },
  /*取消订单 */
  shanchu:function(e){
    var _self = this;
    let index = e.currentTarget.dataset.index; 
    $wuxDialog.confirm({
      title: '取消订单',
      content: '你确定要取消这个订单吗？',
      onConfirm(e) {
        var url = path.apiUrl.deleteUserOrder;
        var data = {
          orderNo: e.currentTarget.dataset.jsdh,
          userNo: app.user.getuserNo()
        };
        app.req.req(url,data,null,function(data){
          if (_self.data.classif == 0) {
            let allinit = _self.data.all;
            allinit.splice(index, 1);
            _self.setData({
              all: allinit
            })
          } else if (_self.data.classif == 1) {
            let recheckinit = _self.data.recheck;
            recheckinit.splice(index, 1);
            _self.setData({
              recheck: recheckinit
            })
          }
          $wuxToast.show({
            type: 'text',
            timer: 1500,
            color: '#fff',
            text: '订单取消成功！',
            success: () => console.log()
          });
        })
        _self.daohang();
      },
      onCancel(e) {
        return false;
      },
    });
  },
  /**支付*/
  pay:function(e){    
    var pay = require("../../script/pay.js");
    var _self = this;
    if (e.currentTarget.dataset.md == app.globalData.store.id){
      let index = e.currentTarget.dataset.index;
      var data = {
        orderNo: e.currentTarget.dataset.jsdh,
        payAmount: e.currentTarget.dataset.je,
        storeId: e.currentTarget.dataset.md
      };
      pay.pay.getPrepayInfo(data, function (res) {
        if (_self.data.classif == 0){
          let allinit = _self.data.all;
          allinit[index].status = 0;
          _self.setData({
            all: allinit
          })
        } else if (_self.data.classif == 1){
          let recheckinit = _self.data.recheck;
          recheckinit[index].status = 0;
          _self.setData({
            recheck: recheckinit
          })
        }
        _self.daohang();
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
        text: '订单门店与当前门店不符,请检查门店!',
        success: () => console.log()
      })
    }
  },
  /*** 用户点击右上角分享 */
  onShareAppMessage: function () { },
  // 上拉加载
  onReachBottom: function () {
    var _self = this;
    if (_self.data.classif == 0){
      var navigationinit = _self.data.navigation;
      ++navigationinit[0].pageNo;
      _self.setData({ navigation: navigationinit})
      _self.init(0);
    } else if (_self.data.classif == 1){
      var navigationinit = _self.data.navigation;
      ++navigationinit[1].pageNo;
      _self.setData({ navigation: navigationinit })
      _self.init(1);
    } else if (_self.data.classif == 2) {
      var navigationinit = _self.data.navigation;
      ++navigationinit[2].pageNo;
      _self.setData({ navigation: navigationinit })
      _self.init(2);
    } else {
      var navigationinit = _self.data.navigation;
      ++navigationinit[3].pageNo;
      _self.setData({ navigation: navigationinit })
      _self.init(3);
    }
  },
  //跳转更新
  onShow:function(){
    var _self = this;
    console.log(34534534);
    if (_self.data.classif == 0){
      let navigation = _self.data.navigation;
      navigation[0].pageNo = 1;
      _self.setData({
        all:[],
        navigation: navigation
      })
      _self.init(0);
    } else if (_self.data.classif == 1){
      let navigation = _self.data.navigation;
      navigation[1].pageNo = 1;
      _self.setData({
        pay: [],
        navigation: navigation
      })
      _self.init(1);
    } else if (_self.data.classif == 2) {
      let navigation = _self.data.navigation;
      navigation[2].pageNo = 1;
      _self.setData({
        recheck: [],
        navigation: navigation
      })
      _self.init(2);
    }else{
      let navigation = _self.data.navigation;
      navigation[3].pageNo = 1;
      _self.setData({
        achieve: [],
        navigation: navigation
      })
      _self.init(3);
    }
    //重新 查询数量
    _self.daohang();
  },
  opendoor:function(e){
    var _self = this;
    var index = e.currentTarget.dataset.index;
    var orderNo = e.currentTarget.dataset.orderno;

    var url = path.apiUrl.openDoor;
    
     wx.scanCode({
        onlyFromCamera: false,  
        success : (res) =>{
          // var info =  res.result.replace(/\"/g,"'");
          // info = "\""+info.substring(1,info.length - 2)+"\"";
          // console.log(res.result);
          var info = res.result;
          info = info.substring(1,info.length - 1);

          info = JSON.parse(info)
          // var info = {
          //   type:"opendoor",
          //   value:{
          //     indexdoor:"8",
          //     storeid:"1033"
          //   }
          // }
          // orderNo = "1517101500890017";
          if("opendoor" == info.type){
             var data = {
                channelId:info.value.indexdoor,
                orderNo:orderNo,
                storeId:info.value.storeid
              }
              // console.log(data);

              console.log('扫码结果' + JSON.stringify(res.result));
              app.req.req(url,data,null,function(res){
                console.log(res);
                if("0" == res.retCode){
                  app.toast.show(res.data); 
                  return false;                 
                }else{
                  app.toast.show(res.retMsg);    
                  return false;              
                }
              })

          }else{
              app.toast.show("当二维码非开门码");    
              return false;          
          }
         
        },
        fail : (res) =>{
           
        },
        complete : (res) =>{
         
        },
      })
   
  },
  //2017.10.17 小功能跳转
  functionality:function(){
    wx.navigateTo({
      url: 'functionality/functionality'
    })
  }
})