const amqp = require('amqplib/callback_api');

const io = require('socket.io')(3000, {
  cors: {
    origin: "http://127.0.0.1:5500"
  }
});

io.on("connection", socket => {
  socket.on("render", (data) => {
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
          channel.bindQueue(q.queue, exchange, 'render');
          channel.consume(q.queue, function (msg) {
            io.emit("render", {
              message: JSON.parse(msg.content)
            })
          },
            {
              noAck: false
            });
        });
      });
    });
  })
});
