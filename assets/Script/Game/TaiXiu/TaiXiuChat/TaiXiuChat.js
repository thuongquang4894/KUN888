
var helper      = require('Helper');
var BrowserUtil = require('BrowserUtil');

cc.Class({
	extends: cc.Component,
	properties: {
		content: {
			default: null,
			type: cc.ScrollView
		},
		item: {
			default: null,
			type: cc.Prefab
		},
		input: {
			default: null,
			type: cc.EditBox
		},
		layout: {
			default: null,
			type: cc.Layout
		},
		isLoad: false,
	},
	init(obj){
		this.RedT = obj;
		if (void 0 !== cc.RedT.setting.taixiu.chat_active) {
			this.node.active = cc.RedT.setting.taixiu.chat_active;
		}
	},
	onLoad () {
		var self = this;
		this.keyHandle = function(t) {
			return t.keyCode === cc.macro.KEY.tab ? (t.preventDefault && t.preventDefault(),
				!1) : t.keyCode === cc.macro.KEY.enter ? (BrowserUtil.focusGame(), self.onChatClick(),
				t.preventDefault && t.preventDefault(),
				!1) : void 0
		}
	},
	onEnable: function () {
		cc.sys.isBrowser && this.addEvent();
		if (!this.isLoad) {
			this.getData();
		}
	},
	onDisable: function () {
		cc.sys.isBrowser && this.removeEvent();
		this.clean();
	},
	addEvent: function() {
		BrowserUtil.getHTMLElementByEditBox(this.input).addEventListener("keydown", this.keyHandle, !1);
	},
	removeEvent: function() {
		BrowserUtil.getHTMLElementByEditBox(this.input).removeEventListener("keydown", this.keyHandle, !1);
	},
	getData: function(){
		this.isLoad = true;
		cc.RedT.send({taixiu:{getLogChat: true}});
	},
	message: function(data, tobot = false){
		var item = cc.instantiate(this.item)
		var itemComponent = item.getComponent(cc.Label);
		itemComponent.string = data.user + ': ' + data.value;
		var name = item.children[0].getComponent(cc.Label);
		name.string = data.user;
		this.content.content.addChild(item);
		if(tobot && this.layout.node.height > 300 && this.layout.node.height-this.layout.node.position.y-134 < 70){
			setTimeout(function(){
				this.content.scrollToBottom(0.1);
			}.bind(this), 100);
		}
	},
	logs: function(logs){
		if (logs.length) {
			var self = this;
			Promise.all(logs.map(function(message){
				return self.message(message);
			}))
			.then(result => {
				setTimeout(function(){
					this.content.scrollToBottom(0.1);
				}.bind(this), 100);
			})
		}
	},
	onData: function(data){
		if (void 0 !== data.message) {
			this.message(data.message, true);
		}
		if (void 0 !== data.logs) {
			this.logs(data.logs);
		}
	},
	onChatClick: function() {
		if(helper.isEmpty(this.input.string)){
			this.RedT.onData({err: "Nhập nội dung để chat..."});
		}else{
			cc.RedT.send({taixiu:{chat: this.input.string}});
			this.onData({message:{user:cc.RedT.user.name, value:this.input.string}});
			this.clean();
		}
	},
	toggle: function(){
		this.RedT.setTop();
		cc.RedT.audio.playClick();
		this.node.active = cc.RedT.setting.taixiu.chat_active = !this.node.active;
	},
	clean: function(){
		this.input.string = "";
	},
	reset: function(){
		this.content.content.destroyAllChildren();
		this.node.active = false;
	},
});
