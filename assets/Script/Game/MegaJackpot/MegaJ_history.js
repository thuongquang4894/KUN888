
var Helper = require('Helper');

cc.Class({
	extends: cc.Component,

	properties: {
		page:    cc.Prefab,
		header:  cc.Node,
		body:    cc.Node,
		quay:    cc.Node,
		nhanve:  cc.Node,
		select:  '',
	},
	init: function(obj){
		this.RedT = obj;
	},
	onLoad () {
		this.page = cc.instantiate(this.page);
		this.page.y = -300.91;
		this.node.addChild(this.page);
		this.page = this.page.getComponent('Pagination');

		Promise.all(this.quay.children.map(function(obj){
			return obj.getComponent('MegaJ_history_item');
		}))
		.then(result => {
			this.quay = result;
		});

		Promise.all(this.nhanve.children.map(function(obj){
			return obj.getComponent('MegaJ_top_item');
		}))
		.then(result => {
			this.nhanve = result;
		});

		this.page.init(this);
	},
	headSelect: function(event) {
		this.select = event.target.name;

		this.header.children.forEach(function(head){
			if (head.name === this.select) {
				head.children[0].active = false;
				head.children[1].active = true;
				head.pauseSystemEvents();
			}else{
				head.children[0].active = true;
				head.children[1].active = false;
				head.resumeSystemEvents();
			}
		}.bind(this));

		this.body.children.forEach(function(body){
			if (body.name === this.select) {
				body.active = true;
			}else{
				body.active = false;
			}
		}.bind(this));

		this.get_data();
	},
	onEnable: function() {
		this.get_data();
	},
	get_data: function(page = 1){
		if (!this.RedT.isSpin) {
			let data = {};
			data[this.select] = page;
			cc.RedT.send({g:{megaj:{history:data}}});
		}
	},
	onData: function(data){
		console.log(data);
		if (!!data.quay) {
			this.quayData(data.quay);
		}
		if (!!data.nhanve) {
			this.nhanveData(data.nhanve);
		}
	},
	quayData: function(data){
        this.page.onSet(data.page, data.kmess, data.total);

        this.quay.forEach(function(obj, i){
        	let dataT = data.data[i];
        	if (void 0 !== dataT) {
        		obj.node.active = true;
        		obj.bg.active = i%2;
        		obj.time.string   = Helper.getStringDateByTime(dataT.time);
        		obj.game.string   = dataT.room === 100 ? 'Thanh đồng' : (dataT.room === 100 ? 'Bạch kim' : 'Hoàng kim');
        		obj.kq.string     = dataT.kq === 5 ? 'Thêm lượt' : (dataT.kq === 7 ? '50%' : Helper.numberWithCommas(dataT.win));
        		obj.thuong.string = Helper.numberWithCommas(dataT.win);
        	}else{
        		obj.node.active = false;
        	}
        }.bind(this));
	},
	nhanveData: function(data){
		this.page.onSet(data.page, data.kmess, data.total);

        this.nhanve.forEach(function(obj, i){
        	let dataT = data.data[i];
        	if (void 0 !== dataT) {
        		obj.node.active   = true;
        		obj.bg.active     = i%2;
        		obj.time.string   = Helper.getStringDateByTime(dataT.time);
        		obj.game.string   = this.nameGame(dataT.to);
        		obj.room.string   = dataT.room === 100 ? 'Thanh đồng' : (dataT.room === 100 ? 'Bạch kim' : 'Hoàng kim');
        		obj.sl.string     = dataT.sl;
        		obj.status.string = dataT.status ? 'Đã nhận': 'Chưa nhận';
        		let temp = obj.status.node;
                if (dataT.status) {
                    temp.color = temp.color.fromHEX('#47FF00');
                }else{
                    temp.color = temp.color.fromHEX('#FF9900');
                }
        	}else{
        		obj.node.active = false;
        	}
        }.bind(this));
	},
	nameGame: function(data){
		switch(data) {
		  	case 100:
		  		return 'Angrybird';
		    	break;
		  	case 101:
		  		return 'BigBabol';
		    	break;
		  	case 102:
		  		return 'Candy';
		    	break;
		  	case 103:
		  		return 'Thần long';
		    	break;
		  	case 104:
		  		return 'Mini 3Cây';
		    	break;
		  	case 105:
		  		return 'Kho báu';
		    	break;
		  	case 106:
		  		return 'Mini Poker';
		    	break;
		}
	},
});
