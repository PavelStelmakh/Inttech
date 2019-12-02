////////////////////////////////////
const quizSchema = {
    name: 'Quiz',
    namespace: 'com.epam.api.examinator.trainer',
    type: 'record',
    fields: [
      {
        name: 'id',
        type: 'int'
      }, {
        name: 'name',
        type: 'string'
      }, {
        name: 'updated_at',
        type: 'long'
      }]
  };
 
 module.exports = quizSchema;
 /////////////////
 const kafkaNode = require('kafka-node');
const avroSchemaRegistry = require('avro-schema-registry');

const TOPIC = {
  quiz: 'epm-rdex.quizzes',
}

const SCHEMA = Object.keys(TOPIC)
  .reduce((acc, topicKey) => ({
    ...acc,
    [TOPIC[topicKey]]: require(`./${topicKey}.avro`),
  }), {});

let schemaRegistry = null;
let kafkaClient = null;
let kafkaProducer = null;
let kafkeConsumer = null;
let offset = null;
let admin = null;

const init = async (options) => {
  const optionsConsumer = {
    kafkaHost: options.kafkaClient.kafkaHost,
    autoCommit: true,
    autoCommitIntervalMs: 5000,
    sessionTimeout: 15000,
    fromOffset: 'latest',
    outOfRangeOffset: 'earliest'
  };

  schemaRegistry = avroSchemaRegistry(options.schemaRegistry);

  kafkaClient = new kafkaNode.KafkaClient(options.kafkaClient);
  offset = new kafkaNode.Offset(kafkaClient);
  admin = new kafkaNode.Admin(kafkaClient);

  kafkaClient.on('ready', () => {
    console.log('kafka client is ready'); // logger
  });

  kafkaClient.on('error', (error) => {
    console.error(error); // logger
  });

  await (
    new Promise((resolve, reject) => {
      kafkaProducer = new kafkaNode.Producer(kafkaClient, options.kafkaProducer);
      kafkeConsumer = new kafkaNode.Consumer(kafkaClient, [{topic: TOPIC.quiz, partition: 0}], optionsConsumer);

      kafkaProducer.on('ready', () => {
        resolve();
      });

      kafkaProducer.on('error', (error) => {
        reject(error);
      });

      kafkeConsumer.on('message', (message) => {
        console.log('onmessage');
        console.log(message);
      });
    })
  );
};

const send = async (topic, messages) => {
  if (!kafkaClient) return;

  let encodedMessages;

  try {
    encodedMessages = await messages.reduce(async (acc, message) => {
      const encodedMessage = await schemaRegistry.encodeMessage(topic, SCHEMA[topic], message.value);

      return [...acc, new kafkaNode.KeyedMessage(message.key, encodedMessage)]
    }, []);
  } catch {
    return false;
  }

  kafkaProducer.send([{
    topic,
    attributes: 1,
    messages: encodedMessages,
  }], (error, result) => {
    if (error) {
      console.error('kafka error', error); // logger
    } else {
      console.log('sent to kafka'); // logger
    }
  });
};

const fetch = () => {
  // admin.listTopics((err, res) => {
  //   console.log('topics', res);
  // });
  offset = new kafkaNode.Offset(kafkaClient);
  offset.fetch([{topic: TOPIC.quiz, partition: 0}], (err, offset) => {
    console.log('offset');
    console.log(offset)
  });
}

module.exports = {
  init,
  send,
  fetch,
  TOPIC,
}
////////////////////////////////////
const fs = require('fs');
const kafka = require('./kafka');

const kafkaOptions = {
  schemaRegistry: 'http://schema-registry-sbox.epm-eco.projects.epam.com:8081',
  kafkaClient: {
    kafkaHost: 'kafka-sbox.epm-eco.projects.epam.com:9093',
    clientId: 'node-examinator-sandbox',
    requestTimeout: 3600000,
    ssl: true,
    sslOptions: {
      rejectUnauthorized: false,
      cert: [fs.readFileSync('./ssl/guest.epam.com.crt')],
      key: [fs.readFileSync('./ssl/guest.epam.com.key')],
      ca: [fs.readFileSync('./ssl/guest.epam.com.crt')],
      passphrase: '123456',
    },
  },
  kafkaProducer: {
    requireAcks: -1,
    ackTimeoutMs: 3600000,
  },
};

const send = () => {
  const id = Math.floor(Math.random() * 9) + 1;
  const quiz = {
    id: id,
    name: `quiz ${id} ${Date.now()}`,
    updated_at: Date.now()
  };

  kafka.send(kafka.TOPIC.quiz, [{key: id, value: quiz}]);
};

kafka.init(kafkaOptions)
  .then(() => {
    send();
    // setInterval(send, 10000);
    // setInterval(kafka.fetch, 5000);
  });