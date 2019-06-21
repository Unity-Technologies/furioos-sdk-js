# Furioos SDK
## Requirements
You'll need a pro version subscription on your Furioos interface in order to use the SDK.
Then choose the app you want to use with the SDK and share it as SDK link.

## Installation
```npm install --save furioos-sdk```

## Exemple
You should copy past your link previously you got in your Furioos interface.
```javascript
import { Player } from 'furioos-sdk';

const player = new Player({sdkShareLink}, {containerDivId}, {options});

player.onLoad(function() {
  // Here you know when the player is ready.
  player.startSession();
})
```

## Methods
### constructor(sdkShareLink, containerDivId, options)
Instanciate the player for a given app.
- `sdkShareLink: String`: Link of the app you want to share (ex: "https://portal.furioos.com/exemple/12345").
- `containerDivId: String`: The ID of the container div that will host the render.

### onLoad(callback)
Bind a callback that will be called when the player is ready.
- `callback: Function`: Your own code to do what you want when it's ready (ex: call startSession()).

### start()
Launch the stream of the app.

### stop()
Stop the stream of the app.

### maximize()
Full screen mode enabled.

### minimize()
Full screen mode disabled.

### mouseLock(value)
Lock/unlock the mouse.
- `value: Boolean`: true to lock, false to unlock the mouse.

### quality(value)
Set the quality of the stream.
- `value: QualityValue`: Use one of the static value Player.qualityValues.LOW / Player.qualityValues.MEDIUM / Player.qualityValues.HIGH / Player.qualityValues.ULTRA

### restartApp()
Restart the application

### restartClient()
Reload all the streaming.

### sendData(data)
Send data to your own application by using the Furioos Unity SDK.
- `data: JSON`: The data you want to send to your app formated in JSON.