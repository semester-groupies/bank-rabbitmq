var amqp = require('amqplib/callback_api');

var url2 = 'amqp://student:cph@datdb.cphbusiness.dk:5672';
amqp.connect(url2, function (err, conn) {
  conn.createChannel(function (err, ch) {
    var ex = 'group11RabbitBank.JSON';
    var obj =
    {
      loanRequest:
      {
        ssn: 1234567890,
        creditScore: 35,
        loanAmount: 1000,
        loanDuration: 125
      }
    };

    var msg = JSON.stringify(obj);
    var corr = generateUuid();

    ch.assertExchange(ex, 'fanout', { durable: true });
    // Note: on Node 6 Buffer.from(msg) should be used
    ch.publish(ex, '', new Buffer(msg),

        {
          correlationId: corr,
          replyTo: 'g111'
        });
    console.log(' [x] Sent %s', msg);
    ch.assertQueue('g11', { durable: true }, function (err, q) {
      ch.consume(q.queue, function (msg) {
            console.log('waiting...');
            console.log(msg.content.toString());
          },

          {
            noAck: true
          });
    });
  });

  setTimeout(function () {
    conn.close();
    process.exit(0);
  }, 500);
});

function generateUuid() {
  return Math.random().toString() +
      Math.random().toString() +
      Math.random().toString();
}
