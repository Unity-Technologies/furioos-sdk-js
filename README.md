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

const player = new Player({sdkShareLink}, {containerDivId});

player.onLoad(function() {
  // Here you know when the player is ready.
  player.startSession();
})
```

## Methods
### constructor(sdkShareLink, containerDivId)
Instanciate the player for a given app.
- `sdkShareLink: String`: Link of the app you want to share (ex: "https://portal.furioos.com/exemple/12345").
- `containerDivId: String`: The ID of the container div that will host the render.

### onLoad(callback)
Bind a callback that will be called when the player is ready.
- `callback: Function`: You own code to do what you want when it's ready (ex: start the stream.);

### startSession()
Launch the stream of the app.

### stopSession()
Stop the stream of the app.