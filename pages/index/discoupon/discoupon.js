// pages/index/discoupon/discoupon.js
var path = require('../../../config/path.js');
var app = getApp();
Page({

    /**
     * 页面的初始数据
     */
    data: {
        // background:'#e22a2a',
        // coupontext:'立即领取',
        // clickId : ''
      couponlist:[]
    },
    // 领取优惠券
    getCoupon : function(e){ 
      var _self = this;     
      var index = e.currentTarget.id;
      var couponRule = _self.data.couponlist[index].couponRuleNo;
      var couponlist = _self.data.couponlist;
      var url = path.apiUrl.receiveShopCoupon;
      var getcoupondata = {
        couponRuleNo: couponRule,
        userNo: app.user.getuserNo()
      };
      app.req.req(url,getcoupondata,null,function(res){
        // 弹出领取成功
          couponlist[index].background = '#979797';
          couponlist[index].coupontext = '已领取';
          _self.setData({
            couponlist: couponlist
          })
      })
    },

    /**
     * 生命周期函数--
     */
    onLoad: function (options) {
        var _self = this;
        wx.getLocation({
            success: function (res) {
                var lon = (res.longitude).toFixed(2);
                var lat = (res.latitude).toFixed(2);
                var url = path.apiUrl.queryShopCouponPage;
                var coupondata = {
                  latitude: lat,
                  longitude: lon,
                  pageNo: 1,
                  pageSize: 9999,
                  userNo: app.user.getuserNo()
                };
                app.req.req(url, coupondata,null,function(res){                
                  for(var i in res.data){
                      if(res.data[i].isReceive == '0'){
                        res.data[i].background = '#E22A2A';
                        res.data[i].coupontext = '立即领取';
                      }else{
                        res.data[i].background = '#979797';
                        res.data[i].coupontext = '已领取';
                      }
                  }  // for循环
                  _self.setData({
                    couponlist: res.data,
                  })
                })
            },
        })
    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function () {

    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function () {

    },

    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide: function () {

    },

    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload: function () {

    },

    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh: function () {

    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function () {

    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function () {

    }
})