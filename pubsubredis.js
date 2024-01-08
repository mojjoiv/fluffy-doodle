const redis = require('redis');

const CHANNELS = {
    TEST: 'TEST'
};

class PubSub {
    constructor() {
        this.publisher = redis.createClient();
        this.subscriber = redis.createClient();

        this.subscriber.subscribe(CHANNELS.TEST);

        this.subscriber.on('message', (channel, message) => {
            this.handleMessage(channel, message);
        });

        this.subscriber.on('subscribe', (channel, count) => {
            console.log(`Subscribed to ${channel}`);
            this.publishMessage();
        });
    }

    handleMessage(channel, message) {
        console.log(`Message received. Channel: ${channel}. Message: ${message}.`);
    }

    publishMessage() {
        setTimeout(() => this.publisher.publish(CHANNELS.TEST, 'foo'), 1000);
    }
}

const testPubSub = new PubSub();
