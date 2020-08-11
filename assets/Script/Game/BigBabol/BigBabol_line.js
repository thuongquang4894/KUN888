
cc.Class({
	extends: cc.Component,

	properties: {
		background: cc.Node,
		nodeLine:   cc.Node,
		mainLine:   cc.Node,
	},
	init(obj){
		this.RedT = obj;
		this.mainLineInit(void 0 !== cc.RedT.setting.big_babol.line);
	},
	onEnable: function() {
		this.background.on(cc.Node.EventType.MOUSE_ENTER,  this.RedT.setTop, this.RedT);
	},
	onDisable: function() {
		this.background.off(cc.Node.EventType.MOUSE_ENTER, this.RedT.setTop, this.RedT);
	},
	toggle: function(){
		if (this.node.active && cc.RedT.setting.big_babol.line.length < 1) {
			this.RedT.addNotice('Chọn ít nhất 1 dòng');
		}else{
			this.node.active = !this.node.active;
		}
	},
	select: function(e) {
		var node = e.target;
		if (node.children[1].active) {
			node.children[1].active = false;
			node.children[0].active = true;
		}else{
			node.children[1].active = true;
			node.children[0].active = false;
		}
		this.check();
	},
	check: function() {
		var self = this;
		Promise.all(this.nodeLine.children.map(function(line, index){
			if (line.children[1].active){
				self.mainLine[index].onSet();
				return index+1;
			}else{
				self.mainLine[index].offSet();
				return void 0;
			}
		}))
		.then(result => {
			Promise.all(result.filter(function(data){
				return void 0 !== data;
			}))
			.then(data => {
				cc.RedT.setting.big_babol.line = data;
				this.RedT.labelLine.string = data.length;
			})
		})
	},
	selectChan: function() {
		var self = this;
		Promise.all(this.nodeLine.children.map(function(line, index){
			var i = index+1;
			if (i%2) {
				line.children[0].active = true;
				line.children[1].active = false;
				self.mainLine[index].offSet();
			}else{
				line.children[0].active = false;
				line.children[1].active = true;
				self.mainLine[index].onSet();
				return i;
			}
			return void 0;
		}))
		.then(result => {
			Promise.all(result.filter(function(data){
				return void 0 !== data;
			}))
			.then(data => {
				cc.RedT.setting.big_babol.line = data;
				this.RedT.labelLine.string = data.length;
			})
		})
	},
	selectLe: function() {
		var self = this;
		Promise.all(this.nodeLine.children.map(function(line, index){
			var i = index+1;
			if (i%2) {
				line.children[0].active = false;
				line.children[1].active = true;
				self.mainLine[index].onSet();
				return i;
			}else{
				line.children[0].active = true;
				line.children[1].active = false;
				self.mainLine[index].offSet();
			}
			return void 0;
		}))
		.then(result => {
			Promise.all(result.filter(function(data){
				return void 0 !== data;
			}))
			.then(data => {
				cc.RedT.setting.big_babol.line = data;
				this.RedT.labelLine.string = data.length;
			})
		})
	},
	selectAll: function(e, select) {
		var self = this;
		Promise.all(this.nodeLine.children.map(function(line, index){
			var check = select == "1";
			line.children[0].active = !check;
			line.children[1].active = check;
			return check ? index+1 : void 0;
		}))
		.then(result => {
			Promise.all(result.filter(function(data, index){
				var check = void 0 !== data;
				if (check) {
					self.mainLine[index].onSet();
				}else{
					self.mainLine[index].offSet();
				}
				return check;
			}))
			.then(data => {
				cc.RedT.setting.big_babol.line = data;
				this.RedT.labelLine.string = data.length;
			})
		});
	},

	// Main line
	mainLineInit: function(reInit){
		var self = this;;
		Promise.all(this.mainLine.children.map(function(line){
			return line.getComponent('BigBabol_main_line')
					.init(self.RedT);
		}))
		.then(result => {
			this.mainLine = result;
			if (reInit) {
				this.RedT.labelLine.string = cc.RedT.setting.big_babol.line.length;
				Promise.all(this.nodeLine.children.map(function(line, index){
					var check = cc.RedT.setting.big_babol.line.filter(function(a){
						return a == line.name;
					});
					if (check.length) {
						line.children[0].active = false;
						line.children[1].active = true;
						self.mainLine[index].onSet();
					}else{
						line.children[0].active = true;
						line.children[1].active = false;
						self.mainLine[index].offSet();
					}
				}));
			}else{
				this.selectAll(null, "1");
			}
		})
	},
});
