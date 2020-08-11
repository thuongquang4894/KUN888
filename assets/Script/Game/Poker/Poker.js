
var helper        = require('Helper'),
	notice        = require('Notice'),
	module_player = require('Poker_Player'),
	dialog        = require('Poker_dialog');

cc.Class({
	extends: cc.Component,

	properties: {
		nodeNotice: cc.Node,
		prefabNotice: {
			default: null,
			type: cc.Prefab,
		},
		MiniPanel: cc.Prefab,
		loading:   cc.Node,
		redhat:    cc.Node,
		notice:    notice,
		dialog:    dialog,
		player: {
			default: [],
			type: module_player,
		},
		labelRoom: cc.Label,
		labelBet:  cc.Label,
		roomCard:  cc.Node,
	},

	onLoad () {
		cc.RedT.inGame = this;
		var MiniPanel = cc.instantiate(this.MiniPanel);
		cc.RedT.MiniPanel = MiniPanel.getComponent('MiniPanel');
		this.redhat.insertChild(MiniPanel);

		//this.dialog.init();

		cc.RedT.send({scene:"poker", g:{poker:{ingame:true}}});

		/**
		if(cc.RedT.isSoundBackground()){
			this.playMusic();
		}
		*/
	},
	onData: function(data) {
		console.log(data);
		if (!!data.meMap) {
			this.meMap = data.meMap;
		}
		if (!!data.mini){
			cc.RedT.MiniPanel.onData(data.mini);
		}
		if (!!data.TopHu){
			cc.RedT.MiniPanel.TopHu.onData(data.TopHu);
		}
		if (!!data.taixiu){
			cc.RedT.MiniPanel.TaiXiu.TX_Main.onData(data.taixiu);
		}

		if (!!data.infoGhe) {  // thông tin các ghế
			this.infoGhe(data.infoGhe);
		}

		if (!!data.infoRoom) { // thông tin phòng
			this.infoRoom(data.infoRoom);
		}

		if (!!data.ingame) {  // có người vào phòng
			this.ingame(data.ingame);
		}
		if (!!data.outgame) {  // có người ra khỏi phòng
			this.outgame(data.outgame);
		}
		if (!!data.game) {  // có người ra khỏi phòng
			this.game(data.game);
		}
	},
	gameStart: function(data){
		var self = this;
		Promise.all(data.map(function(player){
			self.player[player.ghe].setInfo(player.data);
		}))
	},
	game: function(data){
		if (!!data.start) {
			this.gameStart(data.start);
		}
	},
	infoGhe: function(info){
		var self = this;
		var player = {};
		var newGhe = [];
		if (this.meMap != 1) {
			var map = this.meMap-1;
			newGhe = [...info.slice(map), ...info.slice(0, map)];
		}else{
			newGhe = info;
		}
		Promise.all(newGhe.map(function(obj, index){
			var item = self.player[index];
			player[obj.ghe] = item;
			item.setInfo(obj.data);
			return void 0;
		}))
		.then(result => {
			this.player = player;
		})
	},
	infoRoom: function(data){
		this.labelRoom.string = data.id;
		this.labelBet.string  = helper.numberWithCommas(data.game) + (data.red ? ' KUN' : ' XU');

	},
	ingame: function(data){
		this.player[data.ghe].setInfo(data.data);
	},
	outgame: function(data){
		this.player[data].setInfo(null);
	},
	backGame: function(){
		cc.RedT.send({g:{poker:{outgame:true}}});
		this.loading.active = true;
		void 0 !== this.timeOut && clearTimeout(this.timeOut);
		cc.director.loadScene('MainGame');
	},
	signOut: function(){
		cc.director.loadScene('MainGame', function(){
			cc.RedT.inGame.signOut();
		});
	},
});
