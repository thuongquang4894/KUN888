
var helper         = require('Helper');
var BauCua_linhVat = require('BauCua_linhVat');

cc.Class({
    extends: cc.Component,

    properties: {
    	background: cc.Node,
    	linhVat: {
    		default: [],
    		type: BauCua_linhVat
    	},

    	iconMini: {
    		default: [],
    		type: cc.SpriteFrame,
    	},

    	iconLV: {
    		default: [],
    		type: cc.SpriteFrame,
    	},

    	dices: {
    		default: [],
    		type: cc.Sprite,
    	},

        logHuou:    cc.Label,
        logBau:     cc.Label,
        logGa:      cc.Label,
        logCa:      cc.Label,
        logCua:     cc.Label,
        logTom:     cc.Label,
        titleTime:  cc.Label,
        labelTime:  cc.Label,
        labelHu:    cc.Label,

        Animation:  cc.Animation,

		bet:     cc.Node,
        nodeRed: cc.Node,
		nodeXu:  cc.Node,
		logs:    cc.Node,
		prefabLogs: cc.Prefab,

		notice: cc.Node,
		prefabNotice: cc.Prefab,

        cuoc:  "",
		red:   true,
    },
    init(obj){
		this.RedT = obj;
		this.Top    = obj.Dialog.BauCua_top;
		this.LichSu = obj.Dialog.BauCua_LichSu;
		cc.RedT.setting.baucua = cc.RedT.setting.baucua || {regOpen: false, data:{meXuBau: 0, meXuCa: 0, meXuCua: 0, meXuGa: 0, meXuHuou: 0, meXuTom: 0, meRedBau: 0, meRedCa: 0, meRedCua: 0, meRedGa: 0, meRedHuou: 0, meRedTom: 0, redBau: 0, redCa: 0, redCua: 0, redGa: 0, redHuou: 0, redTom: 0, xuBau: 0, xuCa: 0, xuCua: 0, xuGa: 0, xuHuou: 0, xuTom: 0}, logLV:{}, red: true, bet: "100"};

		var check = localStorage.getItem('bauCua');
		if (check == "true") {
			this.node.active = true;
		}

		if (void 0 !== cc.RedT.setting.baucua.position) {
			this.node.position = cc.RedT.setting.baucua.position;
		}
		if (void 0 !== cc.RedT.setting.baucua.time_remain) {
			cc.RedT.setting.baucua.time_remain++;
			this.nextRealTime();
		}
		if (cc.RedT.IS_LOGIN) {
			this.logLVHandling(cc.RedT.setting.baucua.logLV);
			this.DataHandling(cc.RedT.setting.baucua.data);
			if (this.red != cc.RedT.setting.baucua.red) {
				this.changerCoint();
			}
			if (void 0 !== cc.RedT.setting.baucua.logLV) {
				this.logLVHandling(cc.RedT.setting.baucua.logLV);
			}
			if (void 0 !== cc.RedT.setting.baucua.logs) {
				this.addLogs();
			}
			this.intChangerBet();
		}

		this.Animation.on('finished', this.AnimationFinish, this);
	},
	onLoad () {
		this.ttOffset = null;
	},
	onEnable: function() {
		//this.onGetHu();
		this.regEvent(true);
		this.background.on(cc.Node.EventType.TOUCH_START,  this.eventStart, this);
		this.background.on(cc.Node.EventType.TOUCH_MOVE,   this.eventMove,  this);
		this.background.on(cc.Node.EventType.TOUCH_END,    this.eventEnd,   this);
		this.background.on(cc.Node.EventType.TOUCH_CANCEL, this.eventEnd,   this);
		this.background.on(cc.Node.EventType.MOUSE_ENTER,  this.setTop,     this);
	},
	onDisable: function() {
		this.regEvent(false);
		this.background.off(cc.Node.EventType.TOUCH_START,  this.eventStart, this);
		this.background.off(cc.Node.EventType.TOUCH_MOVE,   this.eventMove,  this);
		this.background.off(cc.Node.EventType.TOUCH_END,    this.eventEnd,   this);
		this.background.off(cc.Node.EventType.TOUCH_CANCEL, this.eventEnd,   this);
		this.background.off(cc.Node.EventType.MOUSE_ENTER,  this.setTop,     this);
		//this.onCloseGame();
	},
	regEvent: function(bool){
		cc.RedT.send({g:{baucua: !cc.RedT.setting.baucua.regOpen ? {view: bool, regOpen: true} : {view: bool}}});
	},
	eventStart: function(e){
		this.setTop();
		this.ttOffset = cc.v2(e.touch.getLocationX() - this.node.position.x, e.touch.getLocationY() - this.node.position.y)
	},
	eventMove: function(e){
		this.node.position = cc.v2(e.touch.getLocationX() - this.ttOffset.x, e.touch.getLocationY() - this.ttOffset.y)
	},
	eventEnd: function(){
		cc.RedT.setting.baucua.position = this.node.position;
	},
    openGame:function(){
		cc.RedT.audio.playClick();
		if (cc.RedT.IS_LOGIN){
			this.node.active = !0;
			localStorage.setItem('bauCua', true);
			this.setTop();
		}
		else
			cc.RedT.inGame.dialog.showSignIn();
	},
	openGameBaoTri:function(){
		cc.RedT.inGame.notice.show({title:"THÔNG BÁO",text:"Game đang trong giai đoạn phát triển."});
	},
	closeGame:function(){
		cc.RedT.audio.playUnClick();
		this.node.active = !1;
		localStorage.setItem('bauCua', false);
	},
	setTop:function(){
		this.node.parent.insertChild(this.node);
	},
	changerCoint: function(){
		this.red            = !this.red;
		this.nodeRed.active = !this.nodeRed.active;
		this.nodeXu.active  = !this.nodeXu.active;
		cc.RedT.setting.baucua.regOpen && this.DataHandling(cc.RedT.setting.baucua.data);
		cc.RedT.setting.baucua.red = this.red;
		//this.onGetHu();
	},
	intChangerBet: function(){
		var self = this;
		Promise.all(this.bet.children.map(function(obj){
			if (obj.name == cc.RedT.setting.baucua.bet) {
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
		this.cuoc = bet;
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
		cc.RedT.setting.baucua.bet = target.name;
		//this.onGetHu();
	},
	AnimationFinish: function(){
		this.addLogs();
		var dice = cc.RedT.setting.baucua.logs[0];
		var heSo   = {};
		for (var i = 0; i < 3; i++) {
			var dataT = dice[i];
			cc.RedT.setting.baucua.logLV[dataT] += 1;
			if (void 0 === heSo[dataT]) {
				heSo[dataT] = 1;
			}else{
				heSo[dataT] += 1;
			}
		}
		for (var j = 0; j < 6; j++) {
			if (void 0 !== heSo[j]) {
				this.linhVat[j].Select(heSo[j]);
			}
		}
		this.logLVHandling(cc.RedT.setting.baucua.logLV);
	},
	datCuoc: function(e, linhVat){
		if (this.cuoc < 100) {
			this.addNotice('Vui lòng chọn mức cược...');
		}else{
			cc.RedT.send({g:{baucua:{cuoc:{cuoc:this.cuoc, red: this.red, linhVat: linhVat}}}});
		}
	},
	addNotice:function(text){
		var notice = cc.instantiate(this.prefabNotice)
		var noticeComponent = notice.getComponent('mini_warning')
		noticeComponent.text.string = text;
		this.notice.addChild(notice);
	},
	setDice: function(dices){
		var self = this;
		Promise.all(dices.map(function(dice, index){
			self.dices[index].spriteFrame = self.iconLV[dice];
		}))
	},
	addLogs: function(){
		var self = this;
		this.logs.removeAllChildren();
		Promise.all(cc.RedT.setting.baucua.logs.map(function(log, index){
			var node = cc.instantiate(self.prefabLogs)
			var nodeComponent = node.getComponent('BauCua_logMini');
			Promise.all(nodeComponent.icon.map(function(sp, i){
				sp.spriteFrame = self.iconMini[log[i]];
			}))
			if(index == 0){
				node.children[0].children[0].active = true;
				node.children[1].children[0].active = true;
				node.children[2].children[0].active = true;
			}
			self.logs.addChild(node);
		}))
	},
	onData: function(data){
		if (void 0 !== data.data) {
			var a = Object.assign(cc.RedT.setting.baucua.data, data.data);
			this.DataHandling(data.data);
		}
		if (void 0 !== data.logLV) {
			Object.assign(cc.RedT.setting.baucua.logLV, data.logLV);
			this.logLVHandling(data.logLV);
		}
		if(void 0 !== data.status){
			this.status(data.status)
		}
		if (void 0 !== data.logs) {
			cc.RedT.setting.baucua.logs = data.logs;
			this.addLogs();
		}
		if (void 0 !== data.tops) {
			this.Top.onData(data.tops);
		}
		if (void 0 !== data.viewlogs) {
			this.LichSu.onData(data.viewlogs);
		}
		if (void 0 !== data.regOpen) {
			cc.RedT.setting.baucua.regOpen = true;
		}
		if (void 0 !== data.time_remain) {
			cc.RedT.setting.baucua.time_remain = data.time_remain;
			this.playTime();
		}
		if(void 0 !== data.finish){
			if (cc.RedT.setting.baucua.regOpen) {
				this.unSelect();
				// Huỷ đếm
				void 0 !== this.timeInterval && clearInterval(this.timeInterval);
				// Thêm kết quả
				cc.RedT.setting.baucua.logs.unshift([data.finish.dices[0], data.finish.dices[1], data.finish.dices[2]]);
				cc.RedT.setting.baucua.logs.length > 15 && cc.RedT.setting.baucua.logs.pop();
				this.setDice(data.finish.dices);
				// Play
				this.Animation.node.active = true;
				this.Animation.play();
			}

			cc.RedT.setting.baucua.time_remain = 72;
			this.playTime();
		}
		if (void 0 !== data.notice) {
			this.addNotice(data.notice);
		}
	},
	playTime: function(){
		void 0 !== this.timeInterval && clearInterval(this.timeInterval);
		this.timeInterval = setInterval(function() {
			if (cc.RedT.setting.baucua.time_remain > 61) {
				let time = helper.numberPad(cc.RedT.setting.baucua.time_remain-62, 2);
				this.labelTime.node.color = cc.Color.RED;
				this.labelTime.string = time;
				this.titleTime.string = "Xem phiên";
				if (cc.RedT.setting.baucua.time_remain < 66) {
					this.Animation.node.active = false;
				}
			}else{
				this.Animation.node.active = false;
				if (cc.RedT.setting.baucua.regOpen && cc.RedT.setting.baucua.time_remain == 61) {
					this.resetData();
				}
				this.titleTime.string = "Đặt cược"
				if (cc.RedT.setting.baucua.time_remain > 0) {
					let time = helper.numberPad(cc.RedT.setting.baucua.time_remain-1, 2);
					this.labelTime.string = time;
					this.labelTime.node.color = cc.Color.WHITE
				}else clearInterval(this.timeInterval);
			}
			cc.RedT.setting.baucua.time_remain--;
		}
		.bind(this), 1000)
	},
	nextRealTime: function(){
		if (cc.RedT.setting.baucua.time_remain > 61) {
			var time = helper.numberPad(cc.RedT.setting.baucua.time_remain-62, 2);
			this.labelTime.node.color = cc.Color.RED;
			this.labelTime.string = helper.numberPad(time, 2);
			this.titleTime.string = "Xem phiên";
		}else{
			this.titleTime.string = "Đặt cược"
			if (cc.RedT.setting.baucua.time_remain > 0) {
				var time = helper.numberPad(cc.RedT.setting.baucua.time_remain-1, 2);
				this.labelTime.string = time;
				this.labelTime.node.color = cc.Color.WHITE
			}
		}
	},
	logLVHandling: function(data){
		this.logHuou.string = helper.numberWithCommas(data[0]);
        this.logBau.string  = helper.numberWithCommas(data[1]);
        this.logGa.string   = helper.numberWithCommas(data[2]);
        this.logCa.string   = helper.numberWithCommas(data[3]);
        this.logCua.string  = helper.numberWithCommas(data[4]);
        this.logTom.string  = helper.numberWithCommas(data[5]);
	},
	DataHandling: function(data){
		if (this.red) {
			if (void 0 !== data.redHuou) {
				this.linhVat[0].totallCuoc(data.redHuou);
			}
			if (void 0 !== data.redBau) {
				this.linhVat[1].totallCuoc(data.redBau);
			}
			if (void 0 !== data.redGa) {
				this.linhVat[2].totallCuoc(data.redGa);
			}
			if (void 0 !== data.redCa) {
				this.linhVat[3].totallCuoc(data.redCa);
			}
			if (void 0 !== data.redCua) {
				this.linhVat[4].totallCuoc(data.redCua);
			}
			if (void 0 !== data.redTom) {
				this.linhVat[5].totallCuoc(data.redTom);
			}


			if (void 0 !== data.meRedHuou) {
				this.linhVat[0].meCuoc(data.meRedHuou);
			}
			if (void 0 !== data.meRedBau) {
				this.linhVat[1].meCuoc(data.meRedBau);
			}
			if (void 0 !== data.meRedGa) {
				this.linhVat[2].meCuoc(data.meRedGa);
			}
			if (void 0 !== data.meRedCa) {
				this.linhVat[3].meCuoc(data.meRedCa);
			}
			if (void 0 !== data.meRedCua) {
				this.linhVat[4].meCuoc(data.meRedCua);
			}
			if (void 0 !== data.meRedTom) {
				this.linhVat[5].meCuoc(data.meRedTom);
			}
		}else{
			if (void 0 !== data.xuHuou) {
				this.linhVat[0].totallCuoc(data.xuHuou);
			}
			if (void 0 !== data.xuBau) {
				this.linhVat[1].totallCuoc(data.xuBau);
			}
			if (void 0 !== data.xuGa) {
				this.linhVat[2].totallCuoc(data.xuGa);
			}
			if (void 0 !== data.xuCa) {
				this.linhVat[3].totallCuoc(data.xuCa);
			}
			if (void 0 !== data.xuCua) {
				this.linhVat[4].totallCuoc(data.xuCua);
			}
			if (void 0 !== data.xuTom) {
				this.linhVat[5].totallCuoc(data.xuTom);
			}


			if (void 0 !== data.meXuHuou) {
				this.linhVat[0].meCuoc(data.meXuHuou);
			}
			if (void 0 !== data.meXuBau) {
				this.linhVat[1].meCuoc(data.meXuBau);
			}
			if (void 0 !== data.meXuGa) {
				this.linhVat[2].meCuoc(data.meXuGa);
			}
			if (void 0 !== data.meXuCa) {
				this.linhVat[3].meCuoc(data.meXuCa);
			}
			if (void 0 !== data.meXuCua) {
				this.linhVat[4].meCuoc(data.meXuCua);
			}
			if (void 0 !== data.meXuTom) {
				this.linhVat[5].meCuoc(data.meXuTom);
			}
		}
	},
	unSelect: function(){
		Promise.all(this.linhVat.map(function(linhVat){
			linhVat.unSelect();
		}))
	},
	resetData: function(){
		var data = Object.keys(cc.RedT.setting.baucua.data);
		Promise.all(data.map(function(key){
			return (cc.RedT.setting.baucua.data[key] = 0)
		}))
		.then(result => {
			this.DataHandling(cc.RedT.setting.baucua.data);
		});

		this.unSelect();
	},
	newGame: function(){
		cc.RedT.setting.baucua.regOpen = false;
		void 0 !== this.timeInterval && clearInterval(this.timeInterval);
		//this.resetData.resetData();
	},
	status: function(data){
		setTimeout(function() {
			var temp = new cc.Node;
			temp.addComponent(cc.Label);
			temp = temp.getComponent(cc.Label);
			temp.string = (data.win ? '+' : '-') + helper.numberWithCommas(data.bet);
			temp.font = data.win ? cc.RedT.util.fontCong : cc.RedT.util.fontTru;
			temp.lineHeight = 130;
			temp.fontSize   = 30;
			temp.node.position = cc.v2(0, 90);
			this.notice.addChild(temp.node);
			temp.node.runAction(cc.sequence(cc.moveTo(3.5, cc.v2(0, 200)), cc.callFunc(function(){this.node.destroy()}, temp)));
			data.win && cc.RedT.send({user:{updateCoint: true}});
			if(void 0 !== data.thuong && data.thuong > 0){
				var thuong = new cc.Node;
				thuong.addComponent(cc.Label);
				thuong = thuong.getComponent(cc.Label);
				thuong.string = '+' + helper.numberWithCommas(data.thuong);
				thuong.font = cc.RedT.util.fontEffect;
				thuong.lineHeight = 90;
				thuong.fontSize   = 14;
				this.notice.addChild(thuong.node);
				thuong.node.runAction(cc.sequence(cc.moveTo(3, cc.v2(0, 100)), cc.callFunc(function(){this.node.destroy()}, thuong)))
			}
		}
		.bind(this), 2e3)
	},
});
