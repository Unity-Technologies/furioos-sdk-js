# Furioos SDK
## Requirements
- Business subscription (or higher) on Furioos to use the SDK.
- Then choose the app you want to use with the SDK and create a SDK link.

## Installation
```npm install --save furioos-sdk```

## Example
You should copy past the link ID previously created.
```javascript
import { Player } from 'furioos-sdk';

const options = {
  whiteLabel: true,
  hideToolbar: false,
  hideTitle: true,
  hidePlayButton: false,
  overridedURL: "http://localhost:8080"
};

const player = new Player("123.456", "containerDivId", options);
```

## Properties
#### quality: String
Get the current setted quality. Possible values : AUTO / LOW / MEDIUM / HIGH / ULTRA

## Methods
#### constructor(sdkShareLinkID, containerDivId, options)
Instanciate the player for a given app.
- `sdkShareLinkID: String`: Link ID of the app you want to share (ex: "123.456").
- `containerDivId: String`: The ID of the HTML container div that will host the render.
- `options: Object`: The options to setup the player are these following :
  - `whiteLabel: Boolean`: Remove all Furioos' Logo
  - `hideToolbar: Boolean`: Hide the toolbar to create your own.
  - `hideTitle: Boolean`: Hide the title bar to create your own.
  - `hidePlayButton: Boolean`: Hide the play button.
  - `overridedURL: String`: Override the url of the server you want to communicate with.

#### onLoad(function() {})
Bind a callback that will be called when the player is ready.
##### Example
```
player.onLoad(function() {
  // Here you know when the player is ready.
  player.start();
})
```

#### onUserActive(function() {})
Bind a callback that will be called when the user is active on your session (only fired when a session is running).
##### Example
```
player.onUserActive(function() {
  // Implement your own code.
  console.log("My user is active");
})
```

#### onUserInactive(function() {})
Bind a callback that will be called when the user is inactive on your session (only fired when a session is running).
##### Example
```
player.onUserInactive(function() {
  // Implement your own code.
  console.log("My user is inactive");
})
```

#### onSessionStopped(function() {})
Bind a callback that will be called when the session is stopped (ex: stopped for inactivity).
##### Example
```
player.onSessionStopped(function() {
  // Implement your own code.
  console.log("The session has been stopped");
})
```

#### onStats(function(stats) {})
Bind a callback that will be called frequently during a running session with all stats  
`stats: Object`:
- `appHeight: Number` Height of the application screen on VM
- `appWidth: Number` Width of the application screen on VM
- `dataLatency: Number` Round trip network latency
- `dataMethod: String` events/data transmission method (value: "datachannel" or "ws")
- `packetsLost: Number` Percent of lost packets (value: 0 to 1)
- `serverCpuUsage: Number` Server CPU usage
- `serverEncodingMs: Number` Server encoding time (milliseconds)
- `serverFramerate: Number` Server framerate
- `serverGpuMemTotal: Number` Total GPU RAM available on server (byte)
- `serverGpuMemUsed: Number` Current GPU RAM used on server (byte) 
- `serverGpuUsage: Number` Server GPU usage percent
- `serverGrabbingMs: Number` Server grabbing time (milliseconds)
- `serverRamTotal: Number` Total RAM available on serve (byte)
- `serverRamUsed: Number` Current RAM used on server (byte) 
- `streamingEngine: String` Current streaming engine used (value: "Furioos" or "RenderStreaming")
- `userActive: Boolean` Define if the user is consider as active by the Furioos player
- `videoBitrate: Number` Received video bitrate (kbps)
- `videoFramerate: Number` Received video framerate
- `videoHeight: Number` Heigh of the received video
- `videoWidth: Number` Width of the received video
- `videoLatency: Number` Total video latency (round trip network latency + decoding time)
##### Example
```
player.onStats(function(stats) {
  // Implement your own code.
  console.log("Stats received: ", stats);
})
```

#### setUserActive()
This function help you to keep the session open if your user does not interact with the interface.  
Calling this function will fire onUserActive.  
Caution: If you always call it without checking if the user is really here the session will never ended untill the user close his window.

#### getServerAvailability(function(stats) {}, function(error) {}) asynchronous function
Call this function to get an estimated time to get a session on Furioos.  
`stats: Object`:
- `assignTime: Number` Estimated time (minutes) to be assigned to a server
- `launchTime: Number` Estimated time (minutes) for your app to be ready (copied, extracted and launched)
- `availableMachines: Number` Number of ready VM waiting for a session
##### Example:
```javascript
player.getServerAvailability(function(data) {
  console.log("Time to assign a server: ", data.assignTime);
  console.log("Time to copy, extract and launch your application: ", data.launchTime);
  console.log("Number of machines ready for a session: ", data.availableMachines);
  console.log("Total time to get session ready: ", data.assignTime + data.launchTime);
}, function(error) {
  // Treat the error.
});
```

#### getServerMetadata(function(metadata) {}, function(error) {}) asynchronous function
Call this function to get unique VM informations.
This function return metadata only when a session is running.
`metadata: Object`:
- `publicIP: String` The VM public IP.
- `name: String` A unique name to identify a VM.
##### Example:
```javascript
player.getServerAvailability(function(metadata) {
  console.log("Public VM IP: ", metadata.publicIP);
  console.log("VM unique name: ", metadata.name);
}, function(error) {
  // Treat the error.
});
```

### Methods to create your own interface
Those methods let you create your own interface.

#### setLocation(location)
Setup the default location used for each start.  
You should set this value before the user can start the session if you use the default Furioos' start button.
- `location: Region`: Use one of the static value : Player.regions.EUW / Player.regions.USE / Player.regions.USW / Player.regions.AUE

#### start(location)
Start a new session.
- `location: Region`: Use one of the static value : Player.regions.EUW / Player.regions.USE / Player.regions.USW / Player.regions.AUE

#### stop()
Stop the session.

#### maximize()
Enable Full screen mode.

#### minimize()
Disable Full screen mode.

#### setQuality(value)
Set the quality of the stream.
- `value: QualityValue`: Use one of the static value Player.qualityValues.AUTO / Player.qualityValues.LOW / Player.qualityValues.MEDIUM / Player.qualityValues.HIGH / Player.qualityValues.ULTRA

#### restartStream()
Restart the streaming.

### Methods to communicate with your app
Go deeper with your UI by creating your own data interpretation.  
Those methods let you send/receive JSON data between your application and the HTML page where you have implemented the JS SDK.
#### Requirements
- The Furioos SDK implemented in your application.
  - Furioos SDK for Unity : https://github.com/Unity-Technologies/furioos-sdk-unity
  - Furioos SDK for Unreal : :star: Coming soon :wink:

#### onSDKMessage(function(data) {})
Bind a callback to receive messages from your application.
- `data: Object`: The JSON that you send from your application.
##### Example:
```javascript
player.onSDKMessage(function(data) {
  console.log("Message received from my application: ", data);
});
```

#### sendSDKMessage(data)
Send data to your own application by using the Furioos SDK.
- `data: JSON`: The data you want to send to your app formated in JSON.
##### Example:
```javascript
const data = { test: "test" }
// The JSON will be sent to your application and you need to implement its interpretation
player.sendSDKMessage(data); 
```

## SDK Local Test Example (Coming soon !)
SDKDebug class let you debug the SDK communication on your local setup (Requirements: The Furioos SDK implemented in your application).  
:warning: This feature is in development and should not be used yet.
```javascript
import { SDKDebug } from 'furioos-sdk';

const sdkDebug = new SDKDebug("127.0.0.1:3000");

sdkDebug.onReady(function() {
  // Here you know when the WS connection with your application is ready.
  sdkDebug.sendSDKMessage({ test: "test" });
});

sdkDebug.onSDKMessage(function(data) {
  // Here you can manage the received data.
  console.log("Received JSON", data);
})
```
## :warning: Common Errors
- *Failed to execute 'postMessage' on 'DOMWindow': The target origin (http://....) provided does not match the recipient window's origin ('http://...')*

  This error means that you do not have the correct website URL setted on your SDK link on Furioos.  
  If the url your are testing the player implementation is `http://localhost:8080`, you must have this url as website url of your SDK link on Furioos (by creating or editing one).
