var AMQPBase = require('amqp-base');
var HeartbeatSender = require('./lib/HeartbeatSender');
var os = require('os');

var connector = new AMQPBase.AMQPConnector('amqp://test:Being7nymph$Clever@rabbitmq-dev//test');
var sender = new HeartbeatSender(connector, {
	processType: 'Dummy',
	processID: process.pid,
	hostname: os.hostname()
}, {
	interval: 1000,
	exchange: 'Heartbeats'
});
connector.start();
