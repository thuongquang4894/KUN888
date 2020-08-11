
var Helper = require('Helper')

cc.Class({
    extends: cc.Component,

    properties: {
        page:     cc.Prefab,
        content:  cc.Node,
        cointRed: cc.Node,
        cointXu:  cc.Node,
        red:      true,
        isLoad:   false,
    },
    onLoad () {
        var page = cc.instantiate(this.page);
        page.y = -275;
        this.node.addChild(page);
        this.page = page.getComponent('Pagination');
        Promise.all(this.content.children.map(function(obj){
            var tea = Promise.all(obj.children.map(function(t, index){
                if (index === 3) {
                    return Promise.all(t.children.map(function(card){
                        return card.getComponent(cc.Sprite);
                    }))
                }else{
                    return t.getComponent(cc.Label);
                }
            }));
            return tea.then(ta => {
                return ta
            });
        }))
        .then(tab => {
            this.content2 = tab;
        })
        this.page.init(this);
    },
    onEnable: function() {
        !this.isLoad && this.get_data();
    },
    onDisable: function() {
    },
    get_data: function(page = 1){
        this.isLoad = true;
        cc.RedT.send({g:{mini_poker:{log:{red: this.red, page: page}}}});
    },
    changerCoint: function(){
        this.red             = !this.red;
        this.cointRed.active = !this.cointRed.active;
        this.cointXu.active  = !this.cointXu.active;
        this.get_data();
    },
    onData: function(data){
        var self = this
        this.page.onSet(data.page, data.kmess, data.total)
        Promise.all(this.content2.map(function(obj, i){
            var dataT = data.data[i]
            if (void 0 !== dataT) {
                self.content.children[i].active = true
                obj[0].string = Helper.getStringDateByTime(dataT.time);
                obj[1].string = dataT.id;
                obj[2].string = Helper.numberWithCommas(dataT.bet);
                Promise.all(obj[3].map(function(card, index){
                    card.spriteFrame = cc.RedT.util.card.getCard(dataT.kq[index].card, dataT.kq[index].type);
                }));
                obj[4].string = Helper.numberWithCommas(dataT.win);
            }else{
                self.content.children[i].active = false
            }
        }))
    },
    reset: function(){
        this.isLoad    = false;
        Promise.all(this.content.children.map(function(obj){
            obj.active = false
        }))
    },
});
