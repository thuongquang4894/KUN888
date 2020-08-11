
var helper = require('Helper');
var reels  = require('CaoThap_reels');

cc.Class({
	extends: cc.Component,

	properties: {
		background: cc.Node,
		logs:       cc.Node,
		reels: reels,
		listA: {
			default: [],
			type: cc.Sprite,
		},

		buttonPlay:  cc.Node,
		buttonCoint: cc.Node,
		buttonAnNon: cc.Node,
		buttonCao:   cc.Node,
		buttonThap:  cc.Node,

		bet:     cc.Node,
		nodeRed: cc.Node,
		nodeXu:  cc.Node,

		notice:       cc.Node,
		prefabNotice: cc.Prefab,

		cardf:        cc.Prefab,

		cuoc:    "",
		hu:      cc.Label,
		time:    cc.Label,
		win:     cc.Label,
		winUp:   cc.Label,
		winDown: cc.Label,
		isPlay:  false,
		red:     true,
	},
	init(obj){
		this.RedT = obj;
		this.LichSu = obj.Dialog.CaoThap_history;
		this.Top    = obj.Dialog.CaoThap_top;

		cc.RedT.setting.caothap = cc.RedT.setting.caothap || {bet: "1000", logs: []};

		var check = localStorage.getItem('caothap');
		if (check == "true") {
			this.node.active = true;
		}
		if (void 0 !== cc.RedT.setting.caothap.position) {
			this.node.position = cc.RedT.setting.caothap.position;
		}
		if (void 0 !== cc.RedT.setting.caothap.cuoc && cc.RedT.setting.caothap.cuoc != this.cuoc) {
			this.intChangerBet();
		}
		if (void 0 !== cc.RedT.setting.caothap.red && this.red != cc.RedT.setting.caothap.red) {
			this.changerCoint();
		}
	},
	onLoad () {
		this.reels.init(this);
		if (cc.RedT.setting.caothap.isPlay && !this.isPlay) {
			this.isPlay = true;
			this.onPlay();
			this.resumeGame();
			cc.RedT.setting.caothap.time_remain++;
			this.playTime();
			setTimeout(function(){
				this.reels.card[this.reels.card.length-1].spriteFrame = cc.RedT.util.card.getCard(cc.RedT.setting.caothap.card.card, cc.RedT.setting.caothap.card.type);
				this.reMainLog();
			}.bind(this), 100);
		}
	},

	onEnable: function() {
		this.onGetHu();
		this.background.on(cc.Node.EventType.TOUCH_START,  this.eventStart, this);
		this.background.on(cc.Node.EventType.TOUCH_MOVE,   this.eventMove,  this);
		this.background.on(cc.Node.EventType.TOUCH_END,    this.eventEnd,   this);
		this.background.on(cc.Node.EventType.TOUCH_CANCEL, this.eventEnd,   this);
		this.background.on(cc.Node.EventType.MOUSE_ENTER,  this.setTop,     this);
		!cc.RedT.setting.caothap.connect && this.reconnect();
	},
	onDisable: function() {
		this.background.off(cc.Node.EventType.TOUCH_START,  this.eventStart, this);
		this.background.off(cc.Node.EventType.TOUCH_MOVE,   this.eventMove,  this);
		this.background.off(cc.Node.EventType.TOUCH_END,    this.eventEnd,   this);
		this.background.off(cc.Node.EventType.TOUCH_CANCEL, this.eventEnd,   this);
		this.background.off(cc.Node.EventType.MOUSE_ENTER,  this.setTop,     this);
	},
	eventStart: function(e){
		this.setTop();
		this.ttOffset = cc.v2(e.touch.getLocationX() - this.node.position.x, e.touch.getLocationY() - this.node.position.y)
	},
	eventMove: function(e){
		this.node.position = cc.v2(e.touch.getLocationX() - this.ttOffset.x, e.touch.getLocationY() - this.ttOffset.y)
	},
	eventEnd: function(){
		cc.RedT.setting.caothap.position = this.node.position;
	},
	openGame:function(){
		cc.RedT.audio.playClick();
		if (cc.RedT.IS_LOGIN){
			this.node.active = !0;
			localStorage.setItem('caothap', true);
			this.setTop();
		}
		else
			cc.RedT.inGame.dialog.showSignIn();
	},
	closeGame:function(){
		cc.RedT.audio.playUnClick();
		this.node.active = !1;
		localStorage.setItem('caothap', false);
	},
	setTop:function(){
		this.node.parent.insertChild(this.node);
	},
	changerCoint: function(){
		if (this.isPlay) {
			this.buttonCoint.pauseSystemEvents();
		}else{
			this.red            = cc.RedT.setting.caothap.red = !this.red;
			this.nodeRed.active = !this.nodeRed.active;
			this.nodeXu.active  = !this.nodeXu.active;
			this.onGetHu();
		}
	},
	intChangerBet: function(){
		var self = this;
		Promise.all(this.bet.children.map(function(obj){
			if (obj.name == cc.RedT.setting.caothap.cuoc) {
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
		if (this.isPlay) {
			Promise.all(this.bet.children.map(function(bet){
				bet.pauseSystemEvents();
			}));
		}else{
			var target = event.target;
			this.cuoc  = cc.RedT.setting.caothap.cuoc = target.name;
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
		}
	},
	addNotice:function(text){
		var notice = cc.instantiate(this.prefabNotice)
		var noticeComponent = notice.getComponent('mini_warning')
		noticeComponent.text.string = text
		this.notice.addChild(notice)
	},
	EF_Play: function(){
		this.reels.random();
		this.reels.spin();
	},
	onPlay: function(){
		this.buttonPlay.active = false;
		this.buttonCoint.pauseSystemEvents();
		Promise.all(this.bet.children.map(function(bet){
			bet.pauseSystemEvents();
		}));
	},
	offPlay: function(){
		this.isPlay            = cc.RedT.setting.caothap.isPlay = false;
		this.buttonPlay.active = true;
		this.buttonCoint.resumeSystemEvents();
		Promise.all(this.bet.children.map(function(bet){
			if(!bet.children[0].active)
				bet.resumeSystemEvents();
		}));

		this.buttonAnNon.color = cc.color(155,155,155);
		this.buttonAnNon.pauseSystemEvents();
		this.buttonCao.color = cc.color(155,155,155);
		this.buttonCao.pauseSystemEvents();
		this.buttonThap.color = cc.color(155,155,155);
		this.buttonThap.pauseSystemEvents();
		void 0 !== this.timeInterval && clearInterval(this.timeInterval);
	},
	onS1: function(){
		this.buttonAnNon.pauseSystemEvents();
		this.buttonCao.pauseSystemEvents();
		this.buttonThap.pauseSystemEvents();
	},
	onClickPlay: function(){
		if (!this.isPlay) {
			this.isPlay = cc.RedT.setting.caothap.isPlay = true;
			this.sendPlay();
			this.onPlay();
			this.reSetPhien();
		}
	},
	onData: function(data){
		var self = this;
		if (void 0 !== data.status) {
			if (data.status === 1) {
				cc.RedT.setting.caothap.time_remain = 120;

				cc.RedT.setting.caothap.win     = data.win;
				cc.RedT.setting.caothap.card    = data.card;
				cc.RedT.setting.caothap.a       = data.a;
				cc.RedT.setting.caothap.bet     = data.bet;
				cc.RedT.setting.caothap.click   = data.click;
				cc.RedT.setting.caothap.winUp   = data.winUp;
				cc.RedT.setting.caothap.winDown = data.winDown;
				cc.RedT.setting.caothap.logs.push(data.card);

				if (void 0 !== data.nohu) {
					this.nohu = data.nohu;
				}

				this.reels.card[0].spriteFrame = cc.RedT.util.card.getCard(data.card.card, data.card.type);
				this.EF_Play();
				this.playTime();
			}else{
				this.offPlay();
			}
		}
		if (void 0 !== data.annon) {
			this.annon(data.annon);
		}
		if (void 0 !== data.reconnect) {
			this.connect(data.reconnect);
		}
		
		if (void 0 !== data.isAnNon) {
			this.eAnNon(data.isAnNon);
		}
		if (void 0 !== data.down) {
			this.eThapChanger(data.down);
		}
		if (void 0 !== data.up) {
			this.eCaoChanger(data.up);
		}
		if (void 0 !== data.history) {
			this.LichSu.onData(data.history);
		}
		if (void 0 !== data.tops) {
			this.Top.onData(data.tops);
		}
		if (void 0 !== data.notice) {
			this.addNotice(data.notice);
		}
	},
	playTime: function(){
		void 0 !== this.timeInterval && clearInterval(this.timeInterval);
		this.timeInterval = setInterval(function() {
			if (cc.RedT.setting.caothap.time_remain > 0) {
				this.time.string = helper.numberToTime(cc.RedT.setting.caothap.time_remain);
			}else clearInterval(this.timeInterval);
			cc.RedT.setting.caothap.time_remain--;
		}
		.bind(this), 1000)
	},
	sendPlay: function(){
		cc.RedT.send({g:{caothap:{play:{newGame:{cuoc:this.cuoc, red: this.red}}}}});
	},
	selectGame: function(e, select){
		this.onS1();
		if (this.isPlay) {
			cc.RedT.send({g:{caothap:{play:{select: select=="1"}}}});
		}
	},
	onAnNon: function(e){
		//this.onS1();
		if (this.isPlay) {
			cc.RedT.send({g:{caothap:{play:{annon:true}}}});
		}
	},
	reconnect: function(){
		cc.RedT.setting.caothap.connect = true;
		cc.RedT.send({g:{caothap:{play:{reconnect:true}}}});
	},
	connect: function(data){
		this.onPlay();
		if (data.red != this.red) {
			this.changerCoint();
		}
		if (this.cuoc != data.cuoc) {
			this.cuoc = cc.RedT.setting.caothap.cuoc = data.cuoc;
			this.intChangerBet();
		}

		this.isPlay = cc.RedT.setting.caothap.isPlay = true;
		cc.RedT.setting.caothap.time_remain = data.time_remain;

		cc.RedT.setting.caothap.win     = true;
		cc.RedT.setting.caothap.card    = data.card;
		cc.RedT.setting.caothap.a       = data.a;
		cc.RedT.setting.caothap.bet     = data.bet;
		cc.RedT.setting.caothap.click   = data.click;
		cc.RedT.setting.caothap.winUp   = data.winUp;
		cc.RedT.setting.caothap.winDown = data.winDown;

		Promise.all(this.listA.map(function(obj, index){
			if (void 0 !== cc.RedT.setting.caothap.a[index]) {
				obj.node.active = true;
				obj.spriteFrame = cc.RedT.util.card.getCard(cc.RedT.setting.caothap.a[index].card, cc.RedT.setting.caothap.a[index].type);
			}else{
				obj.node.active = false;
			}
		}))

		setTimeout(function(){
			this.reels.card[this.reels.card.length-1].spriteFrame = cc.RedT.util.card.getCard(cc.RedT.setting.caothap.card.card, cc.RedT.setting.caothap.card.type);
		}.bind(this), 10)
		this.playTime();

		this.win.string     = helper.numberWithCommas(data.bet);
		this.winUp.string   = data.winUp > 0 ? helper.numberWithCommas(data.winUp) : "";
		this.winDown.string = data.winDown > 0 ? helper.numberWithCommas(data.winDown) : "";
		this.clickInGame();
	},
	resumeGame: function(){
		var self = this;
		this.win.string     = helper.numberWithCommas(cc.RedT.setting.caothap.bet);
		this.winUp.string   = cc.RedT.setting.caothap.winUp > 0 ? helper.numberWithCommas(cc.RedT.setting.caothap.winUp) : "";
		this.winDown.string = cc.RedT.setting.caothap.winDown > 0 ? helper.numberWithCommas(cc.RedT.setting.caothap.winDown) : "";
		this.clickInGame();
		Promise.all(this.listA.map(function(obj, index){
			if (void 0 !== cc.RedT.setting.caothap.a[index]) {
				obj.node.active = true;
				obj.spriteFrame = cc.RedT.util.card.getCard(cc.RedT.setting.caothap.a[index].card, cc.RedT.setting.caothap.a[index].type);
			}else{
				obj.node.active = false;
			}
		}));
		if (cc.RedT.setting.caothap.win) {
			if (!!this.nohu) {
				// Nổ Hũ
				var nohu = cc.instantiate(this.RedT.PrefabNoHu);
				nohu = nohu.getComponent(cc.Animation);
				var text = nohu.node.children[6].getComponent(cc.Label);

				var Play = function(){
					var huong = cc.callFunc(function(){
						cc.RedT.audio.playEf('winHu');
						helper.numberTo(text, 0, this.nohu, 1000, true);
					}, this);
					nohu.node.runAction(cc.sequence(cc.delayTime(0.25), huong));
				};

				var Finish = function(){
					this.nohu = false;
					this.offPlay();
					nohu.node.destroy();
					cc.RedT.setting.caothap.win = 0;
				};
				this.RedT.nodeEfect.addChild(nohu.node);
				nohu.on('play',     Play,   this);
				nohu.on('finished', Finish, this);
				nohu.play();
			}
		}else{
			this.offPlay();
			this.addNotice("Bạn thua!! Chúc bạn may mắn lần sau.");
		}
	},
	addMainLog: function(){
		var ooT = cc.instantiate(this.cardf);
		ooT.width  = 32.77;
		ooT.height = 46.69;
		this.logs.addChild(ooT);
		ooT = ooT.getComponent(cc.Sprite);
		ooT.spriteFrame = cc.RedT.util.card.getCard(cc.RedT.setting.caothap.card.card, cc.RedT.setting.caothap.card.type);
	},
	reMainLog: function(){
		var self = this;
		Promise.all(cc.RedT.setting.caothap.logs.map(function(card){
			var ooT = cc.instantiate(self.cardf);
			ooT.width  = 32.77;
			ooT.height = 46.69;
			self.logs.addChild(ooT);
			ooT = ooT.getComponent(cc.Sprite);
			ooT.spriteFrame = cc.RedT.util.card.getCard(card.card, card.type);
		}))
	},
	annon: function(data){
		clearInterval(this.timeInterval);
		var temp = new cc.Node;
			temp.addComponent(cc.Label);
			temp = temp.getComponent(cc.Label);
			temp.string = '+' + helper.numberWithCommas(data);
			temp.font = this.red ? cc.RedT.util.fontCong : cc.RedT.util.fontTru;
			temp.lineHeight = 130;
			temp.fontSize   = 20;
			temp.node.position = cc.v2(0, 10);
			this.notice.addChild(temp.node);
			temp.node.runAction(cc.sequence(cc.moveTo(3.5, cc.v2(0, 125)), cc.callFunc(function(){this.node.destroy()}, temp)));
	},
	clickInGame: function(){
		this.eAnNon(cc.RedT.setting.caothap.click.isAnNon);
		this.eCaoChanger(cc.RedT.setting.caothap.click.up);
		this.eThapChanger(cc.RedT.setting.caothap.click.down);
	},
	eAnNon: function(d){
		if (d) {
			this.buttonAnNon.resumeSystemEvents()
			this.buttonAnNon.color = cc.Color.WHITE;
		}else{
			this.buttonAnNon.color = cc.color(155,155,155);
			this.buttonAnNon.pauseSystemEvents()
		}
	},
	eCaoChanger: function(d){
		if (d) {
			this.buttonCao.color = cc.Color.WHITE;
			this.buttonCao.resumeSystemEvents()
		}else{
			this.buttonCao.color = cc.color(155,155,155);
			this.buttonCao.pauseSystemEvents()
		}
	},
	eThapChanger: function(d){
		if (d) {
			this.buttonThap.color = cc.Color.WHITE;
			this.buttonThap.resumeSystemEvents()
		}else{
			this.buttonThap.color = cc.color(155,155,155);
			this.buttonThap.pauseSystemEvents()
		}
	},
	reSetPhien: function(){
		this.logs.removeAllChildren();
		cc.RedT.setting.caothap.logs = [];
	},
	newGame: function(){
		this.offPlay();
		this.reels.stop();
		cc.RedT.setting.caothap.connect = false;
		this.reSetPhien();
	},
	onGetHu: function(){
		if (void 0 !== cc.RedT.setting.topHu.data && this.node.active) {
			var self = this;
			Promise.all(cc.RedT.setting.topHu.data['caothap'].filter(function(temp){
				return temp.type == self.cuoc && temp.red == self.red;
			}))
			.then(result => {
				var s = helper.getOnlyNumberInString(this.hu.string);
				var bet = result[0].bet;
				if (s-bet != 0) 
					helper.numberTo(this.hu, s, bet, 2000, true);
			});
		}
	},
});
