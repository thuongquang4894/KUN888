
cc.Class({
    extends: cc.Component,

    properties: {
    	header:      cc.Node,
    	games:       cc.Node,
    	adsContent:  cc.PageView,
        adsTimeNext: 0,
        tabGameArr:{
            default:[],
            type:cc.Node
        }
    },
    onLoad() {
        Promise.all(this.games.children.map(function(obj){
            return obj.getComponent('iconGame');
        }))
        .then(result => {
            this.games = result;
        });
        this.setTimeAds();
        this.node._onPreDestroy = function(){
            clearTimeout(this.adsTime);
        }.bind(this);
    },
    onEnable: function() {
		this.adsContent.content.on(cc.Node.EventType.TOUCH_START,  this.eventStart, this);
		this.adsContent.content.on(cc.Node.EventType.TOUCH_END,    this.setTimeAds, this);
        this.adsContent.content.on(cc.Node.EventType.TOUCH_CANCEL, this.setTimeAds,   this);
		this.adsContent.content.on(cc.Node.EventType.MOUSE_ENTER,  this.eventStart, this);
		this.adsContent.content.on(cc.Node.EventType.MOUSE_LEAVE,  this.setTimeAds, this);
	},
	onDisable: function() {
		this.adsContent.content.off(cc.Node.EventType.TOUCH_START,  this.eventStart, this);
		this.adsContent.content.off(cc.Node.EventType.TOUCH_END,    this.setTimeAds, this);
        this.adsContent.content.off(cc.Node.EventType.TOUCH_CANCEL, this.setTimeAds,   this);
		this.adsContent.content.off(cc.Node.EventType.MOUSE_ENTER,  this.eventStart, this);
		this.adsContent.content.off(cc.Node.EventType.MOUSE_LEAVE,  this.setTimeAds, this);
    },
    
    onBtnChoseTabGame(event,data){
        for(var i=0;i<this.tabGameArr.length;i++){
            this.tabGameArr[i].active = false;
        }
        this.tabGameArr[data].active = true;
    },
    nextAds: function(){
    	var self = this;
    	if (this.adsContent._curPageIdx == this.adsContent._pages.length-1) {
    		this.adsContent.scrollToPage(0, 1.5);

    	}else{
    		this.adsContent.scrollToPage(this.adsContent._curPageIdx+1, 0.85);
    	}
        this.setTimeAds();
    },
    eventStart: function(){
    	clearTimeout(this.adsTime);
    },
    setTimeAds: function(){
        this.eventStart();
    	this.adsTime =  setTimeout(function(){
			this.nextAds();
		}
		.bind(this), this.adsTimeNext*1000);
    },
    onHeadSelect: function(e) {
    	Promise.all(this.header.children.map(function(obj){
    		if (obj == e.target) {
    			obj.children[0].active = false;
    			obj.pauseSystemEvents();
    		}else{
    			obj.children[0].active = true;
    			obj.resumeSystemEvents();
    		}
    	}));
    	Promise.all(this.games.map(function(game){
            if (e.target.name == 'all' || game[e.target.name]) {
                game.node.active = true;
            }else{
                game.node.active = false;
            }
    	}));
    },
    onBtnCommingSoon:function(){
        cc.RedT.inGame.notice.show({title:"THÔNG BÁO",text:"Game đang trong giai đoạn phát triển."});
    },
    openMiniGame: function(e, name){
        cc.RedT.MiniPanel[name].openGame();
    },
    regGame: function(e, name){
        cc.RedT.audio.playClick();
        if (cc.RedT.IS_LOGIN){
            cc.RedT.inGame.loading.active = true;
            cc.RedT.send({g:{reg:name}});
        }else{
            cc.RedT.inGame.dialog.showSignIn();
        }
    },
    openGame: function(e, name){
        cc.RedT.audio.playClick();
        if (cc.RedT.IS_LOGIN){
            cc.RedT.inGame.loading.active = true;
            cc.director.loadScene(name);
        }else{
            cc.RedT.inGame.dialog.showSignIn();
        }
    },
    openTXCL: function(e, taixiu){ // Open Tài Xỉu | Chẵn Lẻ
        cc.RedT.MiniPanel.TaiXiu.openGame(null, taixiu);
    },
});
