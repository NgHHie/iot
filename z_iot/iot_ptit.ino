#include <Arduino.h>
#include <WiFi.h>
#include<PubSubClient.h>
#include <WiFiClientSecure.h>
#include <ArduinoJson.h>
#include<DHT.h>
#include <cmath>
#include <time.h>
// #include <WiFiUdp.h>
// #include <NTPClient.h>

#define ledGPIO 13  //define for light
#define fanGPIO 12  //define for fan
#define airConditioner 14 //define for air conditioner
#define dht11GPIO 5 // define for humidity and temperature
#define DHTTYPE DHT11
#define lightGPIO 34 // su dung de do anh sang 
const char* sensorData = "home/sensor";  // tra ve ten topic va du lieu la 0 or 1, 1 la on , 0 la off
const char* statusLight = "home/light";
const char*  statusFan =  "home/fan";
const char* statusAirConditioner =  "home/air_conditioner";
const char* statusAll = "home/all";

DHT dht(dht11GPIO, DHTTYPE);


const char *ssid = "KawaII"; // wifi name
const char* password = "dmcayvcl"; //wifi password
// WiFiUDP udp;
// NTPClient timeClient(udp, "117.122.120.80", 3600, 60000);

// config server
const char* mqtt_server = "172.20.10.3";
const  int mqtt_port = 1883;
const char* mqtt_username = "hiep";
const char* mqtt_password = "1111";


// set time use for send data to hivemmq cloud 1 minute

const unsigned long sendInterval = 3000;
unsigned long lastSend = 0;
WiFiClient espClient;
PubSubClient client(espClient);


void connect_mqtt_broker()
{
  while(!client.connected())
  {
    Serial.println("Connecting to MQTT Broker . . . . . . . .. . . . . . .. . . ");
    String clientID =  "ESPClient-";
    clientID += String(random(0xffff),HEX);
    if(client.connect(clientID.c_str(),  mqtt_username, mqtt_password))
    {
      Serial.println("Connected to MQTT Broker");
      client.subscribe(statusLight);
      client.subscribe(statusFan);
      client.subscribe(statusAirConditioner);
      client.subscribe(statusAll);
    }
    else
    {
      Serial.print("Failed with state: ");
      Serial.print(client.state());
      delay(2000);
    }
  }
}
float roundTo(float value, int decimalPlaces) {
    float factor = pow(10.0, decimalPlaces);
    return round(value * factor) / factor;
}
void publich_message_data(const char* topic)
{
    StaticJsonDocument<256> jsonDoc; // light -> fan -> air conditioner // 0 là off, 1 là on 
    jsonDoc["light"] = digitalRead(ledGPIO);
    jsonDoc["fan"] = digitalRead(fanGPIO);
    jsonDoc["air_conditioner"] = digitalRead(airConditioner);
    jsonDoc["temperature"] = roundTo(dht.readTemperature(), 2);
    jsonDoc["humidity"] = roundTo(dht.readHumidity(), 2);

    if (isnan(dht.readTemperature()) || isnan(dht.readHumidity()))
    {
        Serial.println("Failed to read from DHT sensor");
        return;
    }

    int analogValue = analogRead(lightGPIO);
    float voltage = 4095.0 - analogValue;
    jsonDoc["light_level"] = voltage;

    // Lấy thời gian hiện tại
    struct tm timeinfo;
      if (!getLocalTime(&timeinfo)) {
          Serial.println("Failed to obtain time");
          return;
      }
      char timeString[64];
      strftime(timeString, sizeof(timeString), "%Y-%m-%d %H:%M:%S", &timeinfo);
    // Thêm thời gian vào json
    jsonDoc["time"] = timeString;

    char buffer[256];
    serializeJson(jsonDoc, buffer);
    Serial.println(buffer);
    client.publish(topic, buffer);
}

void public_message_status_device(const char* topic, const char* message)
{
  StaticJsonDocument<256> jsonDoc; // light -> fan -> air conditioner // 0 là off, 1 là on 
    jsonDoc["status"] = message;

    // Lấy thời gian hiện tại
    struct tm timeinfo;
      if (!getLocalTime(&timeinfo)) {
          Serial.println("Failed to obtain time");
          return;
      }
      char timeString[64];
      strftime(timeString, sizeof(timeString), "%Y-%m-%d %H:%M:%S", &timeinfo);
    // Thêm thời gian vào json
    jsonDoc["time"] = timeString;

    char buffer[256];
    serializeJson(jsonDoc, buffer);
    Serial.println(buffer);
    client.publish(topic, buffer);
}
void call_back(char* topic, byte* payload, unsigned int length)
{
    String incoming_message = "";
    for(int i=0; i<length; i++) incoming_message += (char)payload[i];  // call_back cần sửa thêm 
     Serial.print(topic);
    
     Serial.print(" ");             // In ra một khoảng trắng để phân cách
     Serial.println(incoming_message); // In ra giá trị của incoming_message và xuống dòng

    if(strcmp(topic,statusLight)  == 0)
    { 
      // Serial.println("Light");
      if(incoming_message == "1")
        digitalWrite(ledGPIO, HIGH);
        
      else if(incoming_message == "0")
        digitalWrite(ledGPIO, LOW);
    }
    if(strcmp(topic,statusFan) == 0)
    {
      // Serial.println("fan");
      if(incoming_message == "1")
        digitalWrite(fanGPIO, HIGH);
      else if(incoming_message == "0")
        digitalWrite(fanGPIO, LOW);
        
      
    }

    if(strcmp(topic,statusAirConditioner) == 0)
    {
      // Serial.println("smart ac");
      if(incoming_message == "1")
        digitalWrite(airConditioner, HIGH);
      else if(incoming_message == "0")
        digitalWrite(airConditioner, LOW);
    }
    if(strcmp(topic,statusAll) == 0) {
      if(incoming_message == "1") {
        digitalWrite(ledGPIO, HIGH);
        digitalWrite(fanGPIO, HIGH);
        digitalWrite(airConditioner, HIGH);
      }
      
      else if(incoming_message == "0") {
        digitalWrite(ledGPIO, LOW);
        digitalWrite(fanGPIO, LOW);
        digitalWrite(airConditioner, LOW);
      }
    }

}
void set_up_wifi()
{
  Serial.begin(9600);
  delay(1000);
  WiFi.begin(ssid, password);
  Serial.println("Connecting to wifi...");
  while(WiFi.status() != WL_CONNECTED)
  {
    Serial.print(".");
    delay(1000);
  }
   Serial.println("\nConnected to the WiFi network");
   Serial.println(WiFi.localIP());
   configTime(25200, 0, "pool.ntp.org", "time.nist.gov");
}
void setup_led()
{
    pinMode(ledGPIO, OUTPUT);
    pinMode(fanGPIO, OUTPUT);
    pinMode(airConditioner, OUTPUT);
}
void setup() {
    set_up_wifi();
    setup_led();
    // espClient.setInsecure();
    client.setServer(mqtt_server, mqtt_port);
    client.setCallback(call_back);
    // timeClient.begin();
    // timeClient.setTimeOffset(25200);
}

int lastLedState = LOW;
int lastFanState = LOW;
int lastAirState = LOW;

void public_change_status() {
  int currentLedState = digitalRead(ledGPIO);  
  if (currentLedState != lastLedState) {  
      lastLedState = currentLedState;  
      public_message_status_device("light_status", currentLedState == HIGH ? "1" : "0");
  }
  int currentFanState = digitalRead(fanGPIO);  
  if (currentFanState != lastFanState) {  
      lastFanState = currentFanState;  
      public_message_status_device("fan_status", currentFanState == HIGH ? "1" : "0");
  }
  int currentAirState = digitalRead(airConditioner);  
  if (currentAirState != lastAirState) {  
      lastAirState = currentAirState;  
      public_message_status_device("air_status", currentAirState == HIGH ? "1" : "0");
  }
  if (currentLedState != lastLedState || currentFanState != lastFanState || currentAirState != lastAirState) {
    lastLedState = currentLedState; 
      lastFanState = currentFanState;  
      lastAirState = currentAirState; 
    if(currentLedState == HIGH && currentFanState == HIGH && currentAirState == HIGH) {
      
      public_message_status_device("all_status", "all : 1");
    }
    else if(currentLedState == LOW && currentFanState == LOW && currentAirState == LOW) {
      
      public_message_status_device("all_status", "all : 0");
    }
  }
}


void loop() {
    if(!client.connected())
    {
      connect_mqtt_broker();

    }
    client.loop();

    public_change_status();
    
 
   unsigned long currentMillis = millis();
   if(currentMillis - lastSend >= sendInterval)
   {
     lastSend = currentMillis;
     publich_message_data(sensorData);

    //  float temperature = dht.readTemperature();

    //  char sensorData2[10];
    //  dtostrf(temperature, 4, 1, sensorData2);  // Chuyển nhiệt độ thành chuỗi, lấy 1 chữ số thập phân

    // // Gọi hàm public_message_status_device với giá trị từ cảm biến
    //  public_message_status_device("temp", sensorData2);
   }
}