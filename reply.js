const amqp = require('amqplib/callback_api');

amqp.connect('amqp://localhost', (err, conn) => {
    console.log('REPLY started and connected.');
    conn.createChannel((err, ch) => {
        // Here, we only need main queue. Because, the Answer queue we get in the message.
        let q = 'request-reply';
        // one message only.
        ch.prefetch(1);
        ch.assertQueue(q, {durable: false});
        ch.consume(q, (msg) => {
            let data = JSON.parse(msg.content.toString('utf8'));
            console.log('Received: ', JSON.stringify(data));
            setTimeout(() => {
                console.log('Done '+data.index);

                let response = {};
                response.index = data.index;
                response.value = parseInt(Math.random()*200);

                ch.sendToQueue(msg.properties.replyTo, new Buffer(JSON.stringify(response)), {correlationId: msg.properties.correlationId});
                console.log('Answered: '+JSON.stringify(response));

                ch.ack(msg);
            }, data.value);
        }, {noAck: false});
    });
});