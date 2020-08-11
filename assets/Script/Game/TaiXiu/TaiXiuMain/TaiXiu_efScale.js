
cc.Class({
	extends: cc.Component,
	play() {
		this.node.runAction(
			cc.repeatForever(
				cc.sequence(
					cc.scaleTo(0.15, 0.85),
					cc.scaleTo(0.15, 1.15),
				)
			)
		);
	},
	stop(){
		this.node.stopAllActions();
		this.node.scale = 1;
	},
});
