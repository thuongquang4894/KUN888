
var Helper = require('Helper');

cc.Class({
    extends: cc.Component,

    properties: {
        page:     cc.Prefab,
        content:  cc.Node,
        cointRed: cc.Node,
        cointXu:  cc.Node,
        red:      true,
    },
    onLoad () {
        var page = cc.instantiate(this.page);
        page.y = -275;
        this.node.addChild(page);
        this.page = page.getComponent('Pagination');
        Promise.all(this.content.children.map(function(obj){
            var tea = Promise.all(obj.children.map(function(t, index){
                return t.getComponent(cc.Label);
            }));
            return tea.then(ta => {
                return ta;
            });
        }))
        .then(tab => {
            this.content2 = tab;
        })
        this.page.init(this);
    },
    onEnable: function() {
        this.get_data();
    },
    onDisable: function() {
    },
    get_data: function(page = 1){
        cc.RedT.send({g:{big_babol:{log:{red: this.red, page: page}}}});
    },
    changerCoint: function(){
        this.red             = !this.red;
        this.cointRed.active = !this.cointRed.active;
        this.cointXu.active  = !this.cointXu.active;
        this.get_data();
    },
    onData: function(data){
        var self = this;
        this.page.onSet(data.page, data.kmess, data.total);
        Promise.all(this.content2.map(function(obj, i){
            var dataT = data.data[i]
            if (void 0 !== dataT) {
                self.content.children[i].active = true
                obj[0].string = Helper.getStringDateByTime(dataT.time);
                obj[1].string = dataT.id;
                obj[2].string = Helper.numberWithCommas(dataT.bet);
                obj[3].string = dataT.kq + " Dòng";
                obj[4].string = Helper.numberWithCommas(dataT.win);
                var temp = obj[2].node;
                if (self.red) {
                    temp.color = temp.color.fromHEX('#FFF500');
                    obj[4].node.color = temp.color;
                }else{
                    temp.color = temp.color.fromHEX('#FFFFFF');
                    obj[4].node.color = temp.color;
                }
            }else{
                self.content.children[i].active = false
            }
        }))
    },
    reset: function(){
        Promise.all(this.content.children.map(function(obj){
            obj.active = false
        }))
    },
});
