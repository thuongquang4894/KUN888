
cc.Class({
	extends: cc.Component,

	properties: {
		icon: cc.Sprite,
	},
	init(obj){
		this.RedT = obj;
	},
	random: function(){
		var icon = ~~(Math.random()*7);
		this.setIcon(icon);
		return icon;
	},
	setIcon: function(icon, data = false){
		this.icon.spriteFrame = this.RedT.icons[icon];
		if (data) {
			this.data = icon;
		}
	},
});
