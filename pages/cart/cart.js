// pages/cart/cart.js
var cardTeams;
var startX;
var startY;
var endX;
var endY;
var key;
var maxRight = 180;
import { $wuxRefresher } from '../../tool/tool'
var app = getApp();


Page({
  /*** 页面的初始数据*/
  data: {
    checkboxItems: [
      { name: 'USA', value: '美国', num: "21", id: "1", right: "0",startRight:"0" },
      { name: 'CHN', value: '中国', num: "22", id: "2", right: "0", startRight: "0" },
      { name: 'BRA', value: '巴西', num: "23", id: "3", right: "0", startRight: "0" },
      { name: 'JPN', value: '日本', num: "24", id: "4", right: "0", startRight: "0" },
      { name: 'ENG', value: '英国', num: "25", id: "5", right: "0", startRight: "0" },
      { name: 'TUR', value: '法国', num: "26", id: "6", right: "0", startRight: "0" },
    ],
    goods:{

    },
    hidden: false,
    delBtnWidth:85//删除按钮宽度单位（rpx）

  },
  /***点击数据获取*/
  checkboxChange: function (e) {
    // console.log(JSON.stringify(e))
    // var checked = e.detail.value
    // console.log(JSON.stringify(checked))
    // var changed = {}
    // for (var i = 0; i < this.data.checkboxItems.length; i++) {
    //   console.log(this.data.checkboxItems[i].name)
    //   if (checked.indexOf(this.data.checkboxItems[i].name) !== -1) {
    //     changed['checkboxItems[' + i + '].checked'] = true
    //   } else {
    //     changed['checkboxItems[' + i + '].checked'] = false
    //   }
    // }
    // this.setData(changed)
  },
  decChange: function (e) {
    var _self = this;
    var index = e.currentTarget.dataset.index;
    if (_self.data.goods.goodsList[index].shopCount == 1){
       return false;
    }
    _self.data.goods.goodsList[index].shopCount -= 1;
    _self.setData({
      goods: _self.data.goods
    });

    
    var url = app.apiUrl.updateICartGoodsForShoppingSort;
    var data = {
      storeId:app.user.getStoreId(),
      userNo:app.user.getuserNo(),
      code: _self.data.goods.goodsList[index].commodityCode,
      shopCount:  _self.data.goods.goodsList[index].shopCount

    };
    app.req.req(url,data,null,function(res){
       _self.ecombinationrList(res);
      console.dir( res.data);
    });
  },
  addChange: function (e) {
    var _self = this;
    var index = e.currentTarget.dataset.index;
    if (_self.data.goods.goodsList[index].shopCount>999){
       return false;
    }
    _self.data.goods.goodsList[index].shopCount += 1;
    _self.setData({
      goods: _self.data.goods
    });

    
    var url = app.apiUrl.updateICartGoodsForShoppingSort;
    var data = {
      storeId:app.user.getStoreId(),
      userNo:app.user.getuserNo(),
      code: _self.data.goods.goodsList[index].commodityCode,
      shopCount:  _self.data.goods.goodsList[index].shopCount

    };
    app.req.req(url,data,null,function(res){
       _self.ecombinationrList(res);
      console.dir( res.data);
    });
    // _self.onLoad();
  },
  delChange: function (e) {
    var _self = this;
    var index = e.currentTarget.dataset.index;
    _self.data.checkboxItems.splice(index, 1);
    _self.setData({
      checkboxItems: _self.data.checkboxItems
    });
  },
  kaishi:function(e){
    var touch = e.touches[0];
    startX = touch.clientX;
    startY = touch.clientY;
    var checkboxItems = this.data.checkboxItems;
    for (var i in checkboxItems) {
      var data = checkboxItems[i];
      data.startRight = data.right;
    }
    key = true;
  },
  jieshu:function(e){
    var checkboxItems = this.data.checkboxItems;
    for (var i in checkboxItems) {
      var data = checkboxItems[i];
      if (data.right <=  150) {
        data.right = 0;
      } else {
        data.right = maxRight;
      }
    }
    this.setData({
      checkboxItems: checkboxItems
    });
  },
  chixu:function(e){
    var self = this;
    var dataId = e.currentTarget.id;
    var checkboxItems = this.data.checkboxItems;
    if (key) {
      var touch = e.touches[0];
      endX = touch.clientX;
      endY = touch.clientY;
      if (endX - startX == 0)
        return;
      var res = checkboxItems;
      //从右往左
      if ((endX - startX) < 0) {
        for (var k in res) {
          res[k].right = 0;
          var data = res[k];
          if (res[k].id == dataId) {
            var startRight = res[k].startRight;
            var change = startX - endX;
            startRight += change;
            if (startRight > 30){
              startRight = maxRight;
              res[k].right = startRight;
            }
          }
        }
      } else {//从左往右
        for (var k in res) {
          var data = res[k];
          if (res[k].id == dataId) {
            var startRight = res[k].startRight;
            var change = endX - startX;
            console.log(change);
            startRight -= change;
            if (startRight < 0)
              startRight = 0;
            res[k].right = startRight;
          }
        }
      }
      self.setData({
        checkboxItems: checkboxItems
      });
    }
  },
  order:function(){
    if(this.data.goods.goodsList.length == 0){
      app.toast.show("请先添加商品");
      return false;
    }
    var orderinfo = JSON.stringify(this.data.goods)
    wx.navigateTo({
      url: '../order/order-pay/order?orderinfo='+orderinfo,
    })
  },
  /*** 生命周期函数--监听页面加载*/
  onLoad: function (options) {
    var _self = this;
    _self.init();
    console.log($wuxRefresher);
    console.log('==============')
   this.refresher = new $wuxRefresher({
      onPulling() {
        console.log('onPulling')
      },
      onRefresh() {
        console.log('onRefresh')
        setTimeout(() => {
          _self.init();
          this.events.emit(`scroll.refreshComplete`)
        }, 1000)
      }
    })
    
    // wx.request({
    //   url: '',
    //   success:function(res){
          
    //   }
    // })
  },
  init:function(){
    var _self = this;
    
    var url = app.apiUrl.queryICartGoodsForShoppingSort;
    var data = {
      storeId:app.user.getStoreId(),
      userNo:app.user.getuserNo()
    };

    app.req.req(url,data,null,function(res){
      
      _self.ecombinationrList(res);
      
      console.dir( _self.goods);
    });
  },
  //重組商品數組
  ecombinationrList:function(res){
    var _self = this;
    var goodsList = res.data.goodsList;
    var subGoodsList = res.data.subGoodsList;
    for (var i = 0; i < goodsList.length; i++) {
      goodsList[i].isTouchMove == false;
    }
    for (var i = 0; i < subGoodsList.length; i++) {
        var subList = subGoodsList[i].subList;
        for (var j = 0; j < subList.length; j++) {
          subList[j].isTouchMove == false;
          goodsList.push(subList[j]);
        }
    }
    _self.setData({
          goods:res.data
      });
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
  /*** 生命周期函数--监听页面初次渲染完成*/
  onReady: function () {},
  /** * 生命周期函数--监听页面显示*/
  onShow: function () {
    this.init();
  },
   touchS:function(e){
    if(e.touches.length==1){
      this.setData({
        //设置触摸起始点水平方向位置
        startX:e.touches[0].clientX
      });
    }
  },
  touchM:function(e){
    if(e.touches.length==1){
      //手指移动时水平方向位置
      var moveX = e.touches[0].clientX;
      //手指起始点位置与移动期间的差值
      var disX = this.data.startX - moveX;
      var delBtnWidth = this.data.delBtnWidth;
      var txtStyle = "";
      if(disX == 0 || disX < 0){//如果移动距离小于等于0，文本层位置不变
        txtStyle = "left:0px";
      }else if(disX > 0 ){//移动距离大于0，文本层left值等于手指移动距离
        txtStyle = "left:-"+disX+"px";
        if(disX>=delBtnWidth){
          //控制手指移动距离最大值为删除按钮的宽度
          txtStyle = "left:-"+delBtnWidth+"px";
        }
      }
      //获取手指触摸的是哪一项
      var index = e.currentTarget.dataset.index;;
      var list = this.data.goods.goodsList;
      if(index >= 0){
        list[index].txtStyle = txtStyle; 
        //更新列表的状态
        this.setData({
          goods: this.data.goods
        });
      }
    }
  },

  touchE:function(e){
    if(e.changedTouches.length==1){
      //手指移动结束后水平位置
      var endX = e.changedTouches[0].clientX;
      //触摸开始与结束，手指移动的距离
      var disX = this.data.startX - endX;
      var delBtnWidth = this.data.delBtnWidth;
      //如果距离小于删除按钮的1/2，不显示删除按钮
      var txtStyle = disX > delBtnWidth/2 ? "left:-"+delBtnWidth+"px":"left:0px";
      //获取手指触摸的是哪一项
      var index = e.currentTarget.dataset.index;;
      var list = this.data.goods.goodsList;
      console.log(e);
      if(index >= 0){
        list[index].txtStyle = txtStyle;
        //更新列表的状态
        this.setData({
          goods:this.data.goods
        });
      }
    }
  },
  //获取元素自适应后的实际宽度
  getEleWidth:function(w){
    var real = 0;
    try {
      var res = wx.getSystemInfoSync().windowWidth;
      var scale = (750/2)/(w/2);//以宽度750px设计稿做宽度的自适应
      // console.log(scale);
      real = Math.floor(res/scale);
      return real;
    } catch (e) {
      return false;
     // Do something when catch error
    }
  },
  initEleWidth:function(){
    var delBtnWidth = this.getEleWidth(this.data.delBtnWidth);
    this.setData({
      delBtnWidth:delBtnWidth
    });
  },
  //点击删除按钮事件
  delGoods:function(e){
    //获取列表中要删除项的下标
    var _self = this;
    var index = e.currentTarget.dataset.index;;
    var goods = _self.data.goods.goodsList[index];
    var url = app.apiUrl.removeICartGoodsForShoppingSort;
    var data = {
      storeId:goods.storeId,
      userNo:app.user.getuserNo(),
      code: goods.commodityCode,
      barCode:  goods.commodityCode

    };
    //判斷是否是散稱商品
    if("0" == goods.type){
      goods.barCode = goods.commodityCode.substring(0,7);
    }
    app.req.req(url,data,null,function(res){
       _self.ecombinationrList(res);
      console.dir( res.data);
    });
  },
  /*** 生命周期函数--监听页面隐藏*/
  onHide: function () {},
  /*** 生命周期函数--监听页面卸载*/
  onUnload: function () {},
  /*** 页面相关事件处理函数--监听用户下拉动作*/
  onPullDownRefresh: function () {},
  /*** 页面上拉触底事件的处理函数*/
  onReachBottom: function () {},
  /*** 用户点击右上角分享*/
  onShareAppMessage: function () {}
})