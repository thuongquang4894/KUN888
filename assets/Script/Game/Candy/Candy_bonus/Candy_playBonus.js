
var helper = require('Helper');

cc.Class({
    extends: cc.Component,

    properties: {
        numberBonus: cc.Label,
        listBox:     cc.Node,
        notice:      cc.Node,
        numberWin:   cc.Label,
        icons: {
            default: [],
            type: cc.SpriteFrame,
        },
    },
    init: function(obj){
        this.RedT = obj;
        Promise.all(this.listBox.children.map(function(box){
            return box.getComponent('Candy_bonus_item');
        }))
        .then(result => {
            this.listBox = result;
        })
    },
    onPlay: function(){
        this.reset();
        this.node.active = true;
        this.numberBonus.string = 10;
    },
    onClickBox: function(e) {
        if (!!this.numberBonus.string) {
           cc.RedT.audio.playClick();
            this.onSend(e.target.name);
        }
    },
    closeNotice: function(){
        this.notice.active = this.node.active = false;
        this.RedT.hieuUng();
    },
    onData: function(data){
        if (void 0 !== data.box) {
            var obj = this.listBox[data.box];
            obj.text.string = helper.numberWithCommas(data.bet);
            this.numberBonus.string = data.bonus;
        }
        if (void 0 !== data.win) {
            this.notice.active = true;
            this.numberWin.string = helper.numberWithCommas(data.win);
            this.RedT.vuathang.string = helper.numberWithCommas(helper.getOnlyNumberInString(this.RedT.vuathang.string)*1 + data.win);
        }
    },
    onSend: function(box){
        cc.RedT.send({g:{candy:{bonus:{box:box}}}});
    },
    reset: function(){
        var self = this;
        Promise.all(this.listBox.map(function(box){
            var icon = (Math.random()*5)>>0;
            box.item.spriteFrame = self.icons[icon];
            box.text.string      = "";
        }));
    },
});
