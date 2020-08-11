
var TaiXiu     = require('TaiXiu'),
	MiniPoker  = require('MiniPoker'),
	BigBabol   = require('BigBabol'),
	BauCua     = require('BauCua'),
	BaCay      = require('Mini3Cay'),
	CaoThap    = require('CaoThap'),
	AngryBirds = require('AngryBirds'),
	TopHu      = require('popupTopHu'),
	Dialog     = require('MiniDialog');

var MegaJackpot = require('MegaJackpot');


cc.Class({
	extends: cc.Component,

	properties: {
		minigame: {
			default: null,
			type: cc.Node
		},
		Dialog:      Dialog,
		TaiXiu:      TaiXiu,
		MiniPoker:   MiniPoker,
		BigBabol:    BigBabol,
		BauCua:      BauCua,
		BaCay:       BaCay,
		CaoThap:     CaoThap,
		AngryBirds:  AngryBirds,
		MegaJackpot: MegaJackpot,

		TopHu:       TopHu,

		bgLight:     cc.Node,
		spriteLight: cc.Sprite,
		onLight:     cc.SpriteFrame,
		offLight:    cc.SpriteFrame,

		nodeEfect:   cc.Node,
		// Prefab
		PrefabNoHu:   cc.Prefab,
		prefabBigWin: cc.Prefab,
		light:      true,
	},
	onLoad () {
		if (void 0 === cc.RedT.setting.light) {
			cc.RedT.setting.light = true;
		}
		var self = this;
		this.node._onPreDestroy = function(){
			self.onDestroy();
		}
		this.Dialog.init(this);
		this.TaiXiu.init(this);
		this.MiniPoker.init(this);
		this.BigBabol.init(this);
		this.BauCua.init(this);
		this.BaCay.init(this);
		this.CaoThap.init(this);
		this.AngryBirds.init(this);

		this.MegaJackpot.init(this);

		this.TopHu.init(this);

		if (cc.RedT.IS_LOGIN){
			this.signIn();
		}
		if (cc.RedT.setting.light != this.light) {
			this.LightChanger();
		}
	},
	LightChanger: function(){
		this.light = cc.RedT.setting.light = !this.light;
		if (this.light) {
			this.bgLight.active = false;
			this.spriteLight.spriteFrame = this.offLight;
		}else{
			this.bgLight.active = true;
			this.spriteLight.spriteFrame = this.onLight;
		}
	},
	signIn:function(){
		this.minigame.active = true;
		this.TaiXiu.signIn();
	},
	newGame: function() {
		this.minigame.active = false;
		this.Dialog.onCloseDialog();
		this.TaiXiu.newGame();
		this.BauCua.newGame();
		this.CaoThap.newGame();
	},
	onData: function(data){
		if (void 0 !== data.poker){
			this.MiniPoker.onData(data.poker);
		}
		if (void 0 !== data.big_babol){
			this.BigBabol.onData(data.big_babol);
		}
		if (void 0 !== data.baucua){
			this.BauCua.onData(data.baucua);
		}
		if (void 0 !== data.bacay){
			this.BaCay.onData(data.bacay);
		}
		if (void 0 !== data.caothap){
			this.CaoThap.onData(data.caothap);
		}
		if (void 0 !== data.arb){
			this.AngryBirds.onData(data.arb);
		}
		if (void 0 !== data.megaj){
			this.MegaJackpot.onData(data.megaj);
		}
	},
	onDestroy: function(){
		clearInterval(this.TaiXiu.TX_Main.timeInterval);
		clearInterval(this.BauCua.timeInterval);
		void 0 !== this.CaoThap.timeInterval && clearInterval(this.CaoThap.timeInterval);
	},
	playClick: function(){
		cc.RedT.audio.playClick();
	},
	playUnClick: function(){
		cc.RedT.audio.playUnClick();
	},
});
