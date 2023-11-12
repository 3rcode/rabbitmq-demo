const amqp = require('amqplib/callback_api');

const io = require('socket.io')(4000, {
  cors: {
    origin: "http://127.0.0.1:5500"
  }
});

function getDistance(x0, y0, x1, y1) {
  return Math.sqrt(Math.pow(x1 - x0, 2) + Math.pow(y1 - y0, 2));
}
var notify = true;

io.on("connection", socket => {
  socket.on("notify", (data) => {
    var {customerLongtitude, customerLatitude} = data
    amqp.connect('amqp://localhost', function (error0, connection) {
      if (error0) {
        throw error0;
      }
      connection.createChannel(function (error1, channel) {
        if (error1) {
          throw error1;
        }
        var exchange = 'workers';

        channel.assertExchange(exchange, 'fanout', {
          durable: false
        });

        channel.assertQueue('', {
          exclusive: true
        }, function (error2, q) {
          if (error2) {
            throw error2;
          }
          console.log(' [*] Waiting for messages. To exit press CTRL+C');
          channel.bindQueue(q.queue, exchange, 'notify');
          channel.consume(q.queue, function (msg) {
            const { longtitude, latitude } = JSON.parse(msg.content);
            const distance = getDistance(customerLongtitude, customerLatitude, longtitude, latitude);
            if (notify && distance > 50 && distance <= 100) {
              io.emit("notify", {
                message: "Shipper is 4km away from you"
              });
              notify = false;
            } else if (!notify && distance > 25 && distance <= 50) {
              io.emit("notify", {
                message: "Shipper is 2km away from you"
              });
              notify = true;
            } else if (notify && distance > 2 && distance <= 25) {
              io.emit("notify", {
                message: "Shipper is 1km away from you"
              });
              notify = false;
            } else if (!notify && distance <= 2) {
              io.emit("notify", {
                message: "Shipper have arrived"
              });
              notify = true;
            }
          }, {
            noAck: false
          });
        });
      });
    });
  });
});