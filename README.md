# Introduction
This project is a demo about how multiple services interact with each other using a message queue (in this project I have used RabbitMQ).
# Description
My demo is based on a practical usecase in delivery app that after an user order goods and a shipper receive shipping orders, the user can track location of the shipper on the map and receive notification when shipper reach certain distance.

Here is an image describe architecture of my demo:
![Architecture](images/architecture.png) 

* The shipper service will interact with shipper delivery app client, get position of shipper and send it to two message queues.

* Render service get messages from render queue, process message send data to user app client to render shipper position on the map.

* Notify service get messages from notify queue, process message and send data to user app client wheneven shipper have reached certain distance to user.

# Installation

## Using docker 
```
git clone https://github.com/lvdthieu/rabbitmq-demo.git
cd rabbitmq-demo/my-app
npm install
npm start
cd ..
docker compose up
```

## Normal install

* Step 1: Install rabbitmq-server (and make sure it running)
* Step 2: Clone repository
* Step 3: Modify 3 files (notify.js, render.js, shipper.js): ```amqp://guest:guest@rabbitmq:5672/``` => ```amqp://localhost```
* Step 4: Install packages in my-app and services folder by using ```npm install```
* Step 5: Run command ```npm start``` in two folders my-app and services

# Notes

Because this a just a small demo for my Software Architecture course at VNU-UET, the app is much simple but by the way, it's enough to illustrate how rabbitmq work.
