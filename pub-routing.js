const amqp = require('amqplib/callback_api');

const sendMessage = (ch, ex, index, route) => {
    let data = {};
    data.index = index;
    data.value = parseInt(Math.random() * 10000);
    ch.publish(ex, route, Buffer.from(JSON.stringify(data)), {persistent: false});
    console.log('Sent: '+JSON.stringify(data)+' routing: '+route);
}

amqp.connect('amqp://localhost', (err, conn) => {
    console.log('PUB started and connected.');
    conn.createChannel((err, ch) => {
        let ex = 'pub-sub';
        ch.assertExchange(ex, 'direct', {durable: false});
        let index = 0;
        setInterval(() => {
            index++;
            sendMessage(ch, ex, index, 'pipe');
        }, 1000);
        setInterval(() => {
            index++;
            sendMessage(ch, ex, index, 'route-66');
        }, 2500);
        setInterval(() => {
            index++;
            sendMessage(ch, ex, index, 'highway');
        }, 3500);
    });
});