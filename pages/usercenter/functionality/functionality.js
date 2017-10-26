// pages/usercenter/functionality/functionality.js
import { $wuxDialog } from '../../../tool/tool'
import { $wuxToast } from '../../../tool/tool'
import { $wuxRefresher } from '../../../tool/tool'
import { $select } from '../../../tool/tool'
import { $qrcode } from '../../../tool/tool'
var path = require('../../../config/path.js');
var app = getApp();
Page({
  data: {
    yimaoke: {
      num: "",
      visible: false,
      cancelchack: false
    },
    bindingphone: {
      mobile: "",
      smsCode: "",
      countdown: 0,
      countdownstr: "获取验证码",
      recommendMobile: "",
      issend: true,
      visible: false
    },
    yimaokeshow:true
  },
  onLoad: function (options){
    var _self = this;
    // 开始查询 页面查看用户是否绑定了亿猫客
    var url = path.apiUrl.isNewMemberUser;
    var data = { userNo: app.user.getuserNo() };
    app.req.req(url,data,null,function(data){
      console.log(data.data)
      if (data.data == false){
        let yimaokeshow = false;
        _self.setData({
          yimaokeshow: false
        })
      }
    })
  },
  // 点击显示弹窗页面
  masktap:function(e) {
    var _self = this;
    if (app.user.getMobile()){
      var yimaokecopy = _self.data.yimaoke;
      yimaokecopy.visible = true;
      // 二维码 显示
      var qrcodeval = { "type": "bindyimaoke", "value": { "mobile": app.user.getMobile(), "userNo": app.user.getuserNo() } };
      var qrcodevalue = JSON.stringify(qrcodeval);
      _self.renderQrcode('qrcode', qrcodevalue);
      _self.setData({
        yimaoke: yimaokecopy
      })
    }else{
      var bindingphonecopy = _self.data.bindingphone;
      bindingphonecopy.visible = true;
      _self.setData({
        bindingphone: bindingphonecopy
      }) 
    }
  },
  // 绑定亿猫客页面 推荐码数据获取
  yimaokeinit: function (e) {
    var yimao = this.data.yimaoke;
    yimao.num = e.detail.value
    this.setData({
      yimaoke:yimao
    })
  },
  // 亿猫客页面提交数据
  updata: function () {
    var _self = this;
    // console.log(_self.data.yimaoke.num!="");
    // console.log(app.checknumalphabet(_self.data.yimaoke.num));
    if ((app.checknumalphabet(_self.data.yimaoke.num)) && (_self.data.yimaoke.num != "")){
      var url = path.apiUrl.bindRecommendMobile;
      var data = {
        mobile: "",
        recommendMobile: _self.data.yimaoke.num,
        userNo: app.user.getuserNo()
      };
      app.req.req(url, data, null, function (data) {
        console.log(data)
        if (data.retCode == 0) {
          $wuxToast.show({
            type: 'text',
            timer: 1500,
            color: '#fff',
            text: '绑定亿猫客成功！',
            success: () => console.log()
          });
          _self.setData({
            yimaokeshow:false
          })
        } else {
          $wuxToast.show({
            type: 'text',
            timer: 1500,
            color: '#fff',
            text: data.retMsg,
            success: () => console.log()
          });
        }
      })
    }else{
      $wuxToast.show({
        type: 'text',
        timer: 1500,
        color: '#fff',
        text: '推荐码或推荐手机号不合法，请检查后再提交！',
        success: () => console.log()
      });
    }
  },
  // 亿猫客页面取消
  cancel:function(){
    var _self = this;
    _self.data.yimaoke.num = "";
    _self.data.yimaoke.visible = false;
    _self.setData({
      yimaoke: _self.data.yimaoke
    })
  },
  // 亿猫客页面二维码部分代码
  randomColor() {
    const colorStr = "444444"
    const length = colorStr.length
    const prefixStr = `000000`.substring(0, 6 - colorStr.length)
    return `#${prefixStr}${colorStr}`
  },
  // 亿猫客页面二维码部分代码
  renderQrcode(canvasId, value) {
    $qrcode.init(canvasId, value, {
      fgColor: this.randomColor()
    })
  },
  //绑定手机号页面 手机号数据获取
  bindPhoneInput: function (e) {
    var _self = this;
    _self.data.bindingphone.mobile = e.detail.value;
    _self.setData({
      bindingphone: _self.data.bindingphone
    })
  },
  //绑定手机号页面  验证码数据获取
  bindCodeInput: function (e) {
    var _self = this;
    _self.data.bindingphone.smsCode = e.detail.value;
    this.setData({
      bindingphone: _self.data.bindingphone
    })
  },
  //绑定手机号页面 发送验证码
  sendcode: function (e) {
    // expression
    var _self = this;
    var mobile = _self.data.bindingphone.mobile;
    var issend = _self.data.bindingphone.issend;
    if (!issend) {
      return false;
    }
    _self.data.bindingphone.issend = false;
    _self.setData({
      bindingphone: _self.data.bindingphone
    })

    var myreg = /^(((13[0-9]{1})|(15[0-9]{1})|(17[0-9]{1})|(18[0-9]{1}))+\d{8})$/;
    if (!mobile || !myreg.test(mobile)) {
      app.toast.show("请输入有效的手机号码")
      _self.data.bindingphone.issend = true;
      _self.setData({
        bindingphone: _self.data.bindingphone
      })
      return false;
    }
    var url = app.apiUrl.sendSmsCode;
    var data = {
      mobile: mobile,
      verificationCodeType: "2" //0-注册登录修改密码 1-提现 2-绑定手机号
    }
    app.req.req(url, data, null, function (res) {
      if ("0" == res.retCode) {
        var voice_interval = 60;
        var int1 = setInterval(function () {
          var i = voice_interval--;
          _self.data.bindingphone.countdownstr = "已发送(" + i + ")";
          _self.setData({
            bindingphone: _self.data.bindingphone
          });

          if (0 == i) {
            clearInterval(int1);
            _self.data.bindingphone.countdownstr = "获取验证码";
            _self.data.bindingphone.issend = true;
            _self.setData({
              bindingphone: _self.data.bindingphone
            });
          }
        }, 1000);
      } else {
        _self.data.bindingphone.issend = true;
        _self.setData({
          bindingphone: _self.data.bindingphone
        });
        app.toast.show(res.retMsg)
      }
    }, function () {
      _self.data.bindingphone.issend = true;
      _self.setData({
        bindingphone: _self.data.bindingphone
      })
      app.toast.show("发送验证码失败")
      return false;
    })
  },
  // 绑定手机号页面 推荐码或推荐人手机号
  bindrecommendMobileInput: function (e) {
    var _self = this;
    _self.data.bindingphone.recommendMobile = e.detail.value;
    this.setData({
      bindingphone: _self.data.bindingphone
    })
  },
  //绑定手机号页面 取消
  back: function () {
    var _self = this;
    _self.data.bindingphone.visible = false;
    _self.setData({
      bindingphone: _self.data.bindingphone
    })
  },
  // 绑定手机号页面 数据提交
  bindMobileNumber: function (e) {
    var _self = this;
    var mobile = _self.data.bindingphone.mobile;
    var smsCode = _self.data.bindingphone.smsCode;
    var recommendMobile = _self.data.bindingphone.recommendMobile;
    var url = app.apiUrl.bindMobileNumber;
    var data = {
      mobile: mobile,
      smsCode: smsCode,
      recommendMobile: recommendMobile,
      userNo: app.user.getuserNo(),
      verificationCodeType: "2" //0-注册登录修改密码 1-提现 2-绑定手机号
    }
    if ((recommendMobile == "") || (app.checknumalphabet(recommendMobile))) {
      app.req.req(url, data, null, function (res) {
        if (res) {
          if ("0" == res.retCode) {
            app.toast.show("绑定成功")
            app.user.setmoblie(mobile)
            _self.data.bindingphone.visible = false;
            var showandhide;
            // 检测推荐码是否填写
            if (data.recommendMobile){
              showandhide = false;
            }else{
              showandhide = true;
            }
            _self.setData({
              bindingphone: _self.data.bindingphone,
              yimaokeshow: shouandhide
            })
          } else {
            app.toast.show(res.retMsg)
          }
        } else {
          app.toast.show("绑定失败")
        }
      })
    } else {
      app.toast.show("推荐码或推荐手机号不合法，请检查后再提交！")
    }
  }
})