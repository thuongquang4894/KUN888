
var helper = require('Helper');

cc.Class({
	extends: cc.Component,
	properties: {
		page:     cc.Prefab,
		content:  cc.Node,
		cointRed: cc.Node,
		cointXu:  cc.Node,
		red:      true,
	},
	init(obj){
		this.RedT = obj;
	},
	onLoad () {
		this.page = cc.instantiate(this.page);
		this.page.y = -307;
		this.node.addChild(this.page);
		this.page = this.page.getComponent('Pagination');
		Promise.all(this.content.children.map(function(obj){
			return obj.getComponent('BauCua_ls_item');
		}))
		.then(result => {
			this.content = result;
		})
		this.page.init(this);
	},
	onEnable: function() {
		this.get_data();
	},
	//onDisable: function() {
	//},
	get_data: function(page = 1){
		cc.RedT.send({g:{baucua:{viewlogs:{red: this.red, page: page}}}});
	},
	changerCoint: function(){
		this.red             = !this.red;
		this.cointRed.active = !this.cointRed.active;
		this.cointXu.active  = !this.cointXu.active;
		this.get_data();
	},
	onData: function(data){
		var self = this;
		this.page.onSet(data.page, data.kmess, data.total);
		Promise.all(this.content.map(function(obj, i){
			var dataT = data.data[i]
			if (void 0 !== dataT) {
				obj.node.active  = true
				obj.time.string  = helper.getStringDateByTime(dataT.time);
				obj.phien.string = dataT.phien;
				obj.thang.string = helper.numberWithCommas(dataT.betwin);
				Promise.all(obj.kq.map(function(kq, j){
					kq.spriteFrame = self.RedT.iconMini[dataT.kq[j]];
				}))
				Promise.all(obj.datLabel.map(function(cuoc, k){
					if (dataT[k] > 0) {
						cuoc.node.parent.active = true;
						cuoc.string = helper.nFormatter(dataT[k], 1);
					}else{
						cuoc.node.parent.active = false;
					}
				}))
			}else{
				obj.node.active = false
			}
		}))
	},
	/**
	reset: function(){
		Promise.all(this.content.children.map(function(obj){
			obj.node.active = false;
		}))
	},
	*/
});
