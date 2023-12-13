const amqp = require('amqplib/callback_api');

var stepX = 1  // Length of a step in X-axis
var stepY = 1  // Length of a stop in Y-axis
var num_step = 100  // Number of steps (number of time that shipper service send message to Queue)
var delay = 500  // Time between two consecutive steps 

/*  Prams:
        channel:
        exchange:
        worker: 
        i: i(th) send position
    Returns:
        None
    Describe:
        This function send position of shipper at i time (from the begin of session) to the Queue
*/
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

/*  
    This code do connect to RabitMQ server, send the position of shipper each period of time
*/
amqp.connect('amqp://guest:guest@rabbitmq:5672/', function(error0, connection) {
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
