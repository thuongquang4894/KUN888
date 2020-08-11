
cc.Class({
    extends: cc.Component,

    properties: {
    	menu: cc.Node,
    	head: cc.Node,
    	rooms: {
    		default: [],
    		type: cc.Sprite,
    	},
    	table1: {
    		default: [],
    		type: cc.SpriteFrame,
    	},
    	table2: {
    		default: [],
    		type: cc.SpriteFrame,
    	},
    	title: cc.Label,
        red: true,
    },
    onBack: function(){
    	this.menu.active = true;
    	this.node.active = false;
    },
    selectCoint: function(event, select) {
		if (select == "red") {
    		this.red = true;
    		this.changerRoom(true);
		}else{
			this.red = false;
    		this.changerRoom(false);
		}
		Promise.all(this.head.children.map(function(head){
			if (head.name == select) {
				head.children[0].active = true;
				head.children[1].color  = cc.Color.BLACK;
			}else{
				head.children[0].active = false;
				head.children[1].color  = cc.Color.WHITE;
			}
		}));
	},
	openGame: function(game){
		this.game = game;
		this.title.string = game.title;
		this.selectCoint(null, "red");
		this.menu.active = false;
    	this.node.active = true;
	},
	changerRoom: function(red){
		var self = this;
		if (this.game.table2) {
			if (red) {
				Promise.all(this.rooms.map(function(room, index){
					if (index < 4) {
						room.spriteFrame = self.table2[3];
					}else if (index < 8) {
						room.spriteFrame = self.table2[4];
					}else{
						room.spriteFrame = self.table2[5];
					}
				}));
			}else{
				Promise.all(this.rooms.map(function(room, index){
					if (index < 4) {
						room.spriteFrame = self.table2[0];
					}else if (index < 8) {
						room.spriteFrame = self.table2[1];
					}else{
						room.spriteFrame = self.table2[2];
					}
				}));
			}
		}else{
			if (red) {
				Promise.all(this.rooms.map(function(room, index){
					if (index < 4) {
						room.spriteFrame = self.table1[3];
					}else if (index < 8) {
						room.spriteFrame = self.table1[4];
					}else{
						room.spriteFrame = self.table1[5];
					}
				}));
			}else{
				Promise.all(this.rooms.map(function(room, index){
					if (index < 4) {
						room.spriteFrame = self.table1[0];
					}else if (index < 8) {
						room.spriteFrame = self.table1[1];
					}else{
						room.spriteFrame = self.table1[2];
					}
				}));
			}
		}
	},
	onClickRoom: function(event){
		this.bet = event.target.name;
		cc.RedT.audio.playClick();
		if (this.game.game == "poker") {
			cc.RedT.inGame.dialog.showPokerNap(this);
		}
	},
	onData: function(game){
    	// To Game
    	cc.director.loadScene(game);
    },
});
