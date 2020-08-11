
var Helper = require('Helper');

cc.Class({
	extends: cc.Component,

	properties: {
		content: {
			default: null,
			type:    cc.Node,
		},
	},
	onLoad () {
		Promise.all(this.content.children.map(function(obj){
			return obj.getComponent('LichSuNap_item');
		}))
		.then(resulf => {
			this.content = resulf;
		});
	},
	onEnable: function () {
		this.get_data();
	},
	get_data: function(page = 1){
		cc.RedT.send({user:{history:{nap_red:{page:page}}}});
	},
	//onDisable: function () {
	//},

	onData: function(data){
		Promise.all(this.content.map(function(obj, index){
			var dataT = data[index];
			if (void 0 !== dataT) {
				obj.node.active = true;
				obj.GD.string      = dataT._id;
				obj.Time.string    = Helper.getStringDateByTime(dataT.time);
				obj.NhaMang.string = dataT.nhaMang;
				obj.MenhGia.string = Helper.numberWithCommas(dataT.menhGia);
				obj.Nhan.string    = Helper.numberWithCommas(dataT.nhan);
				obj.Seri.string    = dataT.seri;
				obj.Status.string     = dataT.status == 0 ? "Chờ Duyệt" : (dataT.status == 1 ? "Thành Công" : (dataT.status == 2 ? "Thẻ Sai" : ""));
				obj.Status.node.color = dataT.status == 0 ? cc.color(45, 171, 255, 255) : (dataT.status == 1 ? cc.color(0, 255, 71, 255) : (dataT.status == 2 ? cc.color(255, 0, 0, 255) : cc.color(45, 171, 255, 255)));
			}else{
				obj.node.active = false;
			}
		}));
	},
});
