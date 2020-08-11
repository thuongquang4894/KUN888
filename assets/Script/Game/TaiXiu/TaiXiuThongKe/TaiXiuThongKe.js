
cc.Class({
	extends: cc.Component,

	properties: {
		background: {
			default: null,
			type:    cc.Node
		},
		header: {
			default: null,
			type:    cc.Node
		},
		body: {
			default: null,
			type:    cc.Node
		},
		nodeTaiXiu: {
			default: null,
			type:    cc.Node
		},
		nodeChanLe: {
			default: null,
			type:    cc.Node
		},
		KetQuaLeft: {
			default: null,
			type:    cc.Label
		},
		KetQuaRight: {
			default: null,
			type:    cc.Label
		},
		KetQuaDot: {
			default: null,
			type:    cc.Node
		},
		DiemSoCel: {
			default: null,
			type:    cc.Node
		},
		DiemSoLeft: {
			default: null,
			type:    cc.Label
		},
		DiemSoRight: {
			default: null,
			type:    cc.Label
		},
		node1: {
			default: null,
			type:    cc.Node
		},
		node2: {
			default: null,
			type:    cc.Node
		},
		dice1_line: {
			default: null,
			type:    cc.Graphics
		},
		dice2_line: {
			default: null,
			type:    cc.Graphics
		},
		dice3_line: {
			default: null,
			type:    cc.Graphics
		},
		tong_line: {
			default: null,
			type:    cc.Graphics
		},
		dice1_dot: {
			default: null,
			type:    cc.Node
		},
		dice2_dot: {
			default: null,
			type:    cc.Node
		},
		dice3_dot: {
			default: null,
			type:    cc.Node
		},
		tong_dot: {
			default: null,
			type:    cc.Node
		},
		line_dotT: {
			default: null,
			type:    cc.Node
		},
		line_dot1: {
			default: null,
			type:    cc.Node
		},
		line_dot2: {
			default: null,
			type:    cc.Node
		},
		line_dot3: {
			default: null,
			type:    cc.Node
		},
	},
	init(obj){
		this.RedT  = obj;

		if (void 0 !== cc.RedT.setting.taixiu.tk_position) {
			this.node.position = cc.RedT.setting.taixiu.tk_position;
		}

		if (void 0 !== cc.RedT.setting.taixiu.tk_active) {
			this.node.active = cc.RedT.setting.taixiu.tk_active;
		}

		//KetQuaDot
		Promise.all(this.KetQuaDot.children.map(function(obj){
			return obj.getComponent(cc.Sprite);
		}))
		.then(result => {
			this.KetQuaDot = result;
		});

		//DiemSoCel
		Promise.all(this.DiemSoCel.children.map(function(cel){
			cel.RedT = Promise.all(cel.children.map(function(obj){
				obj.text = obj.children[0].getComponent(cc.Label);
				return obj;
			}));
			cel.RedT.then(function(value){
				cel.RedT = value;
			})
			return cel;
		}))
		.then(result => {
			this.DiemSoCel = result;
		});

		//dice1_dot
		Promise.all(this.dice1_dot.children.map(function(dot){
			dot.text = dot.children[0].getComponent(cc.Label);
			return dot;
		}))
		.then(result => {
			this.dice1_dots = result;
		});

		//dice2_dot
		Promise.all(this.dice2_dot.children.map(function(dot){
			dot.text = dot.children[0].getComponent(cc.Label);
			return dot;
		}))
		.then(result => {
			this.dice2_dots = result;
		});

		//dice3_dot
		Promise.all(this.dice3_dot.children.map(function(dot){
			dot.text = dot.children[0].getComponent(cc.Label);
			return dot;
		}))
		.then(result => {
			this.dice3_dots = result;
		});

		//tong_dot
		Promise.all(this.tong_dot.children.map(function(dot){
			dot.text = dot.children[0].getComponent(cc.Label);
			return dot;
		}))
		.then(result => {
			this.tong_dots = result;
		});
	},
	onLoad () {
		this.ttOffset = null;

		Promise.all(this.header.children.map(function(obj) {
			return obj.getComponent('itemContentMenu');
		}))
		.then(result => {
			this.header = result;
		});
	},
	onEnable: function () {
		this.background.on(cc.Node.EventType.TOUCH_START,  this.eventStart, this);
		this.background.on(cc.Node.EventType.TOUCH_MOVE,   this.eventMove,  this);
		this.background.on(cc.Node.EventType.TOUCH_END,    this.eventEnd,   this);
		this.background.on(cc.Node.EventType.TOUCH_CANCEL, this.eventEnd,   this);
		this.background.on(cc.Node.EventType.MOUSE_ENTER,  this.setTop,     this);
	},
	onDisable: function () {
		this.background.off(cc.Node.EventType.TOUCH_START,  this.eventStart, this);
		this.background.off(cc.Node.EventType.TOUCH_MOVE,   this.eventMove,  this);
		this.background.off(cc.Node.EventType.TOUCH_END,    this.eventEnd,   this);
		this.background.off(cc.Node.EventType.TOUCH_CANCEL, this.eventEnd,   this);
		this.background.off(cc.Node.EventType.MOUSE_ENTER,  this.setTop,     this);
	},
	onChangerGame: function(){
		this.nodeTaiXiu.active = !this.nodeTaiXiu.active;
		this.nodeChanLe.active = !this.nodeChanLe.active;
	},
	eventStart: function(e){
		this.setTop();
		this.ttOffset = cc.v2(e.touch.getLocationX() - this.node.position.x, e.touch.getLocationY() - this.node.position.y)
	},
	eventMove: function(e){
		this.node.position = cc.v2(e.touch.getLocationX() - this.ttOffset.x, e.touch.getLocationY() - this.ttOffset.y);
	},
	eventEnd: function(){
		cc.RedT.setting.taixiu.tk_position = this.node.position;
	},
	setTop: function(){
		this.node.parent.insertChild(this.node);
		this.RedT.setTop();
	},
	onSelectHeader: function(event, name) {
		Promise.all(this.header.map(function(header) {
			if (header.node.name == name) {
				header.select();
			}else{
				header.unselect();
			}
		}));
		Promise.all(this.body.children.map(function(body) {
			if (body.name == name) {
				body.active = true;
			}else{
				body.active = false;
			}
		}));
	},
	onToggleClick: function() {
		cc.RedT.audio.playClick();
		this.setTop();
		this.node.active = cc.RedT.setting.taixiu.tk_active = !this.node.active;
	},
	onChangerClick: function() {
		this.node1.active = !this.node1.active;
		this.node2.active = !this.node2.active;
	},
	draw: function(line, node, data) {
		line.clear();
		var o = data.length;
		for (var n = 0; n < o; n++){
			var nodeT = node[n],
				point = data[n];
			nodeT.text.string = point.dice;
			nodeT.position = cc.v2(nodeT.position.x, point.y);
			0 === n ? line.moveTo(point.x, point.y) : (line.lineTo(point.x, point.y));
		}
		line.stroke();
	},
	draw_Tong: function(obj, data) {
		obj.clear()
		for (var n = 0, o = data.length; n < o; n++){
			var temp = data[n],
				line = this.tong_dots[n];
			0 === n ? obj.moveTo(temp.x, temp.y) : (obj.lineTo(temp.x, temp.y));
			line.text.string = temp.tong;
			line.text.node.color = this.RedT.TX_Main.taixiu ? (temp.tong > 10 ? cc.Color.WHITE : cc.Color.BLACK) : (temp.tong%2 ? cc.Color.WHITE : cc.Color.BLACK);
			line.position = cc.v2(line.position.x, temp.y);
			line.color    = this.RedT.TX_Main.taixiu ? (temp.tong > 10 ? cc.Color.BLACK : cc.Color.WHITE) : (temp.tong%2 ? cc.Color.BLACK : cc.Color.YELLOW);
		}
		obj.stroke();
	},
	lineAc: function(index, bool) {
		this.dice1_dots[index].active = bool;
		this.dice2_dots[index].active = bool;
		this.dice3_dots[index].active = bool;
		this.tong_dots[index].active  = bool;
	},
	showLineTong: function() {
		cc.RedT.audio.playClick();
		this.tong_dot.active = !this.tong_dot.active;
		this.tong_line.node.active = !this.tong_line.node.active;
		this.line_dotT.active = !this.line_dotT.active;
	},
	showLineDice1: function() {
		cc.RedT.audio.playClick();
		this.dice1_dot.active = !this.dice1_dot.active;
		this.dice1_line.node.active = !this.dice1_line.node.active;
		this.line_dot1.active = !this.line_dot1.active;
	},
	showLineDice2: function() {
		cc.RedT.audio.playClick();
		this.dice2_dot.active = !this.dice2_dot.active;
		this.dice2_line.node.active = !this.dice2_line.node.active;
		this.line_dot2.active = !this.line_dot2.active;
	},
	showLineDice3: function() {
		cc.RedT.audio.playClick();
		this.dice3_dot.active = !this.dice3_dot.active;
		this.dice3_line.node.active = !this.dice3_line.node.active;
		this.line_dot3.active = !this.line_dot3.active;
	},
});
