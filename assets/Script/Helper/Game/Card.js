
cc.Class({
    extends: cc.Component,

    properties: {
        card1: {
        	default: [],
        	type: cc.SpriteFrame,
        },
        card2: {
        	default: [],
        	type: cc.SpriteFrame,
        },
        card3: {
        	default: [],
        	type: cc.SpriteFrame,
        },
        card4: {
        	default: [],
        	type: cc.SpriteFrame,
        },
        card5: {
        	default: [],
        	type: cc.SpriteFrame,
        },
        card6: {
        	default: [],
        	type: cc.SpriteFrame,
        },
        card7: {
        	default: [],
        	type: cc.SpriteFrame,
        },
        card8: {
        	default: [],
        	type: cc.SpriteFrame,
        },
        card9: {
        	default: [],
        	type: cc.SpriteFrame,
        },
        card10: {
        	default: [],
        	type: cc.SpriteFrame,
        },
        card11: {
        	default: [],
        	type: cc.SpriteFrame,
        },
        card12: {
        	default: [],
        	type: cc.SpriteFrame,
        },
        card13: {
        	default: [],
        	type: cc.SpriteFrame,
        },
        cardB1: {
        	default: null,
        	type: cc.SpriteFrame,
        },
        cardB2: {
        	default: null,
        	type: cc.SpriteFrame,
        },
        red: false,
    },
    init: function() {
    	var self = this;
    	this.card = [[],[],[],[],[],[],[],[],[],[],[],[],[]];
    	Promise.all(this.card.map(function(arr, index){
    		if (index === 0) {
    			return self.card1
    		}else if (index === 1) {
    			return self.card2
    		}else if (index === 2) {
    			return self.card3
    		}else if (index === 3) {
    			return self.card4
    		}else if (index === 4) {
    			return self.card5
    		}else if (index === 5) {
    			return self.card6
    		}else if (index === 6) {
    			return self.card7
    		}else if (index === 7) {
    			return self.card8
    		}else if (index === 8) {
    			return self.card9
    		}else if (index === 9) {
    			return self.card10
    		}else if (index === 10) {
    			return self.card11
    		}else if (index === 11) {
    			return self.card12
    		}else if (index === 12) {
    			return self.card13
    		}
    	}))
    	.then(result => {
    		this.card = result
    	})
    },
    config: function(){
        if (void 0 === cc.RedT.util.card) {
            cc.RedT.util.card = this;
        	if (!this.red) {
        		this.red = true;
        		this.init();
        	}
        }
    },
    getCard: function(card = 0, type = 0){
    	return this.card[card][type];
    },
    random: function(number = 13){
    	return this.card[~~(Math.random()*number)][~~(Math.random()*4)];
    }
});
