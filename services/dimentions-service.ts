const getPercentages = (room:any) => {
  return {
    leftPct: (room.left * 100) / room.parentWidth,
    topPct: (room.top * 100) / room.parentHeight,
    widthPct: (room.width * 100) / room.parentWidth,
    heightPct: (room.height * 100) / room.parentHeight
  }
}
const getPixels = (roomPct:any) => {
  return {
    left: (roomPct.leftPct / 100) * roomPct.parentWidth,
    top: (roomPct.topPct / 100) * roomPct.parentHeight,
    width: (roomPct.widthPct / 100) * roomPct.parentWidth,
    height: (roomPct.heightPct / 100) * roomPct.parentHeight
  }
}

const matchObjectsRoom = (x1:number, y1:number, w1:number, h1:number, x2:number, y2:number, w2:number, h2:number) => {
  // Check x and y for overlap
  if (x2 > w1 + x1 || x1 > w2 + x2 || y2 > h1 + y1 || y1 > h2 + y2) {
    return false
  }
  return true
}

const getMatches = (room:any, detectedObjects:any) => {
  const matches = new Array()

  const roomPct = getPercentages({
    left: room.left,
    top: room.top,
    width: room.width,
    height: room.height,
    parentWidth: room.roomWidth,
    parentHeight: room.roomHeight
  })

  detectedObjects.forEach((obj2:any) => {
    // convert room to pxl according to layout
    const obj1 = getPixels({
      leftPct: roomPct.leftPct,
      topPct: roomPct.topPct,
      widthPct: roomPct.widthPct,
      heightPct: roomPct.heightPct,
      parentWidth: obj2.imgWidth,
      parentHeight: obj2.imgHeight
    })

    const matched = matchObjectsRoom(obj1.left, obj1.top, obj1.width, obj1.height, obj2.left, obj2.top, obj2.width, obj2.height)

    console.log(`Room Id:${room.id} matched: ${matched ? 'yes' : 'no'}`)
    matches.push({ id: room.id, matched: matched })
  })

  return matches
}

export { getMatches }
