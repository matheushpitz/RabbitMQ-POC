const amqp = require('amqplib/callback_api');

amqp.connect('amqp://localhost', (err, conn) => {
    console.log('SUB started and connected.');
    conn.createChannel((err, ch) => {
        let ex = 'pub-sub';
        // you can make a filter using 'topic' on the place of 'direct'
        // so, you can do it for example, # for all, *.pipe get all pipe and anothers.
        ch.assertExchange(ex, 'direct', {durable: false});
        // one message only.
        ch.prefetch(1);
        // Queue ID is generate by RabbitMQ. We can get it from q.queue.
        ch.assertQueue('', {}, (err, q) => {
            ch.bindQueue(q.queue, ex, 'pipe');
            // You can disable these binds to get just route 'pipe' or vice-versa.
            ch.bindQueue(q.queue, ex, 'route-66');
            ch.bindQueue(q.queue, ex, 'highway');

            ch.consume(q.queue, (msg) => {
                let data = JSON.parse(msg.content.toString('utf8'));
                console.log('Received: ', JSON.stringify(data)+' routing: '+msg.fields.routingKey);
                setTimeout(() => {
                    console.log('Done '+data.index);
                    ch.ack(msg);
                }, data.value);
            }, {noAck: false});
        });
    });
});