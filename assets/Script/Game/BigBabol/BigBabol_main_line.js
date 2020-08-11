
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
		this.defColor = this.node.color;
		this.node.children[1].active = true;
		this.node.color = this.node.color.fromHEX(this.RedT.onColor);
	},
	offhover: function(){
		this.node.color = this.defColor;
		this.node.children[1].active = false;
	},
	onSet:function(){
		this.node.color = this.node.color.fromHEX(this.RedT.onColor);
	},
	offSet:function(){
		this.node.color = this.node.color.fromHEX(this.RedT.offColor);
	},
});
