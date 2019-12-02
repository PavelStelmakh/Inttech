const { Kafka } = require('kafkajs')
 
const kafka = new Kafka({
  clientId: 'my-app',
  brokers: ['localhost:9092']
})
 
const producer = kafka.producer()
// const consumer = kafka.consumer()
const consumer = kafka.consumer({ groupId: 'test-group3' })
 
const run = async () => {
  // Producing
  await producer.connect()
  const a = await producer.send({
    topic: 'test',
    messages: [
      { value: 'Hello KafkaJS user!' },
    ],
  })
  console.log('sended: ', a)
 
  // Consuming
  await consumer.connect()
  await consumer.subscribe({ topic: 'test', fromBeginning: true })
 
  await consumer.run({
    eachMessage: async ({ topic, partition, message }) => {
      console.log({
        partition,
        offset: message.offset,
        value: message.value.toString(),
        topic,
      })
    },
  })
}
 
run().catch(console.error)