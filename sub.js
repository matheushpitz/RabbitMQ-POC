const amqp = require('amqplib/callback_api');

amqp.connect('amqp://localhost', (err, conn) => {
    console.log('SUB started and connected.');
    conn.createChannel((err, ch) => {
        let ex = 'pub-sub';
        ch.assertExchange(ex, 'fanout', {durable: false});
        // one message only.
        ch.prefetch(1);
        ch.assertQueue('', {}, (err, q) => {
            ch.bindQueue(q.queue, ex, '');
            ch.consume(q.queue, (msg) => {
                let data = JSON.parse(msg.content.toString('utf8'));
                console.log('Received: ', JSON.stringify(data));
                setTimeout(() => {
                    console.log('Done '+data.index);
                    ch.ack(msg);
                }, data.value);
            }, {noAck: false});
        });
    });
});