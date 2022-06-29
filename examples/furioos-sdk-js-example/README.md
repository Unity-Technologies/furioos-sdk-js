# Furioos SDK js example
This project is a simple nodeJS server that render a single HTML page.
It is a first step to try Furioos SDK with your links on Furioos.
It also a way to debug localy your application.

# Requirements
[node.js](http://nodejs.org/) -- v12.x or newer

# Installation
```bash
npm install
```
or
```bash
yarn
```

# Run

```bash
npm run start
```
or
```bash
yarn start
```

Here you get two things running :
1. A nodeJS server running on port 8080: To test a full JS integration of Furioos' SDK
2. A Websocket server running on port 8081: To communicate localy with your application using the [Furioos Unity SDK](https://github.com/Unity-Technologies/furioos-sdk-unity)

# How does the websocket server work ?
The Websocket server running on port 8081 is here to allow connection between this JS project running localy (or your own JS project running localy) and your application running locally too.

Both are connecting to the server to communicate.
