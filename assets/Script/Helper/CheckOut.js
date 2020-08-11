
cc.Class({
    extends: cc.Sprite,

    properties: {
        nut: {
            default: null,
            type: cc.Sprite,
        },
        NutOn: {
            default: null,
            type: cc.SpriteFrame,
        },
        NutOff: {
            default: null,
            type: cc.SpriteFrame,
        },
        BgOn: {
            default: null,
            type: cc.SpriteFrame,
        },
        BgOff: {
            default: null,
            type: cc.SpriteFrame,
        },
        isChecked: false,
    },
    start() {
    	var self = this;
    	this.actionOn  = cc.sequence(cc.moveTo(0.1, cc.v2(30, 0)), cc.callFunc(function() {
                    self.spriteFrame = self.BgOn;
                    self.nut.spriteFrame = self.NutOn;
                }));
    	this.actionOff = cc.sequence(cc.moveTo(0.1, cc.v2(-30, 0)), cc.callFunc(function() {
                    self.spriteFrame = self.BgOff;
                    self.nut.spriteFrame = self.NutOff;
                }));
    	this.OnUpdate();
    },

    OnChangerClick: function() {
    	this.isChecked = !this.isChecked;
    	this.OnUpdate();
    },
    OnUpdate: function() {
    	if(!this.isChecked){
    		this.nut.node.stopAllActions();
    		if(this.actionOff){
                this.nut.node.runAction(this.actionOff)
            }
    	}else{
    		this.nut.node.stopAllActions()
    		if(this.actionOn){
                this.nut.node.runAction(this.actionOn)
            }
    	}
    },
});
