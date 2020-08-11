
var BrowserUtil = require('BrowserUtil');
var helper      = require('Helper');

cc.Class({
	extends: cc.Component,

	properties: {
		header: {
			default: null,
			type: cc.Node,
		},
		body: {
			default: null,
			type: cc.Node,
		},
		NhanhMang: {
			default: null,
			type: cc.Label,
		},
		MenhGia: {
			default: null,
			type: cc.Label,
		},
		SoThe: {
			default: null,
			type: cc.EditBox,
		},
		SoSeri: {
			default: null,
			type: cc.EditBox,
		},
		moreNhaMang: {
			default: null,
			type: cc.Node,
		},
		moreMenhGia: {
			default: null,
			type: cc.Node,
		},
		scrollviewNhaMang: {
			default: null,
			type: cc.ScrollView,
		},
		scrollviewMenhGia: {
			default: null,
			type: cc.ScrollView,
		},
		bangGia: {
			default: null,
			type: cc.ScrollView,
		},
		prefabLeft: {
			default: null,
			type: cc.Node,
		},
		prefabRight: {
			default: null,
			type: cc.Prefab,
		},
		captcha: {
			default: null,
			type: cc.EditBox,
		},
		capchaSprite: cc.Sprite,
	},
	init(){
		var self = this;
		this.isLoaded = false;
		this.editboxs = [this.SoThe, this.SoSeri, this.captcha];
		this.keyHandle = function(t) {
			return t.keyCode === cc.macro.KEY.tab ? (self.isTop() && self.changeNextFocusEditBox(),
				t.preventDefault && t.preventDefault(),
				!1) : t.keyCode === cc.macro.KEY.enter ? (BrowserUtil.focusGame(), self.onNapClick(),
				t.preventDefault && t.preventDefault(),
				!1) : void 0
		}
		Promise.all(this.header.children.map(function(obj) {
			return obj.getComponent('itemContentMenu');
		}))
		.then(result => {
			this.header = result;
		});
	},
	onEnable: function () {
		cc.sys.isBrowser && this.addEvent();
		this.reCaptcha();
		if(!this.isLoaded) {
			cc.RedT.send({shop:{info_nap: true}})
		}
	},
	onDisable: function () {
		this.moreNhaMang.active = this.moreMenhGia.active = false;
		cc.sys.isBrowser && this.removeEvent();
		this.clean();
	},
	addEvent: function() {
		cc.systemEvent.on(cc.SystemEvent.EventType.KEY_DOWN, this.onKeyDown, this);
		for (var t in this.editboxs) {
			BrowserUtil.getHTMLElementByEditBox(this.editboxs[t]).addEventListener("keydown", this.keyHandle, !1)
		}
	},
	removeEvent: function() {
		for (var t in this.editboxs) {
			BrowserUtil.getHTMLElementByEditBox(this.editboxs[t]).removeEventListener("keydown", this.keyHandle, !1)
		}
		cc.systemEvent.off(cc.SystemEvent.EventType.KEY_DOWN, this.onKeyDown, this);
	},
	onKeyDown: function (event) {
		switch(event.keyCode) {
			case cc.macro.KEY.tab:
				this.isTop() && this.changeNextFocusEditBox();
				break;
			case cc.macro.KEY.enter:
				this.isTop() && this.onNapClick();
		}
	},
	changeNextFocusEditBox: function() {
		for (var t = !1, e = 0, i = this.editboxs.length; e < i; e++){
            if (BrowserUtil.checkEditBoxFocus(this.editboxs[e])) {
                BrowserUtil.focusEditBox(this.editboxs[e]);
                t = !0;
                break
            }
        }
        !t && 0 < this.editboxs.length && BrowserUtil.focusEditBox(this.editboxs[0]);
	},
	isTop: function() {
		return !this.moreNhaMang.active && !this.moreMenhGia.active && !cc.RedT.inGame.notice.node.active && !cc.RedT.inGame.loading.active;
	},
	clean: function(){
		this.SoThe.string = this.SoSeri.string = this.captcha.string = '';
	},
	onNapClick: function(){
		if (this.SoThe.string.length < 11 || this.SoSeri.string.length < 11) {
			cc.RedT.inGame.notice.show({title: "NẠP KUN", text: "Thông Tin không hợp lệ..."})
		}else if(helper.isEmpty(this.captcha.string)){
            cc.RedT.inGame.notice.show({title: "NẠP KUN", text: "Vui lòng nhập chính xác mã xác nhận."})
		}else{
			cc.RedT.inGame.bgLoading.onData({active: true, text: 'Đang gửi dữ liệu...'});
			cc.RedT.send({shop:{nap_the:{nhamang: this.NhanhMang.string, menhgia: helper.getOnlyNumberInString(this.MenhGia.string), mathe: this.SoThe.string, seri:this.SoSeri.string, captcha: this.captcha.string}}});
		}
	},
	onSelectHead: function(event, name){
		Promise.all(this.header.map(function(header) {
			if (header.node.name == name) {
				header.select();
			}else{
				header.unselect();
			}
		}));
		Promise.all(this.body.children.map(function(body) {
			if (body.name == name) {
				body.active = true;
			}else{
				body.active = false;
			}
		}));
	},
	toggleMoreNhaMang: function(){
		this.moreNhaMang.active = !this.moreNhaMang.active;
		this.moreMenhGia.active = !1;
	},

	hideMoreNhaMang: function(){
		this.moreNhaMang.active = false;
		this.moreMenhGia.active = false;
	},
	toggleMoreMenhGia: function(){
		this.moreMenhGia.active = !this.moreMenhGia.active;
	},
	infoSet: function(data, i_arg, i_text, nhamang = false){
		var self = this;
		if (data.length > 0) {
			Promise.all(data.map(function(obj, index){
				var item = cc.instantiate(self.prefabLeft);
				var componentLeft = item.getComponent('NapRed_itemOne');
				componentLeft.init(self, i_arg, i_text)
				if (nhamang) {
					if (index == 0) {
						componentLeft.background.active = true;
						self.NhanhMang.string = obj.name
					}
					componentLeft.text.string = obj.name;
					self.scrollviewNhaMang.content.addChild(item);
				}else{
					var name  = helper.numberWithCommas(obj.name);
					var value = helper.numberWithCommas(obj.values);
					if (index == 0) {
						componentLeft.background.active = true;
						self.MenhGia.string = name;
					}
					componentLeft.text.string = name;
					self.scrollviewMenhGia.content.addChild(item);
					var itemR = cc.instantiate(self.prefabRight);
					itemR.getComponent('NapRed_itemTT').init(name, value);
					self.bangGia.content.addChild(itemR);
				}
				return componentLeft;
			}))
			.then(result => {
				this[i_arg] = result;
			})
		}
	},
	onData: function(data){
		if (void 0 !== data.info && !this.isLoaded){
			this.isLoaded = true;
			if (void 0 !== data.info.nhamang){
				this.infoSet(data.info.nhamang, "nhamangList", "NhanhMang", true);
			}
			if (void 0 !== data.info.menhgia){
				this.infoSet(data.info.menhgia, "menhgiaList", "MenhGia");
			}
		}
	},
	initCaptcha: function(t) {
		var i = this
		  , o = new Image;
		o.src = t,
		o.width = 150,
		o.height = 50,
		setTimeout(function() {
			var t = new cc.Texture2D;
			t.initWithElement(o),
			t.handleLoadedTexture();
			var e = new cc.SpriteFrame(t);
			i.capchaSprite.spriteFrame = e
		}, 10)
	},
	reCaptcha: function(){
		cc.RedT.send({captcha: 'chargeCard'});
	},
});
