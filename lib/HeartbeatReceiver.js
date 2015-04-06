var AMQPBase = require('amqp-base');
var EventEmitter = require('events').EventEmitter;

function HeartbeatReceiver(connector, queueName, options) {
	options = options || {};
	var self = this;
	EventEmitter.call(self);
	
	connector.on('connect', function onConnect(connection) {
		var listener = new AMQPBase.AMQPListener(connection, [ function(channel) {
			var consumer = new AMQPBase.AMQPConsumer(channel, queueName, options);
			consumer.on('message', function(message, operations) {
				try {
					var heartbeat = JSON.parse(message.content);
					self.emit('heartbeat', heartbeat, {
						timestamp: new Date(message.properties.timestamp)
					});
				} catch(error) {
					console.error(error);
				}
				operations.ack();
			});
			console.log('Consumer created...');
			return consumer;
		} ]);
		listener.listen();
	});
}
HeartbeatReceiver.prototype = Object.create(EventEmitter.prototype);

module.exports = HeartbeatReceiver;
