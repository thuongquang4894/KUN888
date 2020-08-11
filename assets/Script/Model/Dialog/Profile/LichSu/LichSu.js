
cc.Class({
	extends: cc.Component,

	properties: {
		header:       cc.Node,
		pagination:   cc.Node,
		lichSuNap:    cc.Node,
		lichSuRut:    cc.Node,
		lichSuMuaXu:  cc.Node,
		lichSuChuyen: cc.Node,
		lichSuBank:   cc.Node,
	},
	onLoad(){
		this.history = "LichSuNap";
		this.lichSuNap    = this.lichSuNap.getComponent('LichSuNap');
		this.lichSuRut    = this.lichSuRut.getComponent('LichSuRut');
		this.lichSuMuaXu  = this.lichSuMuaXu.getComponent('LichSuMuaXu');
		this.lichSuChuyen = this.lichSuChuyen.getComponent('LichSuChuyen');
		this.lichSuBank   = this.lichSuBank.getComponent('LichSuBank');

		this.body = [this.lichSuNap.node, this.lichSuRut.node, this.lichSuMuaXu.node, this.lichSuChuyen.node, this.lichSuBank.node];

		this.pagination = this.pagination.getComponent('Pagination');
		this.pagination.init(this);

		Promise.all(this.header.children.map(function(obj) {
			return obj.getComponent('itemContentMenu');
		}))
		.then(result => {
			this.header = result;
		});
	},
	onSelectHead: function(event, name){
		this.history = name;
		Promise.all(this.header.map(function(header) {
			if (header.node.name == name) {
				header.select();
			}else{
				header.unselect();
			}
		}));
		Promise.all(this.body.map(function(body) {
			if (body.name == name) {
				body.active = true;
			}else{
				body.active = false;
			}
		}));
	},
	get_data: function(page = 1){
		switch(this.history) {
		  case "LichSuNap":
				this.lichSuNap.get_data(page);
			break;

			case "LichSuRut":
				this.lichSuRut.get_data(page);
			break;

			case "LichSuMuaXu":
				this.lichSuMuaXu.get_data(page);
			break;

			case "LichSuChuyen":
				this.lichSuChuyen.get_data(page);
			break;

			case "LichSuBank":
				this.lichSuChuyen.get_data(page);
			break;
		}
	},
	onData: function(data){
		cc.log("onData LichSu:"+JSON.stringify(data));
		this.pagination.onSet(data.page, data.kmess, data.total);

		if (void 0 !== data.nap_red){
			this.lichSuNap.onData(data.nap_red);
		}
		if (void 0 !== data.mua_the){
			this.lichSuRut.onData(data.mua_the);
		}
		if (void 0 !== data.mua_xu){
			this.lichSuMuaXu.onData(data.mua_xu);
		}
		if (void 0 !== data.chuyen_red){
			this.lichSuChuyen.onData(data.chuyen_red);
		}
		if (void 0 !== data.bank){
			this.lichSuBank.onData(data.bank);
		}
	},
});
