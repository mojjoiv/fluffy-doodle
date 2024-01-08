const redis = require('redis');

const CHANNELS = {
    TEST: 'TEST'
};

class PubSub {
    constructor() {
        this.subscriber = redis.createClient();

        this.subscriber.on('subscribe', (channel, count) => {
            console.log(`Subscribed to channel ${channel}. Total subscriptions: ${count}`);
        });

        this.subscriber.on('message', (channel, message) => {
            this.handleMessage(channel, message);
        });

        this.subscriber.subscribe(CHANNELS.TEST);

        this.publisher = redis.createClient();

        this.publisher.on('error', (err) => {
            console.error('Publisher error:', err);
        });

        this.publisher.on('ready', () => {
            console.log('Publisher connected to Redis');
        });
    }

    handleMessage(channel, message) {
        console.log(`Message received. Channel: ${channel}. Message: ${message}.`);
    }

    publishMessage(channel, message) {
        if (this.publisher.connected) {
            this.publisher.publish(channel, message, (err, reply) => {
                if (err) {
                    console.error('Publish error:', err);
                } else {
                    console.log(`Message published to ${channel}. Reply: ${reply}.`);
                }
            });
        } else {
            this.publisher.on('connect', () => {
                console.log('Publisher connected');
                this.publisher.publish(channel, message, (err, reply) => {
                    if (err) {
                        console.error('Publish error:', err);
                    } else {
                        console.log(`Message published to ${channel}. Reply: ${reply}.`);
                    }
                });
            });
        }
    }
}

const testPubSub = new PubSub();

// Publish a message to the TEST channel
testPubSub.publishMessage(CHANNELS.TEST, 'foo');
