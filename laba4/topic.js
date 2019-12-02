const kafkaNode = require('kafka-node');
const avroSchemaRegistry = require('avro-schema-registry');

const messageSchema = {
    name: 'Message',
    type: 'record',
    fields: [
        {
            name: 'name',
            type: 'string',
        },
        {
            name: 'message',
            type: 'string',
        },
        {
            name: 'date',
            type: 'long',
        },
    ],
};

const TOPIC = {
    message: 'message',
}

const SCHEMA = {
    message: messageSchema,
};

const client = new kafkaNode.KafkaClient({ kafkaHost: 'localhost:9092' });
const producer = new kafkaNode.Producer(client, {
    requireAcks: -1,
    ackTimeoutMs: 3600000,
  });
const consumer = new kafkaNode.Consumer(
    client,
    [{ topic: 'test', partition: 0 }],
    { groupId: 'kafka-node-group3' }
);

// const topic = {
//     topic: 'message',
//     partitions: 1,
//     replicationFactor: 1,
// };
const topic = {
    topic: 'test',
    partitions: 1,
    replicationFactor: 1,
};
// console.log('create topic')
// client.createTopics([topic], (err, res) => {
//     console.log(err, res);
//     if (err) console.error(err);
//     else console.info(res);
// });

const m = {
    name: 'klol',
    message: 'I, m klol',
    time: Date.now(),
};

const post = {
    topic: 'test',
    messages: [JSON.stringify(m)],
    // attributes: 1,
    // key: m.name,
    // partitions: 1,
    // partition: 1,
    // partitions: 0,
    partition: 0,
    // attributes: 1,
    // timestamp: Date.now(),
};
// client.refreshMetadata(['test'], (err) => {
//     console.log('refresh error: ', err);
// });
console.log('reading');
producer.on('ready', () => {
    console.log('ready');
    console.log('send');
    producer.send([post], (err, res) => {
        console.log(post);
        // console.log(err, res);
        if (err) console.error(err);
        else console.info(res);
    });
});
console.log('get');
consumer.on('message', (mess) => {
    console.log('messages: ');
    console.log(mess);
});
