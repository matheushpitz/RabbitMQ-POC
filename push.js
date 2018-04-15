const amqp = require('amqplib/callback_api');

amqp.connect('amqp://localhost', (err, conn) => {
    console.log('PUSH started and connected.');
    conn.createChannel((err, ch) => {
        let q = 'push-pull';
        ch.assertQueue(q, {durable: false});
        let index = 0;
        setInterval(() => {
            index++;
            let data = {};
            data.index = index;
            data.value = parseInt(Math.random() * 10000);
            ch.sendToQueue(q, Buffer.from(JSON.stringify(data)), {persistent: false});
            console.log('Sent: '+JSON.stringify(data));
        }, 1000);
    });
});