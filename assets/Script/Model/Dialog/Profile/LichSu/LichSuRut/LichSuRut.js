
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
		this.isView = false;
		Promise.all(this.content.children.map(function(obj){
			return obj.getComponent('LichSuRut_item');
		}))
		.then(resulf => {
			this.content = resulf;
		});
	},
	onEnable: function () {
		this.get_data();
	},
	get_data: function(page = 1){
		!this.isView && cc.RedT.send({user:{history:{mua_the:{page:page}}}});
		this.isView = false;
	},
	//onDisable: function () {
	//},

	onData: function(data){
		Promise.all(this.content.map(function(obj, index){
			var dataT = data[index];
			if (void 0 !== dataT) {
				obj.node.active = true;
				obj.GD.string      = dataT.GD;
				obj.Time.string    = Helper.getStringDateByTime(dataT.time);
				obj.NhaMang.string = dataT.nhaMang;
				obj.MenhGia.string = Helper.numberWithCommas(dataT.menhGia);
				obj.SoLuong.string = dataT.soLuong;
		        obj.Cost.string    = Helper.numberWithCommas(dataT.Cost);
				obj.Status.string     = dataT.status == 0 ? "Chờ Duyệt" : (dataT.status == 1 ? "Thành Công" : (dataT.status == 2 ? "Bị Huỷ" : ""));
				obj.Status.node.color = dataT.status == 0 ? cc.color(45, 171, 255, 255) : (dataT.status == 1 ? cc.color(0, 255, 71, 255) : (dataT.status == 2 ? cc.color(255, 0, 0, 255) : cc.color(45, 171, 255, 255)));
				if (dataT.status == 1) {
					obj.idT  = dataT._id;
					obj.info = true;
				}else{
					obj.idT  = null;
					obj.info = false;
				}
			}else{
				obj.node.active = false;
			}
		}));
	},
});
