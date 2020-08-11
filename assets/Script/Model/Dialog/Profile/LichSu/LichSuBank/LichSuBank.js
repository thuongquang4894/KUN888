
var Helper = require('Helper');

cc.Class({
    extends: cc.Component,

    properties: {
        content: cc.Node,
    },
    onLoad () {
        Promise.all(this.content.children.map(function(obj){
            return obj.getComponent('LichSuBank_item');
        }))
        .then(resulf => {
            this.content = resulf;
        });
    },
    onEnable: function () {
        this.get_data();
    },
    get_data: function(page = 1){
        cc.RedT.send({user:{history:{bank:{page:page}}}});
    },
    onData: function(data){
        Promise.all(this.content.map(function(obj, index){
            var dataT = data[index];
            if (void 0 !== dataT) {
                obj.node.active  = true;
                obj.GD.string    = !!dataT.GD ? dataT.GD : '';
                obj.time.string  = Helper.getStringDateByTime(dataT.time);
                obj.bank.string  = dataT.bank.toUpperCase();
                obj.act.string   = dataT.type == 0 ? 'NẠP' : 'RÚT';

                obj.money.string = Helper.numberWithCommas(dataT.money);
                obj.money.node.color = dataT.type == 0 ? cc.color(0, 255, 31, 255) : cc.color(255, 0, 0, 255);

                obj.info.string  = !!dataT.info ? dataT.info : '';
                obj.status.string     = dataT.status == 0 ? "Chờ Duyệt" : (dataT.status == 1 ? "Thành Công" : (dataT.status == 2 ? "Thất bại" : ""));
                obj.status.node.color = dataT.status == 0 ? cc.color(45, 171, 255, 255) : (dataT.status == 1 ? cc.color(0, 255, 71, 255) : (dataT.status == 2 ? cc.color(255, 0, 0, 255) : cc.color(45, 171, 255, 255)));
            }else{
                obj.node.active = false;
            }
        }));
    },
});
