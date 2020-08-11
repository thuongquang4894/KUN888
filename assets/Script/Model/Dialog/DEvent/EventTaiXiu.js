
var helper = require('Helper');

cc.Class({
	extends: cc.Component,

	properties: {
		menu:    cc.Node,
		content: cc.Node,
		item:    cc.Prefab,
		itemHT:  cc.Prefab,
		contentNowLeft:  cc.Node,
		contentNowRight: cc.Node,
		contentHQLeft:   cc.Node,
		contentHQRight:  cc.Node,

		LabelDate:     cc.Label,
		LabelDateMore: cc.Label,
		nodeDateMore:  cc.Node,
		dataOld: false,
	},
	onLoad: function () {
		this.dateTop = new Date();
		this.dateTop.setDate(this.dateTop.getDate()-1);
		let stringTime = this.dateTop.getDate() + '/' + helper.numberPad(this.dateTop.getMonth()+1, 2) + '/' + this.dateTop.getFullYear();
		this.LabelDate.string = this.LabelDateMore.string = stringTime;
	},
	selectEvent: function(event) {
		this.nodeDateMore.active = false;
		if (event.target.name == "top") {
			this.onGetTop();
		}else if (event.target.name == "homqua") {
			this.onGetHomQua();
		}
		Promise.all(this.menu.children.map(function(menu){
			if (menu.name == event.target.name) {
				menu.children[0].active = true;
				menu.children[1].color  = cc.Color.BLACK;
			}else{
				menu.children[0].active = false;
				menu.children[1].color  = cc.Color.WHITE;
			}
		}));
		Promise.all(this.content.children.map(function(content){
			if (content.name == event.target.name) {
				content.active = true;
			}else{
				content.active = false;
			}
		}));
	},
	onGetTop: function(){
		cc.RedT.send({event:{taixiu:{getTop: true}}});
	},
	onGetHomQua: function(){
		!this.dataOld && cc.RedT.send({event:{taixiu:{getTopHQ: this.LabelDate.string}}});
	},
	dateToggle: function(){
		this.nodeDateMore.active = !this.nodeDateMore.active;
	},
	datePlus: function(){
		let test = test = new Date(this.dateTop);
		test.setDate(test.getDate()+2);
		if (new Date() > test) {
			this.dateTop.setDate(this.dateTop.getDate()+1);
			this.LabelDateMore.string = helper.numberPad(this.dateTop.getDate(), 2) + '/' + helper.numberPad(this.dateTop.getMonth()+1, 2) + '/' + this.dateTop.getFullYear();
		}
	},
	dateMinus: function(){
		this.dateTop.setDate(this.dateTop.getDate()-1);
		this.LabelDateMore.string = helper.numberPad(this.dateTop.getDate(), 2) + '/' + helper.numberPad(this.dateTop.getMonth()+1, 2) + '/' + this.dateTop.getFullYear();
	},
	dateView: function(){
		if (this.LabelDateMore.string != this.LabelDate.string) {
			this.dataOld = false;
			this.LabelDate.string = this.LabelDateMore.string;
			this.onGetHomQua();
		}
		this.nodeDateMore.active = false;
	},
	onData: function(data){
		if (!!data.topHT) {
			this.topHT(data.topHT);
		}
		if (!!data.topHQ) {
			this.dataOld = true;
			this.topHQ(data.topHQ);
		}
	},
	topHT: function(data){
		this.contentNowLeft.removeAllChildren();
		this.contentNowRight.removeAllChildren();
		var self = this;
		data.win = data.win.sort(function(a,b){
			return a.top - b.top;
		});
		Promise.all(data.win.map(function(user, index){
			var item = cc.instantiate(self.itemHT);
            var item = item.getComponent('EventTaiXiu_item');
            item.top.string         = index+1;
            item.users.string       = user.name;
            item.day.string         = user.top;
            item.node.children[0].active = !(index&1);
            self.contentNowLeft.addChild(item.node);
		}));
		data.lost = data.lost.sort(function(a,b){
			return a.top - b.top;
		});
		Promise.all(data.lost.map(function(user, index){
			var item = cc.instantiate(self.itemHT);
            var item = item.getComponent('EventTaiXiu_item');
            item.top.string         = index+1;
            item.users.string       = user.name;
            item.day.string         = user.top;
            item.node.children[0].active = !(index&1);
            self.contentNowRight.addChild(item.node);
		}));
	},

	topHQ: function(data){
		this.contentHQLeft.removeAllChildren();
		this.contentHQRight.removeAllChildren();
		var self = this;
		data.win = data.win.sort(function(a,b){
			return a.top - b.top;
		});
		Promise.all(data.win.map(function(user, index){
			var item = cc.instantiate(self.item);
            var item = item.getComponent('EventTaiXiu_item');
            item.top.string   = user.top;
            item.users.string = user.name;
            item.day.string   = user.line;
            item.gift.string  = helper.numberWithCommas(user.reward);
            item.node.children[0].active = !(index&1);
            self.contentHQLeft.addChild(item.node);
		}));

		data.lost = data.lost.sort(function(a,b){
			return a.top - b.top;
		});
		Promise.all(data.lost.map(function(user, index){
			var item = cc.instantiate(self.item);
            var item = item.getComponent('EventTaiXiu_item');
            item.top.string   = user.top;
            item.users.string = user.name;
            item.day.string   = user.line;
            item.gift.string  = helper.numberWithCommas(user.reward);
            item.node.children[0].active = !(index&1);
            self.contentHQRight.addChild(item.node);
		}));
	},
});
