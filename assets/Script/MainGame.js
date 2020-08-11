
var helper = require('Helper');
import facebookSdk from "Facebook";
var baseControll = require('BaseControll');

var header = require('Header'),
	dialog = require('Dialog'),
	ThongBaoNoHu = require('PushNohu'),
	newsContents = require('NewsContents'),
	bgLoading = require('bgLoading'),
	MenuRoom = require('MenuRoom'),
	notice = require('Notice');

cc.Class({
	extends: cc.Component,
	properties: {
		MenuRoom: MenuRoom,
		PrefabT: {
			default: [],
			type: cc.Prefab
		},
		header: header,
		news: cc.Node,
		newsContents: newsContents,
		bgLoading: bgLoading,
		iconVQRed: cc.Node,
		iconVQRedTemp: cc.Node,
		iconCandy: cc.Node,
		iconCandyTemp: cc.Node,
		iconLongLan: cc.Node,
		iconLongLanTemp: cc.Node,
		iconTaiXiu: cc.Node,
		iconTaiXiuTemp: cc.Node,
		iconMegaJ: cc.Node,
		iconMegaJTemp: cc.Node,
		redhat: cc.Node,
		redhatTemp: cc.Node,
		dialog: dialog,
		loading: cc.Node,
		notice: notice,
		ThongBaoNoHu: ThongBaoNoHu,

		audioBG: cc.AudioSource,
		wssCacert: {
			type: cc.Asset,
			default: null
		},
		url: cc.String,
		appApk: cc.String,
	},
	onLoad: function () {
		document.cookie = "kun88=1702;path=/";
		if (!cc.RedT) {
			cc.RedT = baseControll;
			cc.RedT.sslPem = this.wssCacert;
			cc.RedT.init();
			cc.RedT.audio = this.PrefabT[0].data.getComponent('MainAudio');
		}
		// Connect Server
		cc.RedT.reconnect();

		this.dialog.init();
		this.newsContents.init(this);
		cc.RedT.inGame = this;

		var MiniPanel = cc.instantiate(this.PrefabT[1]);
		cc.RedT.MiniPanel = MiniPanel.getComponent('MiniPanel');
		this.redhat.insertChild(MiniPanel);

		this.iconCandy = this.iconCandy.getComponent('iconGameHu');
		this.iconVQRed = this.iconVQRed.getComponent('iconGameHu');
		this.iconLongLan = this.iconLongLan.getComponent('iconGameHu');
		this.iconTaiXiu = this.iconTaiXiu.getComponent('iconGameTaiXiu');

		this.iconCandyTemp = this.iconCandyTemp.getComponent('iconGameHu');
		this.iconVQRedTemp = this.iconVQRedTemp.getComponent('iconGameHu');
		this.iconLongLanTemp = this.iconLongLanTemp.getComponent('iconGameHu');
		this.iconTaiXiuTemp = this.iconTaiXiuTemp.getComponent('iconGameTaiXiu');

		if (cc.RedT.IS_LOGIN) {
			cc.RedT.send({ scene: "home" });
			this.header.reset();
			this.header.userName.string = cc.RedT.user.name;
			this.dialog.profile.CaNhan.username.string = cc.RedT.user.name;
			this.header.userRed.string = this.dialog.profile.KetSat.redHT.string = helper.numberWithCommas(cc.RedT.user.red);
			this.header.userXu.string = helper.numberWithCommas(cc.RedT.user.xu);
			this.dialog.profile.KetSat.redKet.string = helper.numberWithCommas(cc.RedT.user.ketSat);
			this.dialog.profile.CaNhan.UID.string = cc.RedT.user.UID;
			this.dialog.profile.CaNhan.phone.string = cc.RedT.user.phone;
			this.dialog.profile.CaNhan.email.string = cc.RedT.user.email;
			this.dialog.profile.CaNhan.joinedOn.string = helper.getStringDateByTime(cc.RedT.user.joinedOn);
		} else {
			this.dialog.settings.setMusic();
		}
		var check = localStorage.getItem('SOUND_BACKGROUND');
		if (check == null || cc.RedT.isSoundBackground()) {
			cc.RedT.setSoundBackground(true);
			this.playMusic();
		}
	},
	auth: function (obj) {
		var self = this;
		this.loading.active = true;
		//cc.RedT.reconnect();
		if (cc.RedT._socket == null || cc.RedT._socket.readyState != 1) {
			setTimeout(function () {
				cc.RedT.send(obj);
			}, 300);
		} else {
			cc.RedT.send(obj)
		}
	},
	unAuthorized: function (data) {
		this.loading.active = false;
		if (void 0 !== data["message"]) {
			this.notice.show({ title: 'ĐĂNG KÝ', text: 'Có lỗi sảy ra, xin vui lòng thử lại...' });
		} else {
			this.notice.show(data);
		}
	},
	Authorized: function (Authorized) {
		this.loading.active = false;
		if (!Authorized) {
			this.dialog.showSignName();
		} else {
			this.signIn();
		}
	},
	onData: function (data) {
		if (void 0 !== data["unauth"]) {
			this.unAuthorized(data["unauth"]);
		}
		if (void 0 !== data.Authorized) {
			this.Authorized(data.Authorized);
		}
		if (void 0 !== data.user) {
			this.dataUser(data.user);
			cc.RedT.userData(data.user);
		}
		if (void 0 !== data.mini) {
			cc.RedT.MiniPanel.onData(data.mini);
		}
		if (void 0 !== data.TopHu) {
			cc.RedT.MiniPanel.TopHu.onData(data.TopHu);
			this.dialog.DEvent.onHU(data.TopHu);
		}
		if (void 0 !== data.taixiu) {
			cc.RedT.MiniPanel.TaiXiu.TX_Main.onData(data.taixiu);
		}
		if (void 0 !== data.shop) {
			this.dialog.shop.onData(data.shop);
		}
		if (void 0 !== data.profile) {
			this.dialog.profile.onData(data.profile);
		}
		if (void 0 !== data.notice) {
			this.notice.show(data.notice);
		}
		if (void 0 !== data.news) {
			this.newsContents.onData(data.news);
		}
		if (void 0 !== data.captcha) {
			this.captcha(data.captcha);
		}
		if (void 0 !== data.pushnohu) {
			this.ThongBaoNoHu.onData(data.pushnohu);
		}
		if (void 0 !== data.loading) {
			this.bgLoading.onData(data.loading);
		}
		if (void 0 !== data.event) {
			this.dialog.DEvent.onData(data.event);
		}
		if (!!data.toGame) {
			this.MenuRoom.onData(data.toGame);
		}
		if (!!data.message) {
			this.dialog.iMessage.onData(data.message);
		}
	},
	captcha: function (data) {
		switch (data.name) {
			case "signUp":
				this.dialog.signUp.initCaptcha(data.data);
				break;

			case "giftcode":
				this.dialog.GiftCode.initCaptcha(data.data);
				break;

			case "forgotpass":
				this.dialog.ForGotPass.initCaptcha(data.data);
				break;

			case "chargeCard":
				this.dialog.shop.NapRed.initCaptcha(data.data);
				break;

			case "withdrawXu":
				this.dialog.shop.TieuRed.MuaXu.initCaptcha(data.data);
				break;
		}
	},
	dataUser: function (data) {
		if (void 0 !== data.name) {
			this.header.userName.string = data.name;
			this.dialog.profile.CaNhan.username.string = data.name;
		}
		if (void 0 !== data.red) {
			this.header.userRed.string = this.dialog.profile.KetSat.redHT.string = helper.numberWithCommas(data.red);
		}
		if (void 0 !== data.xu) {
			this.header.userXu.string = helper.numberWithCommas(data.xu);
		}
		if (void 0 !== data.ketSat) {
			this.dialog.profile.KetSat.redKet.string = helper.numberWithCommas(data.ketSat);
		}
		if (void 0 !== data.UID) {
			this.dialog.profile.CaNhan.UID.string = data.UID;
		}
		if (void 0 !== data.phone) {
			this.dialog.profile.CaNhan.phone.string = data.phone;
			this.dialog.profile.BaoMat.DangKyOTP.statusOTP(!helper.isEmpty(data.phone));
			if (!helper.isEmpty(data.phone)) {
				this.dialog.profile.BaoMat.DangKyOTP.labelPhone.string = data.phone;
				cc.sys.localStorage.setItem('infoRed8', JSON.stringify(data));
			}
		}
		if (void 0 !== data.email) {
			this.dialog.profile.CaNhan.email.string = data.email;
			if (!helper.isEmpty(data.email)) {
				this.dialog.profile.BaoMat.DangKyOTP.labelEmail.string = data.email;
			}
		}
		if (void 0 !== data.cmt) {
			this.dialog.profile.CaNhan.cmt.string = data.cmt;
			if (!helper.isEmpty(data.cmt)) {
				this.dialog.profile.BaoMat.DangKyOTP.labelCMT.string = data.cmt;
			}
		}
		if (void 0 !== data.joinedOn) {
			this.dialog.profile.CaNhan.joinedOn.string = helper.getStringDateByTime(data.joinedOn);
		}
		if (void 0 !== data.level) {
			this.header.level(data.level);
			this.header.updateEXP(data.vipHT, data.vipNext);
		}
	},
	signOut: function () {
		cc.RedT.user = {};
		cc.RedT.IS_LOGIN = false;
		this.AllReset();
		cc.sys.localStorage.removeItem("infoRed8");
	},
	signIn: function () {
		cc.RedT.IS_LOGIN = true;
		this.header.isSignIn();
		this.dialog.onBack();
		cc.RedT.MiniPanel.signIn();
	},
	AllReset: function () {
		this.loading.active = false;
		this.newsContents.reset();
		this.header.isSignOut();
		this.dialog.onCloseDialog();
		this.MenuRoom.onBack();
		cc.RedT.MiniPanel.newGame();
		this.dialog.iMessage.reset();
	},
	onGetTaiXiu: function (tai, xiu) {
		if(this.iconTaiXiu.tai == null || this.iconTaiXiu.xiu == null) return;
		var sTai = helper.getOnlyNumberInString(this.iconTaiXiu.tai.string);
		var sXiu = helper.getOnlyNumberInString(this.iconTaiXiu.xiu.string);
		if (sTai - tai != 0) {
			helper.numberTo(this.iconTaiXiu.tai, sTai, tai, 1000, true);
		}
		if (sXiu - xiu != 0) {
			helper.numberTo(this.iconTaiXiu.xiu, sXiu, xiu, 1000, true);
		}
	},
	onGetHu: function () {
		if (void 0 !== cc.RedT.setting.topHu.data) {
			var self = this;
			// Vương Quốc Red
			Promise.all(cc.RedT.setting.topHu.data['vq_red'].filter(function (temp) {
				return temp.red == true;
			}))
				.then(result => {
					let h100 = result.filter(function (temp) { return temp.type == 100 });
					let h1k = result.filter(function (temp) { return temp.type == 1000 });
					let h10k = result.filter(function (temp) { return temp.type == 10000 });

					let r100 = helper.getOnlyNumberInString(this.iconVQRed.hu100.string);
					let r1k = helper.getOnlyNumberInString(this.iconVQRed.hu1k.string);
					let r10k = helper.getOnlyNumberInString(this.iconVQRed.hu10k.string);

					if (r100 - h100[0].bet != 0) {
						helper.numberTo(this.iconVQRed.hu100, helper.getOnlyNumberInString(this.iconVQRed.hu100.string), h100[0].bet, 4900, true);
						helper.numberTo(this.iconVQRedTemp.hu100, helper.getOnlyNumberInString(this.iconVQRedTemp.hu100.string), h100[0].bet, 4900, true);

					}
					if (r1k - h1k[0].bet != 0) {
						helper.numberTo(this.iconVQRed.hu1k, helper.getOnlyNumberInString(this.iconVQRed.hu1k.string), h1k[0].bet, 4900, true);
						helper.numberTo(this.iconVQRedTemp.hu1k, helper.getOnlyNumberInString(this.iconVQRedTemp.hu1k.string), h1k[0].bet, 4900, true);
					}
					if (r10k - h10k[0].bet != 0) {
						helper.numberTo(this.iconVQRed.hu10k, helper.getOnlyNumberInString(this.iconVQRed.hu10k.string), h10k[0].bet, 4900, true);
						helper.numberTo(this.iconVQRedTemp.hu10k, helper.getOnlyNumberInString(this.iconVQRedTemp.hu10k.string), h10k[0].bet, 4900, true);
					}
				});

			// Candy
			Promise.all(cc.RedT.setting.topHu.data['candy'].filter(function (temp) {
				return temp.red == true;
			}))
				.then(result => {
					let h100 = result.filter(function (temp) { return temp.type == 100 });
					let h1k = result.filter(function (temp) { return temp.type == 1000 });
					let h10k = result.filter(function (temp) { return temp.type == 10000 });

					let r100 = helper.getOnlyNumberInString(this.iconCandy.hu100.string);
					let r1k = helper.getOnlyNumberInString(this.iconCandy.hu1k.string);
					let r10k = helper.getOnlyNumberInString(this.iconCandy.hu10k.string);

					if (r100 - h100[0].bet != 0) {
						helper.numberTo(this.iconCandy.hu100, helper.getOnlyNumberInString(this.iconCandy.hu100.string), h100[0].bet, 4900, true);
						helper.numberTo(this.iconCandyTemp.hu100, helper.getOnlyNumberInString(this.iconCandyTemp.hu100.string), h100[0].bet, 4900, true);
					}
					if (r1k - h1k[0].bet != 0) {
						helper.numberTo(this.iconCandy.hu1k, helper.getOnlyNumberInString(this.iconCandy.hu1k.string), h1k[0].bet, 4900, true);
						helper.numberTo(this.iconCandyTemp.hu1k, helper.getOnlyNumberInString(this.iconCandyTemp.hu1k.string), h1k[0].bet, 4900, true);
					}
					if (r10k - h10k[0].bet != 0) {
						helper.numberTo(this.iconCandy.hu10k, helper.getOnlyNumberInString(this.iconCandy.hu10k.string), h10k[0].bet, 4900, true);
						helper.numberTo(this.iconCandyTemp.hu10k, helper.getOnlyNumberInString(this.iconCandyTemp.hu10k.string), h10k[0].bet, 4900, true);
					}
				});

			// Long Lan
			Promise.all(cc.RedT.setting.topHu.data['long'].filter(function (temp) {
				return temp.red == true;
			}))
				.then(result => {
					let h100 = result.filter(function (temp) { return temp.type == 100 });
					let h1k = result.filter(function (temp) { return temp.type == 1000 });
					let h10k = result.filter(function (temp) { return temp.type == 10000 });

					let r100 = helper.getOnlyNumberInString(this.iconLongLan.hu100.string);
					let r1k = helper.getOnlyNumberInString(this.iconLongLan.hu1k.string);
					let r10k = helper.getOnlyNumberInString(this.iconLongLan.hu10k.string);

					if (r100 - h100[0].bet != 0) {
						helper.numberTo(this.iconLongLan.hu100, helper.getOnlyNumberInString(this.iconLongLan.hu100.string), h100[0].bet, 4900, true);
						helper.numberTo(this.iconLongLanTemp.hu100, helper.getOnlyNumberInString(this.iconLongLanTemp.hu100.string), h100[0].bet, 4900, true);
					}
					if (r1k - h1k[0].bet != 0) {
						helper.numberTo(this.iconLongLan.hu1k, helper.getOnlyNumberInString(this.iconLongLan.hu1k.string), h1k[0].bet, 4900, true);
						helper.numberTo(this.iconLongLanTemp.hu1k, helper.getOnlyNumberInString(this.iconLongLanTemp.hu1k.string), h1k[0].bet, 4900, true);
					}
					if (r10k - h10k[0].bet != 0) {
						helper.numberTo(this.iconLongLan.hu10k, helper.getOnlyNumberInString(this.iconLongLan.hu10k.string), h10k[0].bet, 4900, true);
						helper.numberTo(this.iconLongLanTemp.hu10k, helper.getOnlyNumberInString(this.iconLongLanTemp.hu10k.string), h10k[0].bet, 4900, true);
					}
				});

			/*
			// MegaJacpot
			Promise.all(cc.RedT.setting.topHu.data['megaj'].filter(function(temp){
				return temp.red == true;
			}))
			.then(result => {
				let h100 = result.filter(function(temp){return temp.type == 100});
				let h1k  = result.filter(function(temp){return temp.type == 1000});
				let h10k = result.filter(function(temp){return temp.type == 10000});

				let r100 = helper.getOnlyNumberInString(this.iconMegaJ.hu100.string);
				let r1k  = helper.getOnlyNumberInString(this.iconMegaJ.hu1k.string);
				let r10k = helper.getOnlyNumberInString(this.iconMegaJ.hu10k.string);

				if (r100-h100[0].bet != 0) {
					helper.numberTo(this.iconMegaJ.hu100, helper.getOnlyNumberInString(this.iconMegaJ.hu100.string), h100[0].bet, 4900, true);
				}
				if (r1k-h1k[0].bet != 0) {
					helper.numberTo(this.iconMegaJ.hu1k, helper.getOnlyNumberInString(this.iconMegaJ.hu1k.string), h1k[0].bet, 4900, true);
				}
				if (r10k-h10k[0].bet != 0) {
					helper.numberTo(this.iconMegaJ.hu10k, helper.getOnlyNumberInString(this.iconMegaJ.hu10k.string), h10k[0].bet, 4900, true);
				}
			});
			*/
		}
	},
	playMusic: function () {
		this.audioBG.play();
	},
	pauseMusic: function () {
		this.audioBG.pause();
	},
	resumeMusic: function () {
		//cc.audioEngine.resumeMusic();
	},
	audioClick: function () {
		cc.RedT.audio.playClick();
	},
	audioUnClick: function () {
		cc.RedT.audio.playUnClick();
	},
	fanpage: function () {
		cc.sys.openURL('https://www.facebook.com/kun888club');
	},
	ios: function () {
		cc.sys.openURL(this.url + '/help/ios');
	},
	android: function () {
		cc.sys.openURL(this.url + '/download/' + this.appApk);
	},
	telegram: function () {
		cc.sys.openURL("https://t.me/kun888_bot");
	},

	isUseSDK()
    {
        if (cc.sys.os == cc.sys.OS_ANDROID) return true;
        if (cc.sys.os == cc.sys.OS_IOS) return true;
        return false;
	},
	
	onBtnLoginFb: function () {
		// UIPopupManager.Instance.showLoading();
		if (this.isUseSDK()) {
			if (sdkbox.PluginFacebook.isLoggedIn()) {
				var accessToken = sdkbox.PluginFacebook.getAccessToken();
				// LobbyHubManager.Instance.loginFB();
				cc.log("Đã Login Facebook");
				cc.RedT.inGame.auth({authentication:{accessToken: accessToken}});
			} else {
				cc.log("Bắt đầu Login Facebook");
				sdkbox.PluginFacebook.login(['public_profile', 'email']);
			}
		}
		else {
			// UIPopupManager.Instance.showToast("TÍNH NĂNG ĐANG LÀM11 ");
			let Appid = "202107327855628";
			let scope = 'email,public_profile';


			let sdk = new facebookSdk(Appid, scope, (response) => {
				if (response.status != "200") {
					if (response.response != "wait") {
						cc.log("Lỗi Facebook:" +JSON.stringify(response));
						// UIPopupManager.Instance.hideLoading();
						// UIPopupManager.Instance.showMessage("Lỗi đăng nhập status: " + response.status);
					}

				} else {
					// UserModel.accessToken = response.response.authResponse.accessToken;
					// LobbyHubManager.Instance.loginFB();
					
					cc.log("Login Facebook Thành Công:"+JSON.stringify(response.response));
					var t = response.response.authResponse;
					cc.RedT.inGame.auth({authentication:{accessToken: t.accessToken,userID:t.userID}});
				}



			});
		}
    
	},



checkLoginFacebook: function () {
	if (cc.sys.isBrowser && FB) {
		var self = this;
		self.loading.active = true;
		!isInitFB && FB && FB.init({
			appId: "921582025013077",
			autoLogAppEvents: !0,
			xfbml: !0,
			cookie: !0,
			version: "v3.1"
		}),
			FB.getLoginStatus(function (t) {
				if ("connected" === t.status) {
					var e = t.authResponse.userID
						, i = s.LOGIN_FACEBOOK_TYPE
						, o = t.authResponse.accessToken;
					self.loginSocial(e, "", i, o)
				} else
					self.setAutoLogin(!1),
						self.loading.active = false;
			})
	}
},
loginFacebook: function () {
	if (cc.sys.isBrowser && FB) {
		var self = this;
		self.loading.active = true;
		FB && (FB.init({
			appId: "202107327855628",
			autoLogAppEvents: !0,
			xfbml: !0,
			cookie: !0,
			version: "v3.1"
		}),
			FB.login(function (t) {
				console.log(t)
				self.loading.active = false;
				if (t.authResponse) {
					var uid = t.authResponse.userID
						, type = s.LOGIN_FACEBOOK_TYPE
						, token = t.authResponse.accessToken;
					self.loginSocial(uid, "", type, token)
				}
				else
					self.setAutoLogin(!1);
			}
			))
	}
},
loginSocial: function (e, i, o, n, t) {
	var s = this
		, a = {
			social_id: e,
			email: i,
			social_type: o,
			access_token: n,
			register_code: this.getRegisterCode(),
			mkt_code: this.getMarketingCode(),
			device_id: this.getDeviceID(),
			fid: this.getFID()
		};
	t && (a.otp = t);
	this.api.registerSocial(a, function (t) {
		0 === t.data.login_status ? (s.OTPLogin.setLoginFacebook(e, i, o, n),
			s.OTPLogin.clear(),
			s.hideProcessingNode(),
			s.GameCenterUI.showOtpLoginFormNode()) : (s.setAutoLogin(!0),
				s.setAccountType(!0),
				s.initDataAndConnectSFS(t.data),
				s.GameCenterUI.hideOtpLoginFormNode(),
				t.data.user.is_new && c.addTrackCompleteRegistration())
	}, function (t) {
		s.setAutoLogin(!1),
			s.deProcessingNode(),
			s.showDialogMessage(r.LOGIN_TITLE, t.msg)
	})
}

});
