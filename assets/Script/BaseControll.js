
module.exports = {
	IS_LOGIN:    false,
	IS_SOUND:    true,
	isConnected: false,

	_socket:     null,

	user:        {},
	prefab:      {},
	setting:     {},
	util: {},
	sslPem: {},

	connect: function(url, path = '/', port = false, ss = false) {
		if (!this.isConnected) {
			const urlGame = "wss://" + url + (!!port ? ":" + port : "") + path;
			if (cc.sys.isBrowser) {
                this._socket = new WebSocket(urlGame);
			} else {
				if (cc.RedT.sslPem) {
					this._socket = new WebSocket(urlGame, [], cc.RedT.sslPem.url);
					this._socket.binaryType = "arraybuffer";
					console.log("===============");
					console.log("connect with Pem", cc.RedT.sslPem.url);
				} else {
					this._socket = new WebSocket(urlGame);
				}
            }

			this._socket.onopen    = this._onSocketConnect;
			this._socket.onclose   = this._onSocketDisconnect;
			this._socket.onmessage = this._onSocketData;
			this._socket.onerror   = this._onSocketError;
			this.isConnected = true;
			console.log("===============");
			console.log("start connect", urlGame);
		}
	},
	disconnect: function () {
		console.log("===============");
		console.log("action disconnect");

		this.isConnected = false;
		this._socket.close();
	},
	send: function (message) {
		try {
			if (this._socket && this._socket.readyState === 1) {
				this._socket.send(this._encodeMessage(message));
			} else {
				console.log("connect send message");
			}
		} catch(err) {
			this.inGame.loading.active = false;
			this.inGame.notice.show({title: 'THÔNG BÁO', text: 'KHÔNG thể kết nối tới máy chủ...'});
		}
	},
	_decodeMessage: function(message) {
		return JSON.parse(message)
	},
	_encodeMessage: function(message) {
		return JSON.stringify(message)
	},
	_onSocketConnect: function () {
		console.log("============");
		console.log("websocket connected");
		
		cc.RedT.isConnected = true;
	},
	_onSocketDisconnect: function(event) {
		cc.RedT.isConnected = false;
		if (cc.RedT.IS_LOGIN) {
			cc.RedT.inGame.signOut();
		}else{
			cc.RedT.inGame.dialog.onCloseDialog();
		}
		console.log("============");
		console.log("socket disconnect", JSON.stringify(event));
		cc.RedT.reconnect();
	},
	_onSocketData: function(message) {
		var data = message.data;
		data = cc.RedT._decodeMessage(data);
		cc.RedT.inGame.onData(data);
	},
	_onSocketError: function (message) {
		console.log("============");
		console.log("socket error", JSON.stringify(message));
	},
	reconnect: function () {
		// this.connect('127.0.0.1:3000', '/websocket');
		// this.connect('api.kun888.club', '/websocket');
		this.connect('service.kun888.club', '/websocket');
	},

	init: function(){
		this.initPrototype();
	},
	initPrototype: function() {
		String.format || (String.format = function(t){
			var i = Array.prototype.slice.call(arguments, 1);
			return t.replace(/{(\d+)}/g, function(t, e) {
				return void 0 !== i[e] ? i[e] : t
			})
		});
	},
	// Function localStorage
	setAutoLogin: function(bool){
		localStorage.setItem('AUTO_LOGIN', bool)
	},
	isAutoLogin: function(){
		var check = localStorage.getItem('AUTO_LOGIN');
		return check == "true"
	},
	setSoundGame: function(bool){
		localStorage.setItem('SOUND_GAME', bool)
	},
	isSoundGame: function(){
		var check = localStorage.getItem('SOUND_GAME');
		return check == "true"
	},
	setSoundBackground: function(bool){
		localStorage.setItem('SOUND_BACKGROUND', bool)
	},
	isSoundBackground: function(){
		var check = localStorage.getItem('SOUND_BACKGROUND');
		return check == "true"
	},
	userData: function(data){
		if (void 0 !== data.name){
			this.user.name = data.name;
		}
		if (void 0 !== data.red){
			this.user.red = data.red;
		}
		if (void 0 !== data.xu){
			this.user.xu = data.xu;
		}
		if (void 0 !== data.ketSat){
			this.user.ketSat = data.ketSat;
		}
		if (void 0 !== data.UID){
			this.user.UID = data.UID;
		}
		if (void 0 !== data.phone){
			this.user.phone = data.phone;
		}
		if (void 0 !== data.email){
			this.user.email = data.email;
		}
		if (void 0 !== data.joinedOn){
			this.user.joinedOn = data.joinedOn;
		}
		if (void 0 !== data.security){
			this.user.security = data.security;
		}

		// Level
		if (void 0 !== data.level){
			this.user.level = data.level;
		}
		if (void 0 !== data.vipHT){
			this.user.vipHT = data.vipHT;
		}
		if (void 0 !== data.vipNext){
			this.user.vipNext = data.vipNext;
		}

	},
}
