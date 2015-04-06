var AMQPBase = require('amqp-base');
var os = require('os');

function HeartbeatSender(connector, processInfo, options) {
	processInfo = processInfo || { argv: process.argv, pid: process.pid, hostname: os.hostname() };
	
	options = options || {};
	options.processType = options.processType || '';
	options.interval = options.interval || 15000;
	options.exchange = options.exchange || '';
	options.routingKey = options.routingKey || 'heartbeat';
	connector.on('connect', function onConnect(connection) {
		var channelManager = new AMQPBase.AMQPChannelManager(connection);
		channelManager.start();
		
		var heartbeatInterval = null;
		
		channelManager.on('create', function onChannelCreate(channel) {
			console.log('Channel created!');
			//TODO: Before setting up the interval, we should assert that the exchange exist.
			// Also, for faster self-healing, we might want to send the first heartbeat
			//  immediately, without waiting for the interval function to fire for the first time.
			heartbeatInterval = setInterval(function sendHeartbeat() {
				var heartbeatContent = processInfo;
				var heartbeatOptions = {
					timestamp: Date.now(),
					persistent: false,
					expiration: options.interval
				};
				var heartbeatBuffer = new Buffer(JSON.stringify(heartbeatContent), 'utf-8');
				channel.publish(options.exchange, options.routingKey, heartbeatBuffer, heartbeatOptions);
			}, options.interval);
		});
		channelManager.on('close', function onChannelClose() {
			clearInterval(heartbeatInterval);
		});
	});
	
	this.processInfo = processInfo;
	this.options = options;
}

module.exports = HeartbeatSender;
