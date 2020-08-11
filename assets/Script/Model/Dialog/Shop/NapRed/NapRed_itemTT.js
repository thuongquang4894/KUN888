
cc.Class({
	extends: cc.Component,

	properties: {
		menhgia: {
			default: null,
			type: cc.Label,
		},
		red: {
			default: null,
			type: cc.Label,
		},
	},

	init: function(menhgia, red) {
		this.menhgia.string   = menhgia;
		this.red.string       = red;
	},
});
