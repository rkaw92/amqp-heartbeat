var AMQPBase = require('amqp-base');
var HeartbeatReceiver = require('./lib/HeartbeatReceiver');

var connector = new AMQPBase.AMQPConnector('amqp://test:Being7nymph$Clever@rabbitmq-dev//test');

var receiver = new HeartbeatReceiver(connector, null, {
	queue: { durable: false, exclusive: true, autoDelete: true },
	consume: { exclusive: true },
	exchanges: [ { name: 'Heartbeats', type: 'topic', durable: true } ],
	binds: [ { exchange: 'Heartbeats', pattern: 'heartbeat' } ]
});

receiver.on('heartbeat', function onHeartbeat(heartbeat, metadata) {
	console.log('[%s] Heartbeat:', metadata.timestamp.toISOString(), heartbeat);
});

connector.start();
