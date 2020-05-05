# Furioos SDK
## Requirements
Minimum requirements: Business subscription (or higher) on Furioos to use the SDK.
Then choose the app you want to use with the SDK and create a SDK link.

## Installation
```npm install --save furioos-sdk```

## Exemple
You should copy past the link ID previously created.
```javascript
import { Player } from 'furioos-sdk';

const player = new Player("sdkShareLinkID", "containerDivId", options);

player.onLoad(function() {
  // Here you know when the player is ready.
  player.start();
})
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

#### onLoad(callback)
Bind a callback that will be called when the player is ready.
- `callback: Function`: Your own code to do what you want when it's ready (ex: call start()).

### Methods to create your own interface
Those methods permit you to create your own interface.

#### setLocation(location)
setup the default location used for each start. 
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

### SDK Methods
To use corectly this method, you will need to use the Furioos SDK for Unity in order to received the sended data and treat it into your app.

#### onSDKMessage(callback)
Bind a callback to receive messages from your application.
- `callback: Function`: Your own code to do what you want.

#### sendSDKMessage(data)
Send data to your own application by using the Furioos SDK for Unity.
- `data: JSON`: The data you want to send to your app formated in JSON.

## SDK Local Test Exemple
SDKDebug class let you debug the SDK communication on your local setup.
Requirements: The Furioos Unity SDK on your application.
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