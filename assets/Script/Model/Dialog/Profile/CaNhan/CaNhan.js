
var helper = require('Helper');

cc.Class({
	extends: cc.Component,

	properties: {
		avatar: cc.Sprite,
		UID: {
			default: null,
			type:    cc.Label,
		},
		username: {
			default: null,
			type:    cc.Label,
		},
		phone: {
			default: null,
			type:    cc.Label,
		},
		email: {
			default: null,
			type:    cc.Label,
		},
		joinedOn: {
			default: null,
			type:    cc.Label,
		},
		cmt: cc.Label,

		nodeRank: cc.Node,
		nodeNhan: cc.Node,
		vipLevel: cc.Label,
		vipTong:  cc.Label,
		vipHien:  cc.Label,
		vipTiep:  cc.Label,
	},
	onEnable: function () {
		this.getLevel();
	},
	getLevel: function(){
		cc.RedT.send({user:{getLevel: true}});
	},
	level: function(data){
		cc.RedT.userData(data);
		var self = this;
		cc.RedT.user.vipHT  = data.vipHT-data.vipPre;
		cc.RedT.user.vipNext = data.vipNext-data.vipPre;

		cc.RedT.inGame.header.level(data.level);
		cc.RedT.inGame.header.updateEXP(cc.RedT.user.vipHT, cc.RedT.user.vipNext);

		this.vipLevel.string = "VIP"+data.level;
		this.vipTong.string  = helper.numberWithCommas(data.vipTL);
		this.vipHien.string  = helper.numberWithCommas(data.vipHT);
		this.vipTiep.string  = helper.numberWithCommas(data.vipNext);

		Promise.all(this.nodeRank.children.map(function(rank, index){
			if (rank.name <= data.level) {
				rank.color = rank.color.fromHEX('#FFFFFF');
				if(rank.name == data.level){
					self.nodeNhan.children[index].children[3].active = true;
				}else{
					self.nodeNhan.children[index].children[3].active = false;
				}
			}else{
				rank.color = rank.color.fromHEX('#5F5F5F');
				self.nodeNhan.children[index].children[3].active = false;
			}
		}))
	},
	onNhanThuong: function(){
		cc.RedT.send({user:{nhanthuong: true}});
	},
});
