
cc.Class({
    extends: cc.Component,

    init(obj){
    	this.RedT = obj;
    },
    onLoad () {
    	this.icon = this.node.children[0].getComponent(cc.Sprite);
    },
    stop: function() {
    	Promise.all(this.node.children.map(function(node){
    		var animation = node.getComponents(cc.Animation);
    		Promise.all(animation.map(function(k){
    			node.removeComponent(k);
	    	}));
    	}));
    },
    random: function(){
    	var icon = ~~(Math.random()*6);
    	this.setIcon(icon);
        return icon;
    },
    setIcon:function(icon, data = false){
    	if (icon < 4) {
    		this.node.children[0].active = true;
    		this.icon.spriteFrame        = this.RedT.icons[icon];
    		this.node.children[1].active = this.node.children[2].active = false;
    	}else if (icon == 4) {
    		this.node.children[1].active = true;
    		this.node.children[0].active = this.node.children[2].active = false;
    	}else if (icon == 5) {
    		this.node.children[2].active = true;
    		this.node.children[0].active = this.node.children[1].active = false;
    	}
        if (data) {
            this.data = icon;
        }
    },
});
