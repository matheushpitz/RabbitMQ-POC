const amqp = require('amqplib/callback_api');

amqp.connect('amqp://localhost', (err, conn) => {
    console.log('PULL started and connected.');
    conn.createChannel((err, ch) => {
        let q = 'push-pull';
        ch.assertQueue(q, {durable: false});
        // one message only.
        ch.prefetch(1);
        ch.consume(q, (msg) => {
            let data = JSON.parse(msg.content.toString('utf8'));
            console.log('Received: ', JSON.stringify(data));
            setTimeout(() => {
                console.log('Done '+data.index);
                ch.ack(msg);
            }, data.value);
        }, {noAck: false});
    });
});