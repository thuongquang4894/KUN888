
cc.Class({
    extends: cc.Component,

    properties: {
        nodeUnSelect: {
            default: null,
            type:    cc.Node,
        },
        nodeSelect: {
            default: null,
            type:    cc.Node,
        }
    },
    select: function() {
        this.nodeUnSelect.active = false;
        this.nodeSelect.active   = true;
        this.node.pauseSystemEvents();
    },
    unselect: function() {
        this.nodeUnSelect.active = true;
        this.nodeSelect.active   = false;
        this.node.resumeSystemEvents();
    },
});
