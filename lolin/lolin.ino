#include <Arduino.h>
#include <ESP8266WiFi.h>
#include <WiFiClient.h>

int outputpin= A0;

// SSID and Password del router WiFi
#define ssid  "labinformatica"
#define password  "78945612311"

// ID della stanza
#define stanza 1

// IP e porta del server
const uint16_t port = 8080;
const char *host = "192.168.0.111";
WiFiClient client;
void setup()
{
    // Setup serial e connessione WiFi
    Serial.begin(115200);
    Serial.println("Connecting...\n");
    WiFi.mode(WIFI_STA);
    WiFi.begin(ssid,password); // change it to your ussid and password
    while (WiFi.status() != WL_CONNECTED)
    {
        delay(500);
        Serial.print(".");
    }
}

void loop()
{
    // Controllo connessione WiFi
    if (!client.connect(host, port))
    {
        Serial.println("Connection to host failed");
        delay(1000);
        return;
    }
    Serial.println("Sending: ");

    // Lettura temperatura
    int analogValue = analogRead(outputpin);
    float millivolts = (analogValue/1024.0) * 3300; //3300 is the voltage provided by NodeMCU
    float celsius = millivolts/10-7;
    Serial.print("in DegreeC=   ");
    Serial.println(celsius);

    // Invio dati al server
    String data = String(celsius);
    
    client.println(String(stanza) + " " + String(celsius));     // Send data
    delay(250);
    while (client.available() > 0)
    {
        char c = client.read();
        Serial.write(c);
    }
    Serial.print('\n');
    client.stop();
    delay(5000);
}