import shell from 'shelljs'
import mongoose from 'mongoose'
import Queue from 'bull'
import dotenv from 'dotenv'
import NRP from 'node-redis-pubsub'
import WebSocket from 'ws'
import { app } from './app'
import { Room } from './models/room'

import { getDetectedObjects } from './services/object-detection-service'
import { getMatches } from './services/dimentions-service'

const start = async () => {
  dotenv.config()
  shell.mkdir('-p', 'assets/screenshots')

  await mongoose.connect(process.env.MONGO_DB!, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true
  })
  console.log('Connected to MongoDB')

  const WebSocketServer = WebSocket.Server
  const server = new WebSocketServer({ port: 3001 })
  console.log('Listening on port 3001')

  const nrp = NRP({ url: process.env.REDIS_DB! })
  nrp.on('alerts:*', data => {
    console.log('Alert:', JSON.parse(data))
    server.clients.forEach(client => {
      client.send(data)
    })
  })

  const odQueue = new Queue('object detection', process.env.REDIS_DB!)
  odQueue.process(async ({ data }, done) => {
    const room = data
    try {
      const detectedObjects = await getDetectedObjects(room)
      const matches = getMatches(room, detectedObjects)

      matches.forEach((match:any) => {
        nrp.emit(`alerts:${match.id}`, JSON.stringify({ id: match.id, matched: match.matched }))
      })

      done()
    } catch (err) {
      console.error(`Picking Room Id:${room.id} with url:${room.url} faild`)
      throw new Error(err)
    }
  })

  app.listen(3000, () => {
    console.log('Listening on port 3000')

    setInterval(async () => {
      const rooms = await Room.find()
      rooms.forEach(async room => {
        odQueue.add(room)
      })
    }, 5000)
  })
}

start()
