import express, { Request, Response } from 'express'

import { Room } from '../models/room'
const router = express.Router()

router.post('/api/rooms', async (req:Request, res:Response) => {
  const { url, left, top, width, height, roomWidth, roomHeight } = req.body
  const room = new Room({ url, left, top, width, height, roomWidth, roomHeight })
  room.save()

  res.status(201).send(room)
})

router.get('/api/rooms', async (req:Request, res:Response) => {
  const rooms = await Room.find()
  res.status(200).send(rooms)
})

router.delete('/api/rooms/:id', async (req:Request, res:Response) => {
  const room = await Room.findByIdAndRemove(req.params.id)
  if (!room) {
    throw new Error('Room not found')
  }
  res.send(room)
})

export { router as indexRouter }
