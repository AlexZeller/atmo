![example workflow](https://github.com/AlexZeller/atmo/actions/workflows/dockerimage.yml/badge.svg)

# atmo 

<p align="center">
  <img src="https://user-images.githubusercontent.com/34438645/112263772-25014c80-8c70-11eb-924d-1da85c137a88.png" alt="Size Limit CLI" width="90">
</p>

atmo is a selfhosted temperature and humidity monitoring system for you home. It uses standard ZigBee sensors but without the need for a commercial ZigBee hub so you can be sure where you data goes. The concept is simple: The payload of the sensors is written to a database and a REST API is implemented to serve the data via a Frontend in you local network. 

This project consists of two repositories. The [atmo](https://github.com/AlexZeller/atmo) repository and the [atmo-API](https://github.com/AlexZeller/atmo-API) repository.

## Screenshots

Dashboard             |  Menu 
:-------------------------:|:-------------------------:
![](https://user-images.githubusercontent.com/34438645/112764546-56c83980-9009-11eb-88da-9cd1bb822609.PNG)  |  ![](https://user-images.githubusercontent.com/34438645/112764540-53cd4900-9009-11eb-9690-af4bf9b7dab7.PNG) 

Sensor Details            |  Timeseries |  Settings
:-------------------------:|:-------------------------:|:-------------------------:
![](https://user-images.githubusercontent.com/34438645/112764542-562fa300-9009-11eb-805a-ba6cb225921b.PNG)  |  ![](https://user-images.githubusercontent.com/34438645/112764544-56c83980-9009-11eb-869d-44a73f080b72.PNG) |  ![](https://user-images.githubusercontent.com/34438645/112764541-54fe7600-9009-11eb-9ce7-13f7dc42f5a2.PNG)




## Motivation

I wanted to have a relatively simple (and cheap) way to monitor and log the temperature in my home. I found the Xiaomi Aqara sensors that look nice, are reasonably priced and measure temperature, humidity and air pressure. But I didn´t want to buy the Aqara Hub for several reasons. These sensors utilize the ZigBee standard to communicate and luckily there is some great open-source software with which you can easily build you own network. I then built my own Frontend as a Progressive Web App using [Vue.js](https://vuejs.org/) (more on that later) but if you have an existing Smart Home Solution like Home Assistant you can integrate the sensors there as well.

## The Frontend

I started out by making a mobile optimized website. This works fine, but I really wanted to try making a Progressive Web App (PWA). Not because I utilized all of its functionalities, but because it looks and feels like a native App. PWA´s however have a couple of requirements to work. One of them is HTTPS which made things a bit tricky. Since the Application only runs on the local network I couldn´t just use free certificates from letsencrypt. The solution is to create your own Certificate Authority (CA) and issue your own certificates that are valid on you local network. The only downside of this approach is, that you have to add the root certificate to each device you want to visit the PWA on. Thankfully you only have to do that once and it is not very complicated. [This](https://deliciousbrains.com/ssl-certificate-authority-for-local-https-development/) article is a great little guide on how to create you own CA and issue certificates. 


## What you will need

First I would recommend checking out the awesome [zigbee2mqtt](https://github.com/koenkk/zigbee2mqtt) project. It has some great documentation, a detailed guide on how to set up things and a list of supported devices. In my case I used the follwing

- A CC2531 Adapter flashed with the firmware (check out the [zigbee2mqtt](https://github.com/koenkk/zigbee2mqtt) documentation on where to get them)
- A Raspberry Pi Zero W (any other Raspberry Pi works too)
- Aqara Temperature and Humidity Sensors

## Installing

I used docker and docker compose so installation is straightforward. If you use a Raspberry Pi you can use my docker images (ARM/v6 images also work on ARM/v7 etc.). If you use any other architecture you will have to built them yourself.

In the repository there is a folder called Boilerplate which already has the necessary file/folder structure for the docker-compose example, so in case you run it on a raspberry you only have to edit the config files.

#### The hostname

I changed the hostname of my pi to atmo so it is accessible in my network at atmo.local. **This is important for the certificates to work and for the communication with the API.** You can of course choose a different hostname, but in that case you have to change the VUE_APP_ROOT_API in the .env file located in the atmo-ui folder. I also named my certificate files atmo.local.key and atmo.local.crt. Either you change that too (server.js in the atmo-API repository and server js in the atmo-server folder in this repository) or simply name your certificate files like that.

#### The certificates

First you have to generate a certificate for atmo.local (or you chosen hostname) according to [this](https://deliciousbrains.com/ssl-certificate-authority-for-local-https-development/) article. Create a folder on you pi named *certificates* and paste the atmo.local.crt and atmo.local.key files in there. 

#### The atmo-API settings.json

When adding sensors to you ZigBee network you can give them a "friendly" name. This gets utilized in the settings of atmo where the friendly name corresponds to the id in the settings.json. It is important that you add the correct number of sensors to the settings.json and that the id corresponds to the friendly name. When the atmo-API is started it listens to each sensor id and writes the broadcasted values to the datbase. The *displayName* and *icon* can be edited through the Frontend and declare the name that gets displayed for the sensor and the corresponding icon. All icons from [materialdesignicons](https://materialdesignicons.com/) can be used.

Sample settings.json for two sensors

```json
{
  "sensors": [
    {
      "id": 1,
      "displayName": "Wohnzimmer",
      "icon": "mdi-sofa"
    },
    {
      "id": 2,
      "displayName": "Badezimmer",
      "icon": "mdi-shower"
    }
  ]
}
```

### docker-compose

Here´s an example for a docker-compose file:

```yaml
version: '3'
services:
    mosquitto:
      container_name: mosquitto
      image: arm32v6/eclipse-mosquitto
      restart: always
      ports:
        - 1883:1883
        - 9001:9001
      volumes:
        - ./mosquitto/config/mosquitto.conf:/mosquitto/config/mosquitto.conf
        - ./mosquitto/log:/mosquitto/log
        - ./mosquitto/data:/mosquitto/data
    zigbee2mqtt:
      container_name: zigbee2mqtt
      image: koenkk/zigbee2mqtt
      ports:
        - 8080:8080
      volumes:
        - ./zigbee2mqtt/data:/app/data
        - /run/udev:/run/udev:ro
      devices:
        - /dev/ttyACM0:/dev/ttyACM0
      restart: always
      privileged: true
      environment:
        - TZ=Europe/Berlin
    atmo-api:
      container_name: atmo-api
      image: alexanderzeller/atmo-api:latest
      restart: always
      ports:
        - 8443:8443
      environment:
        - TZ=Europe/Berlin
      volumes:
        - ./atmo-api/settings.json:/usr/src/app/settings.json
        - ./atmo-api/db.sqlite:/usr/src/app/db.sqlite
        - ./certificates:/usr/src/app/certificates
    atmo:
      container_name: atmo
      image: alexanderzeller/atmo:latest
      restart: always
      ports:
        - 443:443
      volumes:
        - ./certificates:/usr/src/app/atmo-server/certificates 



``` 



