import mongoose from 'mongoose'
const { Schema } = mongoose

interface RoomAttrs {
    url: string;
    left: number;
    top: number;
    width: number;
    height: number;
    roomWidth: number;
    roomHeight: number;
}

interface RoomDoc extends mongoose.Document{
    url: string;
    left: number;
    top: number;
    width: number;
    height: number;
    roomWidth: number;
    roomHeight: number;
}

interface RoomModel extends mongoose.Model<RoomDoc>{
    build(attrs: RoomAttrs): RoomDoc;
}

const roomSchema = new mongoose.Schema({
  url: { type: String },
  left: { type: Number },
  top: { type: Number },
  width: { type: Number },
  height: { type: Number },
  roomWidth: { type: Number },
  roomHeight: { type: Number }
}, {
  toJSON: {
    transform (doc, ret) {
      ret.id = ret._id
      delete ret._id
    }
  }
})

roomSchema.statics.build = (attrs: RoomAttrs) => {
  return new Room(attrs)
}

const Room = mongoose.model<RoomDoc, RoomModel>('Room', roomSchema)

export { Room }
