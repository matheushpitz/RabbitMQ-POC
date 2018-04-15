const amqp = require('amqplib/callback_api');

// fake generate ID.
const generateID = () => {
    return Math.random().toString() + Math.random().toString() + Math.random().toString()
        + Math.random().toString() + Math.random().toString() + Math.random().toString();
}

amqp.connect('amqp://localhost', (err, conn) => {
    console.log('REQUEST started and connected.');
    conn.createChannel((err, ch) => {
        // Here, we need back queue. Because we pass it to message.
        let q = 'request-reply';
        let qBack = 'request-reply-back';
        let myID = generateID();
        ch.assertQueue(qBack, {durable: false});

        ch.consume(qBack, (msg) => {
            // It only check if the correlationID is the same of myID, but, the message is for who sent the message
            // so, it's only for security and to avoid problems.
            if(msg.properties.correlationId == myID) {
                let jData = JSON.parse(msg.content.toString('utf8'));
                console.log('Received asnwer ID: '+jData.index+' Value: '+jData.value);
                ch.ack(msg);
            }
        }, {noAck: false});

        let index = 0;
        setInterval(() => {
            index++;
            let data = {};
            data.index = index;
            data.value = parseInt(Math.random() * 10000);
            ch.sendToQueue(q, Buffer.from(JSON.stringify(data)), {persistent: false, correlationId: myID, replyTo: qBack});
            console.log('Sent: '+JSON.stringify(data));
        }, 1000);
    });
});