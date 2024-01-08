const PubNub = require('pubnub');

const credentials = {
    publishKey : 'pub-c-6fe691f0-a686-40f0-bb27-a1b56600a12c',
    subscribeKey : 'sub-c-f896ece0-bb06-4f91-b972-d1ca0e778609',
    secretKey : 'sec-c-ZDM2YzIzZmQtYjRiNy00ZGQ0LWE3M2EtM2M4NDc5NDg0MzNi',
    userId : Math.random().toString(36).substring(2) + Date.now().toString(36)
};

const CHANNELS = {
    TEST: 'TEST'
}

class PubSub {
    constructor() {
        this.pubnub = new PubNub(credentials);

        this.pubnub.subscribe({channels: Object.values(CHANNELS) });

        this.pubnub.addListener(this.listener());
    }

    listener() {
        return{
            message: messageObject => {
                const {channel, message} = messageObject;

                console.log(`Message received. channel: ${channel}. Message: ${message}`);
            }
        }
    }

    publish({channel, message}) {
        this.pubnub.publish({channel, message});
    }
}

const testPubSub = new PubSub();
    testPubSub.publish({channel: CHANNELS.TEST, message: 'hello pubnub'})


module.export = PubSub;