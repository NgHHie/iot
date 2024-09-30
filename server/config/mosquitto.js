import mqtt, { connect } from "mqtt";
import { postDataCamBien } from "../services/cambien.services.js";
import { postDataThietBi } from "../services/thietbi.services.js";

const numOfSensor = 3;
let client;
// Thay đổi initMqtt để nhận đối tượng io
export const initMqtt = async (io) => {
  const host = "localhost";
  const port = "1883";
  const clientId = `mqtt_${Math.random().toString(16).slice(3)}`;
  const connectUrl = `mqtt://${host}:${port}`;
  client = mqtt.connect(connectUrl, {
    clientId,
    clean: true,
    connectTimeout: 4000,
    username: "hiep",
    password: "1111",
    reconnectPeriod: 1000,
  });
  const topic = [
    "home/sensor",
    "light_status",
    "fan_status",
    "air_status",
    "home/light",
    "home/fan",
    "home/air_conditioner",
  ];

  client.on("connect", () => {
    // console.log("Connected to MQTT broker");

    topic.forEach((topic) => {
      client.subscribe([topic], () => {
        // console.log(`Subscribed to topic '${topic}'`);
      });
    });
  });

  client.on("message", (topic, payload) => {
    // console.log("Message received: " + topic + " " + payload.toString());
    // console.log(typeof payload);
    if (
      topic == "light_status" ||
      topic == "fan_status" ||
      topic == "air_status"
    ) {
      const payloadjson = JSON.parse(payload.toString());
      // console.log(payloadjson);
      let tenthietbi = "";
      if (topic == "light_status") tenthietbi = "den";
      else if (topic == "fan_status") tenthietbi = "quat";
      else if (topic == "air_status") tenthietbi = "dieuhoa";
      let data = {
        TenThietBi: tenthietbi,
        TrangThai: payloadjson.status,
        ThoiGian: new Date(payloadjson.time),
      };
      data.ThoiGian.setHours(data.ThoiGian.getHours() + 7);
      console.log(data);
      postDataThietBi(data);
    } else if (topic == "home/sensor") {
      const payloadjson = JSON.parse(payload.toString());
      const time = new Date(payloadjson.time);
      time.setHours(time.getHours() + 7);
      console.log(payloadjson);
      // let data = [];
      let data = {
        NhietDo: parseFloat(payloadjson.temperature),
        DoAm: parseFloat(payloadjson.humidity),
        AnhSang: parseFloat(payloadjson.light_level),
        ThoiGian: time,
      };

      // console.log(data);
      postDataCamBien(data);
    }
    // Gửi tin nhắn qua Socket.IO
    if (io) {
      io.emit("mqttMessage", { topic, message: payload.toString() });
    }
  });
};

export const publishMqtt = async (topic, message) => {
  if (client && client.connected) {
    await client.publish(topic, message, { qos: 0, retain: false }, (error) => {
      if (error) {
        console.error(`Failed to publish to topic '${topic}':`, error);
      } else {
        console.log(`Message '${message}' published to topic '${topic}'`);
      }
    });
  } else {
    console.error("MQTT client is not connected");
    log = "MQTT client is not connected";
  }
};
