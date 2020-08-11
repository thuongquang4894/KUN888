
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
		nickname: {
			default: null,
			type: cc.EditBox,
		},
		renickname: {
			default: null,
			type: cc.EditBox,
		},
		red: {
			default: null,
			type: cc.EditBox,
		},
		messenger: {
			default: null,
			type: cc.EditBox,
		},
		otp: {
			default: null,
			type: cc.EditBox,
		},
		rednhan: {
			default: null,
			type: cc.Label,
		},
		scrollview: {
			default: null,
			type: cc.ScrollView,
		},
		prefabDaiLy: {
			default: null,
			type: cc.Prefab,
		},
		typeOTP: '',
	},
	init(){
		this.isdaily = false;
		this.meDaily = false;
		this.daily_list = [];
		var self = this;
		this.isLoaded = false;

		this.editboxs = [this.nickname, this.renickname, this.red, this.messenger, this.otp];
		this.keyHandle = function(t) {
			return t.keyCode === cc.macro.KEY.tab ? (self.isTop() && self.changeNextFocusEditBox(),
				t.preventDefault && t.preventDefault(),
				!1) : t.keyCode === cc.macro.KEY.enter ? (BrowserUtil.focusGame(), self.onChuyenClick(),
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
		this.reCheckMeDL();
		cc.sys.isBrowser && this.addEvent();
		if(!this.isLoaded) {
			cc.RedT.send({shop:{get_daily: true}});
		}
	},
	onDisable: function () {
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
				this.isTop() && this.onChuyenClick();
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
		return !cc.RedT.inGame.notice.node.active && !cc.RedT.inGame.loading.active;
	},
	clean: function(){
		this.nickname.string = this.renickname.string = this.red.string = this.messenger.string = this.rednhan.string = "";
		Promise.all(this.daily_list.map(function(obj){
			obj.bg.active = false;
		}))
	},
	onChuyenClick: function(){
		console.log("vao?????????????", 18);
		var error = null;
		if(helper.isEmpty(this.nickname.string) ||
			helper.isEmpty(this.renickname.string) ||
			helper.isEmpty(this.red.string))
		{
			error = "Kiểm tra lại các thông tin..."
		} else if(helper.isEmpty(this.nickname.string) || helper.isEmpty(this.renickname.string)){
			error = "Tên nhân vật không được bỏ trống"
		} else if (this.nickname.string != this.renickname.string) {
			error = "Tên nhân vật không khớp.!!"
		} else if(helper.getOnlyNumberInString(this.red.string) < 10000){
			error = "Số tiền chuyển tối thiểu là 10.000 KUN."
		} else if(helper.isEmpty(this.otp.string)){
			error = "Vui lòng nhập mã OTP."
		}
		if (error)
			cc.RedT.inGame.notice.show({title: "CHUYỂN KUN", text: error});
		else{
			var data = {name:this.nickname.string, red:helper.getOnlyNumberInString(this.red.string), otp:this.otp.string};
			if (!helper.isEmpty(this.messenger.string.trim())) {
				data = Object.assign(data, {message: this.messenger.string});
			}
			cc.RedT.send({shop:{chuyen_red: data}});
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
	onDaiLy: function(data){
		if (data.length) {
			var self  = this;
			self.scrollview.content.removeAllChildren();//remove all children
			this.clean();
			var regex = new RegExp("^" + cc.RedT.user.name + "$", 'i');
			Promise.all(data.map(function(daily, index){
				!self.meDaily && (self.meDaily = regex.test(daily.nickname));
				var item = cc.instantiate(self.prefabDaiLy);
				var component = item.getComponent('ChuyenRed_daily');
				component.init(self, daily, index);
				self.scrollview.content.addChild(item);
				return component;
			}))
			.then(result => {
				this.daily_list = result;
			})
		}
	},
	reCheckMeDL: function(){
		this.meDaily = false;
		if (this.daily_list.length) {
			var self  = this;
			var regex = new RegExp("^" + cc.RedT.user.name + "$", 'i');
			Promise.all(this.daily_list.map(function(daily){
				!self.meDaily && (self.meDaily = regex.test(daily.NICKNAME.string));
			}))
		}
	},
	onData: function(data) {
		if (void 0 !== data.daily && !this.isLoaded){
			this.isLoaded = true;
			this.onDaiLy(data.daily);
		}
	},
	selectDaiLy: function(daily){
		var self = this;
		Promise.all(this.daily_list.map(function(obj){
			if (obj == daily) {
				self.isdaily  = true;
				obj.bg.active = true;
				self.nickname.string = self.renickname.string = obj.NICKNAME.string;
				self.onChangerRed(0, true);
			}else{
				obj.bg.active = false;
			}
		}))
	},
	onChangerNick: function(value){
		this.isdaily = false;
		if (this.daily_list.length > 0) {
			var self = this;
			Promise.all(this.daily_list.map(function(obj){
				var regex = new RegExp("^" + value + "$", 'i');
				if (regex.test(obj.NICKNAME.string)) {
					self.isdaily  = true;
					obj.bg.active = true;
				}else{
					obj.bg.active = false;
				}
			}))
		}
		this.onChangerRed(0, true);
	},
	onChangerRed: function(value = 0, superT = false){
		value = !!superT ? this.red.string : value;
		value = helper.numberWithCommas(helper.getOnlyNumberInString(value));
		this.red.string = value == 0 ? "" : value;
		if(this.isdaily || this.meDaily){
			this.rednhan.string = value
		}else{
			var valueT = helper.getOnlyNumberInString(value);
			this.rednhan.string = helper.numberWithCommas(Math.floor(valueT-valueT*2/100))
		}
	},
	onClickOTP: function(){
		cc.RedT.send({otp:{type: this.typeOTP}});
	},
	changerTypeOTP: function(e){
		this.typeOTP = e.node.name;
	},
});
