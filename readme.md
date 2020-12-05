docker build -t object-detect --build-arg model_url=http://download.tensorflow.org/models/object_detection/ssd_resnet50_v1_fpn_shared_box_predictor_640x640_coco14_sync_2018_07_03.tar.gz .


docker run -p 8080:8080 -p 8081:8081 object-detect

//================================================

var socket = new WebSocket('ws://localhost:3001');

socket.onmessage = function (message) {
  console.log('Connection 1', message.data);
};

//================================================
Rename .env.local to .env
Field up MONGO_DB and REDIS_DB urls