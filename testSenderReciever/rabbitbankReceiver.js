var amqp = require('amqplib/callback_api');

var url = 'amqp://student:cph@datdb.cphbusiness.dk:5672';
var ex = 'group11RabbitBank.JSON';

amqp.connect(url, function (err, conn) {
  conn.createChannel(function (err, ch) {
    var q = 'g111';
    ch.assertExchange(ex, 'fanout', { durable: true });
    ch.checkExchange(ex, function (err, ok) {
      console.log('exchange running.');
    });

    ch.assertQueue(q, { durable: true });
    console.log(' [*] Waiting for messages in %s. To exit press CTRL+C', q);
    ch.consume(q, function (msg) {
      console.log(' [x] Received %s', msg.content.toString());
      console.log('correlationId :', msg.properties.correlationId);
      console.log(' from queue : ', q);
    }, { noAck: true });
  });
});
