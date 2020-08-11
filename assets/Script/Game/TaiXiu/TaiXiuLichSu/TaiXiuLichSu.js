
var Helper = require('Helper'),
	Pagination = require('Pagination');

cc.Class({
	extends: cc.Component,
	properties: {
		content: cc.Node,
		page: Pagination,
	},
	init(obj){
		this.RedT = obj;
	},
	onLoad () {
		this.page.init(this);
		Promise.all(this.content.children.map(function(obj) {
			return obj.getComponent('TaiXiuLichSu_item');
		}))
		.then(result => {
			this.content = result;
		})
	},
	onEnable: function () {
		this.get_data();
	},
	onDisable: function () {
	},
	get_data: function(page = 1){
		cc.RedT.send({taixiu:{get_log: {page: page}}});
	},
	onData: function(data){
		this.page.onSet(data.page, data.kmess, data.total);
		Promise.all(this.content.map(function(obj, index){
			var dataT = data.data[index];
			if (void 0 !== dataT) {
				obj.node.active = true;
				var tong = dataT.dice1 + dataT.dice2 + dataT.dice3;
				obj.time.string   = Helper.getStringDateByTime(dataT.time);
				obj.phien.string  = dataT.phien;
				obj.dat.string    = dataT.taixiu ? (dataT.select ? 'Tài' : 'Xỉu') : (dataT.select ? 'Chẵn' : 'Lẻ');
				obj.ketqua.string = dataT.dice1 + '-' + dataT.dice2 + '-' + dataT.dice3 + '  ' + tong;
				obj.cuoc.string   = Helper.numberWithCommas(dataT.bet);
				obj.tralai.string = Helper.numberWithCommas(dataT.tralai);
				cc.log("dataT:"+JSON.stringify(dataT));
				obj.donvi.string  = Helper.numberWithCommas(dataT.betwin);
				obj.donvi.node.color = dataT.red ? cc.Color.YELLOW : obj.donvi.node.color.fromHEX('#E2E2E2');

				obj.time.node.color = dataT.win ? cc.Color.YELLOW : obj.time.node.color.fromHEX('#E2E2E2');
				obj.dat.node.color  = dataT.win ? cc.Color.YELLOW : obj.dat.node.color.fromHEX('#E2E2E2');
			}else{
				obj.node.active = false;
			}
		}));
	},
});
