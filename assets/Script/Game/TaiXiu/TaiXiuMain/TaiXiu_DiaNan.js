
cc.Class({
    extends: cc.Component,
    init(obj){
        this.RedT = obj;
    },
    onLoad () {
        this.ttOffset = null;
    },
    onEnable: function () {
        this.node.on(cc.Node.EventType.TOUCH_START,  this.eventStart, this);
        this.node.on(cc.Node.EventType.TOUCH_MOVE,   this.eventMove,  this);
        this.node.on(cc.Node.EventType.TOUCH_END,    this.eventEnd,   this);
        this.node.on(cc.Node.EventType.TOUCH_CANCEL, this.eventEnd,   this);
        this.node.on(cc.Node.EventType.MOUSE_ENTER,  this.setTop,     this);
    },
    onDisable: function () {
        this.node.off(cc.Node.EventType.TOUCH_START,  this.eventStart, this);
        this.node.off(cc.Node.EventType.TOUCH_MOVE,   this.eventMove,  this);
        this.node.off(cc.Node.EventType.TOUCH_END,    this.eventEnd,   this);
        this.node.off(cc.Node.EventType.TOUCH_CANCEL, this.eventEnd,   this);
        this.node.off(cc.Node.EventType.MOUSE_ENTER,  this.setTop,     this);
    },
    eventStart: function(e){
        this.setTop();
        this.ttOffset  = cc.v2(e.touch.getLocationX() - this.node.position.x, e.touch.getLocationY() - this.node.position.y);
    },
    eventMove: function(e){
        this.node.position = cc.v2(e.touch.getLocationX() - this.ttOffset.x, e.touch.getLocationY() - this.ttOffset.y);
    },
    eventEnd: function(){},
    setTop: function(){
        this.RedT.setTop();
    },
});
