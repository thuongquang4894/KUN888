
cc.Class({
    extends: cc.Component,
    properties: {
        icon: {
            default: null,
            type: cc.Sprite,
        },
    },
    init(obj){
        this.RedT = obj;
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
        var icon = ~~(Math.random()*7);
        this.setIcon(icon);
        return icon;
    },
    setIcon: function(icon, data = false){
        if (icon == 4) {
            this.node.children[1].active = true;
            this.node.children[0].active = this.node.children[2].active = false;
        }else if (icon == 6) {
            this.node.children[2].active = true;
            this.node.children[0].active = this.node.children[1].active = false;
        } else {
            this.node.children[0].active = true;
            this.node.children[1].active = this.node.children[2].active = false;
            this.icon.spriteFrame        = icon == 5 ? this.RedT.icons[icon-1] : this.RedT.icons[icon];
        }
        if (data) {
            this.data = icon;
        }
    },
});
