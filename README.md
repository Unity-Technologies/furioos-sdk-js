# Furioos SDK
## Requirements
You'll need a pro version subscription on your Furioos interface in order to use the SDK.
Then choose the app you want to use with the SDK and share it as SDK link.

## Installation
```npm install --save furioos-sdk```

## Exemple
You should copy past the link you previously got in your Furioos share interface.
```javascript
import { Player } from 'furioos-sdk';

const player = new Player({sdkShareLinkID}, {containerDivId}, {options});

player.onLoad(function() {
  // Here you know when the player is ready.
  player.start();
})
```

## Properties
#### quality: String
Get the current setted quality. Possible values : LOW / MEDIUM / HIGH / ULTRA

## Methods
#### constructor(sdkShareLinkID, containerDivId, options)
Instanciate the player for a given app.
- `sdkShareLinkID: String`: Link ID of the app you want to share (ex: "123.456").
- `containerDivId: String`: The ID of the container div that will host the render.
- `options: Object`: The options to setup the player are these following :
  - `whiteLabel: Boolean`: Remove all Furioos' Logo
  - `hideToolbar: Boolean`: Hide the toolbar to create your own.
  - `hideTitle: Boolean`: Hide the title bar to create your own.
  - `hidePlayButton: Boolean`: Hide the play button.

#### onLoad(callback)
Bind a callback that will be called when the player is ready.
- `callback: Function`: Your own code to do what you want when it's ready (ex: call startSession()).

### Methods to create your own interface
Those methods permit you to create your own interface.

#### start()
Start streaming the app.

#### stop()
Stop streaming the app.

#### maximize()
Enable Full screen mode.

#### minimize()
Disable Full screen mode.

#### mouseLock(value)
Lock/Unlock the mouse.
- `value: Boolean`: true to lock, false to unlock the mouse.

#### setQuality(value)
Set the quality of the stream.
- `value: QualityValue`: Use one of the static value Player.qualityValues.LOW / Player.qualityValues.MEDIUM / Player.qualityValues.HIGH / Player.qualityValues.ULTRA

#### restartApp()
Restart the application

#### restartClient()
Reload all the streaming.

### API Method
To use corectly this method, you will need to use the Furioos SDK for Unity in order to received the sended data and treat it into your app.

#### sendData(data)
Send data to your own application by using the Furioos SDK for Unity.
- `data: JSON`: The data you want to send to your app formated in JSON.