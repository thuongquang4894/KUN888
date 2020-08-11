
cc.Class({
    extends: cc.Component,

    properties: {
        GD: {
            default: null,
            type:    cc.Label,
        },
        Time: {
            default: null,
            type:    cc.Label,
        },
        uFrom: {
            default: null,
            type:    cc.Label,
        },
        uTo: {
            default: null,
            type:    cc.Label,
        },
        Chuyen: {
            default: null,
            type:    cc.Label,
        },
        Nhan: {
            default: null,
            type:    cc.Label,
        },
        nodeMesenger: {
            default: null,
            type:    cc.Node,
        },
    },
    onShowMesenger: function() {
        cc.RedT.inGame.notice.show({title: "LỜI NHẮN", text: this.mesenger});
    },
});
