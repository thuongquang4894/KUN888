
var helper         = require('Helper'),
	MiniPoker_reel = require('MiniPoker_reel');

cc.Class({
	extends: cc.Component,

	properties: {
		background:     cc.Node,
		buttonSpin:     cc.Node,
		buttonAuto:     cc.Node,
		buttonSpeed:    cc.Node,
		buttonStop:     cc.Node,
		buttonAutoDot:  cc.Node,
		buttonSpeedDot: cc.Node,
		reels: {
			default: [],
			type: MiniPoker_reel,
		},
		buttonCoint: cc.Node,
		nodeRed: {
			default: null,
			type: cc.Node,
		},
		font: {
			default: null,
			type:    cc.BitmapFont
		},
		nodeXu: {
			default: null,
			type: cc.Node,
		},
		bet: {
			default: null,
			type: cc.Node,
		},
		notice: {
			default: null,
			type: cc.Node,
		},
		card:  cc.Prefab,
		cardf: cc.Prefab,
		prefabNotice: {
			default: null,
			type: cc.Prefab,
		},
		phien: cc.Label,
		hu:    cc.Label,
		cuoc:  "",
		isAuto:  false,
		isSpeed: false,
		isSpin:  false,
		red:     true,
	},
	init(obj){
		this.RedT = obj;
		this.Top    = obj.Dialog.MiniPoker_Top;
		this.LichSu = obj.Dialog.MiniPoker_LichSu;
		cc.RedT.setting.minipoker = cc.RedT.setting.minipoker || {};

		this.card.data.getComponent('Card')
		.config()

		var check = localStorage.getItem('minipoker');
		if (check == "true") {
			this.node.active = true;
		}

		if (void 0 === cc.RedT.util.fontEffect) {
			cc.RedT.util.fontEffect = this.font;
		}
		if (void 0 !== cc.RedT.setting.minipoker.position) {
			this.node.position = cc.RedT.setting.minipoker.position;
		}

		if (void 0 !== cc.RedT.setting.minipoker.bet && cc.RedT.setting.minipoker.bet != this.cuoc) {
			this.intChangerBet();
		}
		if (void 0 !== cc.RedT.setting.minipoker.red && this.red != cc.RedT.setting.minipoker.red) {
			this.changerCoint();
		}
		if (void 0 !== cc.RedT.setting.minipoker.isSpeed && this.isSpeed != cc.RedT.setting.minipoker.isSpeed) {
			this.onClickSpeed();
		}
		if (void 0 !== cc.RedT.setting.minipoker.isAuto && this.isAuto != cc.RedT.setting.minipoker.isAuto) {
			this.onClickAuto();
		}
	},
	onLoad () {
		var self = this;
		this.data     = null;
		this.ttOffset = null;

		Promise.all(this.reels.map(function(reel){
			reel.init(self);
		}))
	},
	onEnable: function() {
		this.onGetHu();
		this.background.on(cc.Node.EventType.TOUCH_START,  this.eventStart, this);
		this.background.on(cc.Node.EventType.TOUCH_MOVE,   this.eventMove,  this);
		this.background.on(cc.Node.EventType.TOUCH_END,    this.eventEnd,   this);
		this.background.on(cc.Node.EventType.TOUCH_CANCEL, this.eventEnd,   this);
		this.background.on(cc.Node.EventType.MOUSE_ENTER,  this.setTop,     this);
	},
	onDisable: function() {
		this.background.off(cc.Node.EventType.TOUCH_START,  this.eventStart, this);
		this.background.off(cc.Node.EventType.TOUCH_MOVE,   this.eventMove,  this);
		this.background.off(cc.Node.EventType.TOUCH_END,    this.eventEnd,   this);
		this.background.off(cc.Node.EventType.TOUCH_CANCEL, this.eventEnd,   this);
		this.background.off(cc.Node.EventType.MOUSE_ENTER,  this.setTop,     this);
		this.onCloseGame();
	},
	eventStart: function(e){
		this.setTop();
		this.ttOffset  = cc.v2(e.touch.getLocationX() - this.node.position.x, e.touch.getLocationY() - this.node.position.y)
	},
	eventMove: function(e){
		this.node.position = cc.v2(e.touch.getLocationX() - this.ttOffset.x, e.touch.getLocationY() - this.ttOffset.y)
	},
	eventEnd: function(){
		cc.RedT.setting.minipoker.position = this.node.position;
	},
	openGame:function(){
		cc.RedT.audio.playClick();
		if (cc.RedT.IS_LOGIN){
			this.node.active = !0;
			localStorage.setItem('minipoker', true);
			this.setTop();
		}
		else
			cc.RedT.inGame.dialog.showSignIn();
	},
	closeGame:function(){
		cc.RedT.audio.playUnClick();
		this.node.active = !1;
		localStorage.setItem('minipoker', false);
	},
	random: function(newG = false){
		Promise.all(this.reels.map(function(reel) {
			reel.random(newG)
		}))
	},
	autoSpin: function(){
		this.random();
		Promise.all(this.reels.map(function(reel, index) {
			reel.spin(index)
		}))
	},
	onSpin: function(){
		this.buttonSpin.pauseSystemEvents();
		this.buttonCoint.pauseSystemEvents();
		Promise.all(this.bet.children.map(function(bet){
	    	bet.pauseSystemEvents();
	    }))
	},
	offSpin: function(){
		this.isSpin = false;
		this.buttonStop.active = this.isSpin ? (this.isAuto ? true : false) : false;
		this.buttonSpin.resumeSystemEvents();
		this.buttonCoint.resumeSystemEvents();
		Promise.all(this.bet.children.map(function(bet){
			var oT = bet.children[0].active;
			if(!oT) bet.resumeSystemEvents();
    	}))
	},
	spin: function(event){
		if (!this.isSpin) {
			this.isSpin = true;
			this.onSpin();
			this.onGetSpin();
		}
	},
	onClickSpeed: function(){
		this.isSpeed               = cc.RedT.setting.minipoker.isSpeed = !this.isSpeed;
		this.buttonSpeedDot.active = !this.buttonSpeedDot.active;
		this.buttonSpeed.color     = this.isSpeed ? cc.Color.WHITE : cc.color(206,206,206);
	},
	onClickAuto: function(){
		this.isAuto               = cc.RedT.setting.minipoker.isAuto = !this.isAuto;
		this.buttonAutoDot.active = !this.buttonAutoDot.active;
		this.buttonAuto.color     = this.isAuto ? cc.Color.WHITE : cc.color(206,206,206);
		this.buttonStop.active    = this.isSpin ? (this.isAuto ? true : false) : false;
	},
	onClickStop: function(){
        this.onClickAuto();
        this.buttonStop.active = false;
    },
	changerCoint: function(){
		this.red            = cc.RedT.setting.minipoker.red = !this.red;
		this.nodeRed.active = !this.nodeRed.active;
		this.nodeXu.active  = !this.nodeXu.active;
		this.onGetHu();
	},
	intChangerBet: function(){
		var self = this;
		Promise.all(this.bet.children.map(function(obj){
			if (obj.name == cc.RedT.setting.minipoker.bet) {
				self.cuoc = obj.name;
				obj.children[0].active = true;
				obj.pauseSystemEvents();
			}else{
				obj.children[0].active = false;
				obj.resumeSystemEvents();
			}
		}))
	},
	changerBet: function(event, bet){
		this.cuoc = cc.RedT.setting.minipoker.bet = bet;
		var target = event.target;
		Promise.all(this.bet.children.map(function(obj){
			if (obj == target) {
				obj.children[0].active = true;
				obj.pauseSystemEvents();
			}else{
				obj.children[0].active = false;
				obj.resumeSystemEvents();
			}
		}))
		this.onGetHu();
	},
	speed: function(){
		return this.isSpeed ? 1.2 : 2.5;
	},
	onData: function(data){
		var self = this;
		if (void 0 !== data.status) {
			if (data.status === 1) {
				this.buttonStop.active = this.isAuto ? true : false;
				this.win   = data.win;
				this.winT  = data.text;
				this.winC  = data.code;
				this.winTg = void 0 !== data.thuong ? data.thuong : 0;
				Promise.all(data.card.map(function(card, index){
					self.reels[index].card[0].spriteFrame = cc.RedT.util.card.getCard(card.card, card.type);
				}));
				this.autoSpin();
			}else{
				this.offSpin();
			}
		}
		if (void 0 !== data.phien) {
			this.phien.string = "#" + data.phien;
		}
		if (void 0 !== data.log) {
			this.LichSu.onData(data.log);
		}
		if (void 0 !== data.top) {
			this.Top.onData(data.top);
		}
		if (void 0 !== data.notice) {
			this.addNotice(data.notice);
		}
	},
	addNotice:function(text){
		var notice = cc.instantiate(this.prefabNotice)
		var noticeComponent = notice.getComponent('mini_warning')
		noticeComponent.text.string = text
		this.notice.addChild(notice)
	},
	setTop:function(){
		this.node.parent.insertChild(this.node);
	},
	hieuUng: function(){
    	if (!!this.winC && this.winC > 0) {
    		if (this.winC == 9) {
    			// Nổ Hũ
    			if (this.isAuto == true) {
    				this.onClickStop();
    			}

    			var nohu = cc.instantiate(this.RedT.PrefabNoHu);
				nohu = nohu.getComponent(cc.Animation);
				var text = nohu.node.children[6].getComponent(cc.Label);

				var Play = function(){
					var huong = cc.callFunc(function(){
						cc.RedT.audio.playEf('winHu');
						helper.numberTo(text, 0, this.win, 1000, true);
					}, this);
					nohu.node.runAction(cc.sequence(cc.delayTime(0.25), huong));
				};

				var Finish = function(){
					nohu.node.destroy();
					this.hieuUng();
				};
				this.RedT.nodeEfect.addChild(nohu.node);
				nohu.on('play',     Play,   this);
    			nohu.on('finished', Finish, this);
    			nohu.play();
    		}else if (this.winC == 8 || this.winC == 7) {
    			// Thắng lớn
				var BigWin = cc.instantiate(this.RedT.prefabBigWin);
				BigWin     = BigWin.getComponent(cc.Animation);

				var BigWinFinish = function(){
					BigWin.node.destroy();
					this.hieuUng();
				}

				BigWin.on('finished', BigWinFinish, this);
				BigWin.node.bet = this.win;
				BigWin.node.red = this.red;
				BigWin.node.position = cc.v2(0, 80);

				this.notice.addChild(BigWin.node);

				this.win = 0;
    		}else{
    			var temp = new cc.Node;
				temp.addComponent(cc.Label);
				temp = temp.getComponent(cc.Label);
				temp.string = '+'+ helper.numberWithCommas(this.win);
				temp.font = this.red ? cc.RedT.util.fontCong : cc.RedT.util.fontTru;
				temp.lineHeight = 130;
				temp.fontSize   = 20;
				this.notice.addChild(temp.node);
				temp.node.runAction(cc.sequence(cc.moveTo(this.isSpeed ? 2 : 3.5, cc.v2(0, 140)), cc.callFunc(function(){
					temp.node.destroy();
					this.hieuUng();
				}, this)));
    			this.addNotice(this.winT);
    		}
    		if (this.winTg > 0) {
				var thuong = new cc.Node;
				thuong.addComponent(cc.Label);
				thuong = thuong.getComponent(cc.Label);
				thuong.string = helper.numberWithCommas(this.winTg);
				thuong.font = cc.RedT.util.fontCong;
				thuong.lineHeight = 130;
				thuong.fontSize   = 23;
				thuong.node.position = cc.v2(0,-28);
				this.notice.addChild(thuong.node);
				thuong.node.runAction(cc.sequence(cc.moveTo(this.isSpeed ? 2 : 3.5, cc.v2(0, 112)), cc.callFunc(function(){
					this.node.destroy()
				}, thuong)));
			}
    		this.winC   = 0;
    	}else{
    		if (this.isAuto) {
    			this.timeOut = setTimeout(function(){
					this.onGetSpin();
				}
				.bind(this), this.isSpeed ? 250 : 1000);
    		}else{
    			this.offSpin();
    		}
    	}
    },
	onGetHu: function(){
		if (this.node.active && void 0 !== cc.RedT.setting.topHu.data) {
			var self = this;
			Promise.all(cc.RedT.setting.topHu.data['mini_poker'].filter(function(temp){
				return temp.type == self.cuoc && temp.red == self.red
			}))
			.then(result => {
				var s = helper.getOnlyNumberInString(this.hu.string);
				var bet = result[0].bet;
				if (s-bet != 0) 
					helper.numberTo(this.hu, s, bet, 2000, true);
			});
		}
	},
	onGetSpin: function(){
		cc.RedT.send({g:{mini_poker:{spin:{cuoc:this.cuoc, red: this.red}}}});
	},
	onCloseGame: function(){
    	this.isSpin = false;
    	Promise.all(this.reels.map(function(reel) {
			reel.stop();
		}));
		this.offSpin();
		void 0 !== this.timeOut && clearTimeout(this.timeOut);
    },
});
