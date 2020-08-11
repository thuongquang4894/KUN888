
cc.Class({
    extends: cc.Component,

    properties: {
       game:    cc.Node,
       content: cc.Node,
       title:   cc.Label,
    },
    init: function(){
        Promise.all(this.game.children.map(function(obj){
            return obj.children[1].getComponent(cc.Label);
        }))
        .then(result => {
            this.game = result;
        })
    },
    selectGame: function(event, game) {
        this.select(game)
    },
    select: function(game) {
        cc.RedT.audio.playClick();
        var self = this;
        Promise.all(this.game.map(function(obj){
            var parent = obj.node.parent;
            if (parent.name == game) {
                parent.children[0].active = true;
                parent.pauseSystemEvents();
                self.title.string = obj.string;
            }else{
                parent.children[0].active = false;
                parent.resumeSystemEvents();
            }
            return void 0;
        }))

        Promise.all(this.content.children.map(function(obj){
            if (obj.name == game) {
                obj.active = true;
            }else{
                obj.active = false;
            }
            return void 0;
        }))
    },
});
