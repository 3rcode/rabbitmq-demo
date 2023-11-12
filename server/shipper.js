const amqp = require('amqplib/callback_api');

var stepX = 1
var stepY = 1
var num_step = 100
var delay = 500
function sendPosition(channel, exchange, worker, i) {
    setTimeout(function () {
        const msg = JSON.stringify({
            "latitude": i * stepX,
            "longtitude": i * stepY
        })
        channel.publish(exchange, worker, Buffer.from(msg));
        console.log(" [x] Sent %s: '%s'", worker, msg);
    }, delay * i)   
}

amqp.connect('amqp://localhost', function(error0, connection) {
    if (error0) {
        throw error0;
    }
    connection.createChannel(function(error1, channel) {
        if (error1) {
            throw error1;
        }
        const exchange = 'workers';
        channel.assertExchange(exchange, 'fanout', {
            durable: false
        });
        for (let i = 0; i < num_step; i++) {
            sendPosition(channel, exchange, '', i);
        }   
    });

    setTimeout(function() {
        connection.close();
        process.exit(0);
    }, delay * num_step);
});
