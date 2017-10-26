import { $wuxDialog } from '../tool/tool';
function request(url,data,option,callback,failcb){
	var app = getApp();
	 app.wuxLoading.show({
            text: '数据加载中',
        })

        
	wx.request({
    url: url,
    data:data,
    method:'post',
    header: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    success:function(res){
		setTimeout(() => {
	        app.wuxLoading.hide()
	    }, 0)
       return typeof callback == "function" && callback(res.data)  
    },
    fail:function(res){
    	setTimeout(() => {
            app.wuxLoading.hide()
        }, 0)
        return typeof failcb == "function" && failcb()  
    	// $wuxDialog.alert({
     //      title:'失败',
     //      content:JSON.stringify(res)
     //    })
    }
  })
}

module.exports = {
  request : request
}