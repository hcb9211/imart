var serverpath = "https://www.ieemoo.com";
// var serverpath = "http://114.215.253.127:8085";
var ApiUrl = {
	addShopProductWeight:serverpath + "/emall-mobile/sShopCart/addShopProductWeight.do",
  queryNearByStores: serverpath + "/emall-mobile/storeForMobile/queryNearByStores.do", // 查询附近门店(Hony Bob)
  queryShopCouponPage: serverpath + "/emall-mobile/shopCouponForMobile/queryShopCouponPage.do",  // 优惠券查询（Hony Bob）
  queryUserOrder: serverpath + "/emall-mobile/orderForMiniProgram/queryUserOrder.do",  // 根据会员编号查询订单列表（Zhiping）
  queryUserOrderDetail:serverpath + "/emall-mobile/orderForMiniProgram/queryUserOrderDetail.do",//根据订单编号查询订单(Zhiping)
  chargeBack: serverpath + "/emall-mobile/order/chargeBack.do", //退款(Zhiping)
  queryUserOrderNum: serverpath + "/emall-mobile/orderForMiniProgram/queryUserOrderNum.do", //订单分类数量(Zhiping)
  deleteUserOrder: serverpath + "/emall-mobile/orderForMiniProgram/deleteUserOrder.do", //删除订单(Zhiping)
	miniProgramLoginForMobile : serverpath + "/emall-mobile/memberUserForMobile/miniProgramLoginForMobile.do", //小程序登录
	queryICartGoodsForShoppingSort : serverpath + "/emall-mobile/orderForMiniProgram/queryICartGoodsForShoppingSort.do",//查询购物车商品
	updateICartGoodsForShoppingSort:serverpath + "/emall-mobile/orderForMiniProgram/updateICartGoodsForShoppingSort.do",//修改购物车商品的数量
	queryPruductDetailN:serverpath + "/emall-mobile/orderForMiniProgram/queryPruductDetailN.do",//查询商品详情
	addICartGoodsForShopping:serverpath + "/emall-mobile/shop/addICartGoodsForShopping.do",//添加商品到购物车V2
	chargeBack: serverpath + "/emall-mobile/order/chargeBack.do", //退款
	queryGoodsPriceForOrderByStoreId: serverpath + "/emall-mobile/orderForMiniProgram/queryGoodsPriceForOrderByStoreId.do", //订单确认页查询用户相关信息
	submitOrder: serverpath + "/emall-mobile/orderForMiniProgram/submitOrder.do", //提交订单
	getWeixinPrepayInfo:serverpath + "/emall-mobile/trade/getWeixinPrepayInfo.do",
	sendSmsCode:serverpath + "/emall-mobile/memberUserForMobile/sendSmsCode.do", //发送验证码
	bindMobileNumber:serverpath + "/emall-mobile/memberUserForMobile/bindMobileNumber.do" ,//绑定手机号
	receiveShopCoupon:serverpath + "/emall-mobile/shopCouponForMobile/receiveShopCoupon.do", //领取优惠券
	removeICartGoodsForShoppingSort:serverpath + "/emall-mobile/orderForMiniProgram/removeICartGoodsForShoppingSort.do", //从购物车移除商品V3
	openDoor:serverpath + "/emall-mobile/orderForMiniProgram/openDoor.do",
  bindRecommendMobile: serverpath + "/emall-mobile/memberUser/bindRecommendMobile.do", //用户推荐手机号填写
  isNewMemberUser: serverpath + "/emall-mobile/memberUser/isNewMemberUser.do" //判断用户是否新会员
  }
module.exports = {
    apiUrl : ApiUrl
}