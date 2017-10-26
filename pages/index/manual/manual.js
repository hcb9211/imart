Page({

  /**
   * 页面的初始数据
   */
  data: {
    num:''
  },

  clicknum:function(e){
    var _self = this;
    var nums = e.currentTarget.dataset.num;
    var str = nums.toString();
    var num = _self.data.num + str;
    _self.setData({
      num: num
    })
  },
  delnum:function(e){
    var _self = this;
    var num = _self.data.num.substring(0, _self.data.num.length -1)
    _self.setData({
      num: num
    })
  },
  enternum:function(e){
      var _self = this;
      var num = _self.data.num;
      console.log(num);
  },
  backBtn : function(e){
    wx.navigateBack({}) 
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
     
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {},
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {},
  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {},
  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {},
  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {},
  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {},
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {}
})