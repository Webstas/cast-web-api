const http = require('http');
const Client = require('castv2').Client;
const mdns = require('mdns');
const url = require('url');
const debug = require('debug')('cast-web-api');
const args = require('minimist')(process.argv.slice(2));
var hostname = '127.0.0.1';
var port = 3000;
var currenRequestId = 1;
var networkTimeout = 2000;
var appLoadTimeout = 5000;

interpretArguments();
createWebServer();

//HANDLE ARGUMENTS
function interpretArguments() {
	debug('Args: %s', JSON.stringify(args));
	if (args.hostname) {
		hostname = args.hostname;
	}
	if (args.port) {
		port = args.port;
	}
	if (args.networkTimeout) {
		networkTimeout = args.networkTimeout;
	}
	if (args.appLoadTimeout) {
		appLoadTimeout = args.appLoadTimeout;
	}
	if (args.currenRequestId) {
		currenRequestId = args.currenRequestId;
	}
}

//WEBSERVER
function createWebServer() {
	const server = http.createServer((req, res) => {
		var parsedUrl = url.parse(req.url, true);

		if (parsedUrl['pathname']=="/getDevices") {
			res.setHeader('Content-Type', 'application/json');
			getDevices().then(devices => {
				if (devices) {
					res.statusCode = 200;
					res.end(devices);
				} else {
					res.statusCode = 500;
					res.end();
				}
			});
		}

		else if (parsedUrl['pathname']=="/getDeviceStatus") {
			if (parsedUrl['query']['address']) {
				getDeviceStatus(parsedUrl['query']['address']).then(deviceStatus => {
					if (deviceStatus) {
						res.statusCode = 200;
						res.setHeader('Content-Type', 'application/json');
						res.end(deviceStatus);
					} else {
						res.statusCode = 500;
						res.end();
					}
				});
			} else {
				res.statusCode = 400;
				res.end('Parameter error');
			}
		}

		else if (parsedUrl['pathname']=="/setDeviceVolume") {
			res.statusCode = 200;
			res.setHeader('Content-Type', 'application/json');
			if (parsedUrl['query']['address'] && parsedUrl['query']['volume']) {
				setDeviceVolume(parsedUrl['query']['address'], parseFloat(parsedUrl['query']['volume'])).then(deviceStatus => {
					if (deviceStatus) {
						res.statusCode = 200;
						res.setHeader('Content-Type', 'application/json');
						res.end(deviceStatus);
					} else {
						res.statusCode = 500;
						res.end();
					}
				});
			} else {
				res.statusCode = 400;
				res.end('Parameter error');
			}
		}

		else if (parsedUrl['pathname']=="/setDeviceMuted") {
			res.statusCode = 200;
			res.setHeader('Content-Type', 'application/json');
			if (parsedUrl['query']['address'] && parsedUrl['query']['muted']) {
				setDeviceMuted(parsedUrl['query']['address'], (parsedUrl['query']['muted']=="true")).then(deviceStatus => {
					if (deviceStatus) {
						res.statusCode = 200;
						res.setHeader('Content-Type', 'application/json');
						res.end(deviceStatus);
					} else {
						res.statusCode = 500;
						res.end();
					}
				});
			} else {
				res.statusCode = 400;
				res.end('Parameter error');
			}
		}

		else if (parsedUrl['pathname']=="/getMediaStatus") {
			res.statusCode = 200;
			res.setHeader('Content-Type', 'application/json');
			if (parsedUrl['query']['address'] && parsedUrl['query']['sessionId']) {
				getMediaStatus(parsedUrl['query']['address'], parsedUrl['query']['sessionId']).then(mediaStatus => {
					if (mediaStatus) {
						res.statusCode = 200;
						res.setHeader('Content-Type', 'application/json');
						res.end(mediaStatus);
					} else {
						res.statusCode = 500;
						res.end();
					}
				});
			} else {
				res.statusCode = 400;
				res.end('Parameter error');
			}
		}

		else if (parsedUrl['pathname']=="/setMediaPlaybackPause") {
			res.statusCode = 200;
			res.setHeader('Content-Type', 'application/json');
			if (parsedUrl['query']['address'] && parsedUrl['query']['sessionId'] && parsedUrl['query']['mediaSessionId']) {
				setMediaPlaybackPause(parsedUrl['query']['address'], parsedUrl['query']['sessionId'], parsedUrl['query']['mediaSessionId']).then(mediaStatus => {
					if (mediaStatus) {
						res.statusCode = 200;
						res.setHeader('Content-Type', 'application/json');
						res.end(mediaStatus);
					} else {
						res.statusCode = 500;
						res.end();
					}
				});
			} else {
				res.statusCode = 400;
				res.end('Parameter error');
			}
		}

		else if (parsedUrl['pathname']=="/setMediaPlaybackPlay") {
			res.statusCode = 200;
			res.setHeader('Content-Type', 'application/json');
			if (parsedUrl['query']['address'] && parsedUrl['query']['sessionId'] && parsedUrl['query']['mediaSessionId']) {
				setMediaPlaybackPlay(parsedUrl['query']['address'], parsedUrl['query']['sessionId'], parsedUrl['query']['mediaSessionId']).then(mediaStatus => {
					if (mediaStatus) {
						res.statusCode = 200;
						res.setHeader('Content-Type', 'application/json');
						res.end(mediaStatus);
					} else {
						res.statusCode = 500;
						res.end();
					}
				});
			} else {
				res.statusCode = 400;
				res.end('Parameter error');
			}
		}

		else if (parsedUrl['pathname']=="/setDevicePlaybackStop") {
			res.statusCode = 200;
			res.setHeader('Content-Type', 'application/json');
			if (parsedUrl['query']['address'] && parsedUrl['query']['sessionId']) {
				setDevicePlaybackStop(parsedUrl['query']['address'], parsedUrl['query']['sessionId']).then(mediaStatus => {
					if (mediaStatus) {
						res.statusCode = 200;
						res.setHeader('Content-Type', 'application/json');
						res.end(mediaStatus);
					} else {
						res.statusCode = 500;
						res.end();
					}
				});
			} else {
				res.statusCode = 400;
				res.end('Parameter error');
			}
		}

		else if (parsedUrl['pathname']=="/setMediaPlayback") {
			res.statusCode = 200;
			res.setHeader('Content-Type', 'application/json');
			if (parsedUrl['query']['address'] && parsedUrl['query']['mediaType'] && parsedUrl['query']['mediaUrl'] && parsedUrl['query']['mediaStreamType'] && parsedUrl['query']['mediaTitle'] && parsedUrl['query']['mediaSubtitle'] && parsedUrl['query']['mediaImageUrl']) {
				setMediaPlayback(parsedUrl['query']['address'], parsedUrl['query']['mediaType'], parsedUrl['query']['mediaUrl'], parsedUrl['query']['mediaStreamType'], parsedUrl['query']['mediaTitle'], parsedUrl['query']['mediaSubtitle'], parsedUrl['query']['mediaImageUrl']).then(mediaStatus => {
					if (mediaStatus) {
						res.statusCode = 200;
						res.setHeader('Content-Type', 'application/json');
						res.end(mediaStatus);
					} else {
						res.statusCode = 500;
						res.end();
					}
				});
			} else {
				res.statusCode = 400;
				res.end('Parameter error');
			}
		}

		else if (parsedUrl['pathname']=="/setConfig") {
			res.statusCode = 200;
			res.setHeader('Content-Type', 'application/json');
			if (parsedUrl['query']['networkTimeout']) {
				networkTimeout = parsedUrl['query']['networkTimeout'];
				res.end('OK: networkTimeout set to: '+parsedUrl['query']['networkTimeout']);
			} else if (parsedUrl['query']['currenRequestId']) {
				currenRequestId = parsedUrl['query']['currenRequestId']
				res.end('OK: currenRequestId set to: '+parsedUrl['query']['currenRequestId']);
			} else if (parsedUrl['query']['appLoadTimeout']) {
				currenRequestId = parsedUrl['query']['appLoadTimeout']
				res.end('OK: appLoadTimeout set to: '+parsedUrl['query']['appLoadTimeout']);
			} else {
				res.statusCode = 400;
				res.end('Parameter error');
			}
		}

		else {
			res.statusCode = 404;
			res.end('Not found');
		}
	});

	server.listen(port, hostname, () => {
	 	console.log(`Server running at http://${hostname}:${port}/`);
	});

	server.on('request', (req, res) => {
		console.info('Request to: '+ req.url);
	});
}

//GOOGLE CAST FUNCTIONS
function getDevices() {
	var devices = [];
	var browser = mdns.createBrowser(mdns.tcp('googlecast'));
	var exception;

	try {
		browser.on('serviceUp', function(service) {
			var currentDevice = [service.name, service.addresses[0], service.port];
	  		debug('getDevices found: %s', currentDevice.toString());
	  		devices.push(currentDevice);
		});
		
		browser.start();
	} catch (e) {
		console.error('Exception caught: ' + e);
		exception = e;
	}

	return new Promise(resolve => {
		setTimeout(() => {
			try{browser.stop();} catch (e) {console.error('Exception caught: ' + e); exception=e;}
			if (!exception) {
				if (devices.length>0) {
					debug('devices.length>0');
					resolve(JSON.stringify(devices));
				}
			}
			resolve(null);
	  	}, networkTimeout);
	});
}

function getDeviceStatus(address) {
  	return new Promise(resolve => {
		var deviceStatus, connection, receiver, exception;
		var client = new Client();
		var corrRequestId = getNewRequestId();

		try {
			debug('getDeviceStatus addr: %a', address);
		 	client.connect(address, function() {
			    connection = client.createChannel('sender-0', 'receiver-0', 'urn:x-cast:com.google.cast.tp.connection', 'JSON');
			    receiver   = client.createChannel('sender-0', 'receiver-0', 'urn:x-cast:com.google.cast.receiver', 'JSON');

			    connection.send({ type: 'CONNECT' });
				receiver.send({ type: 'GET_STATUS', requestId: corrRequestId });
			    
			    receiver.on('message', function(data, broadcast) {
				  	if(data.type == 'RECEIVER_STATUS') {
				  		if (data.requestId==corrRequestId) {
				  			deviceStatus = data;
				  			debug('getDeviceStatus recv: %s', JSON.stringify(deviceStatus));
				  			resolve(JSON.stringify(deviceStatus));
				  		}
				 	}
			   	});
		  	});
		  	client.on('error', function(err) {
			 	handleException(err);
			 	closeClientConnection(client, connection);
			 	resolve(null);
			});
		} catch (e) {
			handleException(e);
			closeClientConnection(client, connection);
			resolve(null);
		}

		setTimeout(() => {
			closeClientConnection(client, connection);
			resolve(null);
	  	}, networkTimeout);
	});
}

function setDeviceVolume(address, volume) {
	return new Promise(resolve => {
		var deviceStatus, connection, receiver, exception;
		var client = new Client();
		var corrRequestId = getNewRequestId();
		
		debug('setDeviceVolume addr: %s', address, 'volu:', volume);
	 	try {
	 		client.connect(address, function() {
			    connection = client.createChannel('sender-0', 'receiver-0', 'urn:x-cast:com.google.cast.tp.connection', 'JSON');
			    receiver   = client.createChannel('sender-0', 'receiver-0', 'urn:x-cast:com.google.cast.receiver', 'JSON');

			    connection.send({ type: 'CONNECT' });
				receiver.send({ type: 'SET_VOLUME', volume: { level: volume }, requestId: corrRequestId });
			    
			    receiver.on('message', function(data, broadcast) {
			    	if (data.requestId==corrRequestId) {
					  	if(data.type == 'RECEIVER_STATUS') {
					  		deviceStatus = data;
					  		debug('setDeviceVolume recv: %s', JSON.stringify(deviceStatus));
					  		resolve(JSON.stringify(deviceStatus));
					 	}
					}
			   	});
		  	});

		  	client.on('error', function(err) {
				handleException(err);
				closeClientConnection(client, connection);
			 	resolve(null);
			});
		} catch (e) {
		 	handleException(err);
			closeClientConnection(client, connection);
			resolve(null);
		}

		setTimeout(() => {
			closeClientConnection(client, connection);
			resolve(null);
	  	}, networkTimeout);
	});
}

function setDeviceMuted(address, muted) { //TODO: Add param error if not boolean
	return new Promise(resolve => {
		var deviceStatus, connection, receiver, exception;
		var client = new Client();
		var corrRequestId = getNewRequestId();

		debug('setDeviceMuted addr: %s', address, 'muted:', muted);
	 	try {
	 		client.connect(address, function() {
			    connection = client.createChannel('sender-0', 'receiver-0', 'urn:x-cast:com.google.cast.tp.connection', 'JSON');
			    receiver   = client.createChannel('sender-0', 'receiver-0', 'urn:x-cast:com.google.cast.receiver', 'JSON');

			    connection.send({ type: 'CONNECT' });
				receiver.send({ type: 'SET_VOLUME', volume: { muted: muted }, requestId: corrRequestId });
			    
			    receiver.on('message', function(data, broadcast) {
				  	if(data.type == 'RECEIVER_STATUS') {
				  		if (data.requestId==corrRequestId) {
					  		deviceStatus = data;
					  		debug('setDeviceMuted recv: %s', JSON.stringify(deviceStatus));
					  		resolve(JSON.stringify(deviceStatus));
					  	}
				 	}
			   	});
		  	});
		  	client.on('error', function(err) {
			 	handleException(err);
				closeClientConnection(client, connection);
				resolve(null);
			});
	 	} catch (e) {
		 	handleException(err);
			closeClientConnection(client, connection);
			resolve(null);
		}

	  	setTimeout(() => {
			closeClientConnection(client, connection);
			resolve(null);
	  	}, networkTimeout);	
	});
}

function getMediaStatus(address, sessionId) {
	return new Promise(resolve => {
		var mediaStatus, connection, receiver, media, exception;
		var client = new Client();
		var corrRequestId = getNewRequestId();

		debug('getMediaStatus addr: %s', address, 'seId:', sessionId);
		try {
			client.connect(address, function() {
			    connection = client.createChannel('sender-0', sessionId, 'urn:x-cast:com.google.cast.tp.connection', 'JSON');
			    media = client.createChannel('sender-0', sessionId, 'urn:x-cast:com.google.cast.media', 'JSON');

			    connection.send({ type: 'CONNECT', origin: {} });
			    media.send({ type: 'GET_STATUS', requestId: corrRequestId });
		 
			    media.on('message', function(data, broadcast) {
				  	if(data.type == 'MEDIA_STATUS') {
				  		if (data.requestId==corrRequestId) {
					  		mediaStatus = data;
					  		debug('getMediaStatus recv: %s', JSON.stringify(mediaStatus));
					  		resolve(JSON.stringify(mediaStatus));
					  	}
				 	}
			   	});
		  	});

		 	client.on('error', function(err) {
			 	handleException(err);
				closeClientConnection(client, connection);
				resolve(null);
			});
		} catch (e) {
		 	handleException(err);
			closeClientConnection(client, connection);
			resolve(null);
		}

		setTimeout(() => {
			closeClientConnection(client, connection);
			resolve(null);
	  	}, networkTimeout);
	});
}

function setMediaPlaybackPause(address, sId, mediaSId) {
	return new Promise(resolve => {
		var mediaStatus, connection, receiver, media, exception;
		var client = new Client();
		var corrRequestId = getNewRequestId();

		debug('setMediaPlaybackPause addr: %s', address, 'seId:', sId, 'mSId:', mediaSId);
	 	try {
	 		client.connect(address, function() {
			    connection = client.createChannel('sender-0', sId, 'urn:x-cast:com.google.cast.tp.connection', 'JSON');
			    media = client.createChannel('sender-0', sId, 'urn:x-cast:com.google.cast.media', 'JSON');

			    connection.send({ type: 'CONNECT', origin: {} });
			    media.send({ type: 'PAUSE', requestId: corrRequestId, mediaSessionId: mediaSId, sessionId: sId });
			    
			    media.on('message', function(data, broadcast) {
				  	if(data.type == 'MEDIA_STATUS') {
				  		if (data.requestId==corrRequestId) {
				  			if (data.status[0].playerState=="PAUSED") {
				  				mediaStatus = data;
					  			debug('setMediaPlaybackPause recv: %s', JSON.stringify(mediaStatus));
					  			resolve(JSON.stringify(mediaStatus));
				  			}
					  	}
				 	}
			   	});
		  	});

		  	client.on('error', function(err) {
			 	handleException(err);
				closeClientConnection(client, connection);
				resolve(null);
			});
		  } catch (e) {
		 	handleException(err);
			closeClientConnection(client, connection);
			resolve(null);
		}
		setTimeout(() => {
			closeClientConnection(client, connection);
			resolve(null);
	  	}, networkTimeout);
	});
}

function setMediaPlaybackPlay(address, sId, mediaSId) {
	return new Promise(resolve => {
		var mediaStatus, connection, receiver, media, exception;
		var client = new Client();
		var corrRequestId = getNewRequestId();

		debug('setMediaPlaybackPlay addr: %s', address, 'seId:', sId, 'mSId:', mediaSId);
	 	try {
	 		client.connect(address, function() {
			    connection = client.createChannel('sender-0', sId, 'urn:x-cast:com.google.cast.tp.connection', 'JSON');
			    media = client.createChannel('sender-0', sId, 'urn:x-cast:com.google.cast.media', 'JSON');

			    connection.send({ type: 'CONNECT', origin: {} });
			    media.send({ type: 'PLAY', requestId: corrRequestId, mediaSessionId: mediaSId, sessionId: sId });
			    
			    media.on('message', function(data, broadcast) {
				  	if(data.type == 'MEDIA_STATUS') {
				  		if (data.requestId==corrRequestId) {
				  			if (data.status[0].playerState=="PLAYING") {
						  		mediaStatus = data;
						  		debug('setMediaPlaybackPlay recv: %s', JSON.stringify(mediaStatus));
						  		resolve(JSON.stringify(mediaStatus));
						  	}
					  	}
				 	}
			   	});
		  	});

		 	client.on('error', function(err) {
			 	handleException(err);
				closeClientConnection(client, connection);
				resolve(null);
			});
		 } catch (e) {
		 	handleException(err);
			closeClientConnection(client, connection);
			resolve(null);
		}
		setTimeout(() => {
			closeClientConnection(client, connection);
			resolve(null);
	  	}, networkTimeout);
	});
}

function setDevicePlaybackStop(address, sId) {
	return new Promise(resolve => {
		var deviceStatus, connection, receiver, exception;
		var client = new Client();
		var corrRequestId = getNewRequestId();

		debug('setDevicePlaybackStop addr: %s', address, 'seId:', sId);
		try {
			client.connect(address, function() {
			    connection = client.createChannel('sender-0', 'receiver-0', 'urn:x-cast:com.google.cast.tp.connection', 'JSON');
			    receiver   = client.createChannel('sender-0', 'receiver-0', 'urn:x-cast:com.google.cast.receiver', 'JSON');

			    connection.send({ type: 'CONNECT' });
			    receiver.send({ type: 'STOP', sessionId: sId, requestId: corrRequestId });

			    receiver.on('message', function(data, broadcast) {
				  	if(data.type == 'RECEIVER_STATUS') {
				  		if (data.requestId==corrRequestId) {
					  		deviceStatus = data;
					  		debug('setDevicePlaybackStop recv: %s', JSON.stringify(deviceStatus));
					  		resolve(JSON.stringify(deviceStatus));
					  	}
				 	}
			   	});
		  	});

		  	client.on('error', function(err) {
			 	handleException(err);
				closeClientConnection(client, connection);
				resolve(null);
			});
		} catch (e) {
		 	handleException(err);
			closeClientConnection(client, connection);
			resolve(null);
		}
		setTimeout(() => {
			closeClientConnection(client, connection);
			resolve(null);
	  	}, networkTimeout);
	});
}

function setMediaPlayback(address, mediaType, mediaUrl, mediaStreamType, mediaTitle, mediaSubtitle, mediaImageUrl) {
	return new Promise(resolve => {
		var Client = require('castv2-client').Client;
		var DefaultMediaReceiver = require('castv2-client').DefaultMediaReceiver;
		var client = new Client();

	  	client.connect(address, function() {
			client.launch(DefaultMediaReceiver, function(err, player) {
		 		var media = {
					contentId: mediaUrl,
			        contentType: mediaType,
			        streamType: mediaStreamType,

			        metadata: {
			         	type: 0,
			          	metadataType: 0,
			          	title: mediaTitle,
			          	subtitle: mediaSubtitle,
			          	images: [
			            	{ url: mediaImageUrl }
			          	]
			        }        
			   	};

				player.on('close', function() {
					debug('Closing previously setMediaPlayback session');
					try{client.close();}catch(e){handleException(e); resolve(null);}
				});

			  	player.load(media, { autoplay: true }, function(err, status) {
			      	debug('Media loaded playerState: ', status.playerState);
			    });

			    player.on('status', function(status) {
			        debug('status.playerState: ', status.playerState);
			        if (status.playerState=='PLAYING') {
			        	debug('status.playerState is PLAYING');
			        	if (player.session.sessionId) {
					  		console.log('Player has sessionId: ', player.session.sessionId);

					  		getMediaStatus(address, player.session.sessionId).then(mediaStatus => {
					    		debug('getMediaStatus return value: ', mediaStatus);
					    		resolve(mediaStatus);
							});
					  	}
			        }
			   	});
			
			    setTimeout(() => {
			    	resolve(null);
			  	}, appLoadTimeout);
		    });
	 	});

	  	client.on('error', function(err) {
	  		handleException(err);
	  		try{client.close();}catch(e){handleException(e);}
	  		resolve(null);
	  	});
	});
}

function getNewRequestId(){
	if(currenRequestId > 9998){
		currenRequestId=1;
		debug("Rest currenRequestId");
	}
	debug("getNewRequestId: "+(currenRequestId+1))
	return currenRequestId++;
}

function closeClientConnection(client, connection) {
	try {
		connection.send({ type: 'CLOSE' });
		client.close();
	} catch (e) {
		handleException(e);
	}
}

function handleException(e) {
	console.error('Exception caught: ' + e);
}