
var helper = require('Helper');

cc.Class({
	extends: cc.Component,

	properties: {
		nickname: cc.Label,
		balans:   cc.Label,
		bet:      cc.Label,
		card:     cc.Node,
		Progress: cc.ProgressBar,
		Avatar:   cc.Sprite,
	},
	setInfo: function(data){
		if (!!data) {
			this.node.active     = true;
			!!data.balans && (this.balans.string = helper.numberWithCommas(data.balans));
			!!data.name && (this.nickname.string = data.name);
			if (!!data.progress) {
				this.startProgress(data.progress);
			}
		}else{
			this.node.active = false;
		}
	},
	startProgress: function(time) {
		this.Progress.progress = 0;
		this.progressTime = time;
	},
	update: function(t){
		if (!!this.progressTime) {
			this.Progress.progress = this.Progress.progress+(t/this.progressTime);
			if (this.Progress.progress >= 1) {
				this.Progress.progress = 0;
				this.progressTime = 0;
			}
		}
	},
});
