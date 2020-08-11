
cc.Class({
	extends: cc.Component,

	init(obj){
		this.RedT = obj;
		return this;
	},
	onEnable: function() {
		this.node.on(cc.Node.EventType.MOUSE_ENTER, this.onhover, this);
		this.node.on(cc.Node.EventType.MOUSE_LEAVE, this.offhover, this);
	},
	onDisable: function() {
		this.node.off(cc.Node.EventType.MOUSE_ENTER, this.onhover, this);
		this.node.off(cc.Node.EventType.MOUSE_LEAVE, this.offhover, this);
	},
	onhover: function(){
		this.node.children[1].active = true;
		this.defColor = this.node.children[0].children[1].color;
		this.node.children[0].children[0].active = true;
		this.node.children[0].children[1].color = this.node.color.fromHEX(this.RedT.onColor);
	},
	offhover: function(){
		this.node.children[1].active = false;
		this.node.children[0].children[0].active = false;
		this.node.children[0].children[1].color = this.defColor;
	},
	onEf: function(){
		this.onhover();
		this.node.pauseSystemEvents();
	},
	offEf: function(){
		this.offhover();
		this.node.resumeSystemEvents();
	},
});
