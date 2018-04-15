const amqp = require('amqplib/callback_api');

amqp.connect('amqp://localhost', (err, conn) => {
    console.log('PUB started and connected.');
    conn.createChannel((err, ch) => {
        let ex = 'pub-sub';
        ch.assertExchange(ex, 'fanout', {durable: false});
        let index = 0;
        setInterval(() => {
            index++;
            let data = {};
            data.index = index;
            data.value = parseInt(Math.random() * 10000);
            ch.publish(ex, '', Buffer.from(JSON.stringify(data)), {persistent: false});
            console.log('Sent: '+JSON.stringify(data));
        }, 1000);
    });
});