import nj from 'numjs'
import axios from 'axios'
import { Image } from 'image-js'
import { randomBytes } from 'crypto'
import fs from 'fs'
import MjpegDecoder from 'mjpeg-decoder'

const post = async (instances:any) => {
  const { data } = await axios.post(`${process.env.SERVER_TF}/v1/models/default:predict`, { instances }, {
    maxContentLength: Infinity,
    maxBodyLength: Infinity
  })
  return data
}

const getDetectedObjects = async (room:any) => {
  const salt = randomBytes(4).toString('hex')
  const path = `./assets/screenshots/screenshot_${room.id}_${salt}.jpg`

  console.log(`Picking Room Id:${room.id} with url:${room.url}`)
  const decoder = new MjpegDecoder(room.url, { maxFrames: 1 })
  const frame = await decoder.takeSnapshot()

  fs.writeFileSync(path, frame)
  console.log(`Room Id:${room.id} picked: ${path}`)

  console.log(`Detecting objects with Room Id:${room.id}`)
  const detectedObjects = await detectObjects(path)

  fs.unlinkSync(path)

  return detectedObjects
}

const detectObjects = async (path:string) => {
  const image = await Image.load(path)
  const img = nj.images.read(path)

  const { predictions } = await post([img.tolist()])
  const { detection_boxes } = predictions[0]
  const dimentions = new Array()

  detection_boxes.forEach((d: any) => {
    if (d[0] > 0 || d[1] > 0 || d[2] > 0 || d[3] > 0) {
      dimentions.push(getDimentions(d[0], d[1], d[2], d[3], image.width, image.height))
    }
  })

  return dimentions
}

const getDimentions = (ymin:number, xmin:number, ymax:number, xmax:number, imgWidth:number, imgHeight:number) => ({
  left: xmin * imgWidth,
  width: xmax * imgWidth,
  top: ymin * imgHeight,
  height: imgHeight - ymax * imgHeight,
  imgWidth,
  imgHeight
})

export { getDetectedObjects }
