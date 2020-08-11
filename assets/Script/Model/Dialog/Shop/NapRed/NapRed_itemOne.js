
cc.Class({
    extends: cc.Component,

    properties: {
    	background: {
            default: null,
            type: cc.Node,
        },
        text: {
            default: null,
            type: cc.Label,
        },
    },

    init:function(obj, i_arg, i_text) {
    	this.controll    = obj;
    	this.local_arg   = i_arg;
    	this.local_text  = i_text;
    },
    onClickChanger: function(){
    	cc.RedT.audio.playClick();
    	var self = this;
    	this.controll[this.local_text].string = this.text.string;
    	Promise.all(this.controll[this.local_arg].map(function(obj){
    		if (obj == self) {
    			obj.onSelect()
    		}else{
    			obj.unSelect()
    		}
        }));
        
        if (!!this.controll.backT) {
            this.controll.backT(this.data);
        }
    },

    onClickChose: function(){
    	cc.RedT.audio.playClick();
    	var self = this;
    	this.controll[this.local_text].string = this.text.string;
        this.unSelect()
        cc.log("onClickChose:"+!!this.controll.backT);
        if (!!this.controll.backT) {
            this.controll.backT(this.data);
        }
    },

    onSelect: function(){
        this.background.active = true;
    	this.node.pauseSystemEvents();
    },
    unSelect: function(){
        this.background.active = false;
    	this.node.resumeSystemEvents();
    },
});
