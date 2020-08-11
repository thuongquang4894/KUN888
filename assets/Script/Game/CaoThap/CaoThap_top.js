
var helper = require('Helper');

cc.Class({
    extends: cc.Component,
    properties: {
        item:     cc.Prefab,
        content:  cc.Node,
        cointRed: cc.Node,
        cointXu:  cc.Node,
        red:      true,
    },
    init(obj){
        this.RedT = obj;
    },
    onEnable: function() {
        this.get_data();
    },
    get_data: function(page = 1){
        cc.RedT.send({g:{caothap:{tops: this.red}}});
    },
    changerCoint: function(){
        this.red             = !this.red;
        this.cointRed.active = !this.cointRed.active;
        this.cointXu.active  = !this.cointXu.active;
        this.get_data();
    },
    onData: function(data){
        this.content.removeAllChildren();
        var self = this;
        Promise.all(data.map(function(obj, index){
            var item = cc.instantiate(self.item);
            var itemComponent = item.getComponent('CaoThap_top_item');
            itemComponent.time.string = helper.getStringDateByTime(obj.time);
            itemComponent.nick.string = obj.name;
            itemComponent.cuoc.string = helper.numberWithCommas(obj.goc);
            itemComponent.win.string  = helper.numberWithCommas(obj.bet);
            itemComponent.nohu.string = obj.a ? "Nổ Hũ" : "Thắng lớn";
            item.children[0].active   = !(index&1);
            self.content.addChild(item);
        }))
    },
});
