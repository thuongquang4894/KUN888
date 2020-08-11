
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
        NhaMang: {
            default: null,
            type:    cc.Label,
        },
        MenhGia: {
            default: null,
            type:    cc.Label,
        },
        SoLuong: {
            default: null,
            type:    cc.Label,
        },
        Cost: {
            default: null,
            type:    cc.Label,
        },
        Status: {
            default: null,
            type:    cc.Label,
        },
    },
    onInfoClick: function() {
        if (this.info) {
            cc.RedT.inGame.dialog.profile.LichSu.lichSuRut.isView = true;
            cc.RedT.inGame.dialog.the_cao.getData(this.idT);
            cc.RedT.audio.playClick();
        }
    },
});
