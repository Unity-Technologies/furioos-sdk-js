# Furioos SDK V1
:warning: This version is deprecated and no longer available, please update it as soon as you can

## Requirements
- A Furioos Account on www.furioos.com.
- Then choose the application you want to use with the SDK and create a SDK link.


## Table of contents
* [Installation](#installation)
* [API](#api)
  * [Properties](#properties)
  * [Events](#events)
  * [Methods](#methods)
  * [Communicate with your application](#communicate-with-your-application)
* [Debug localy the SDK communication tunnel](#debug-localy-the-sdk-communication-tunnel)

## Installation
```npm install --save furioos-sdk```

## API
#### constructor(sdkShareLinkID, containerDivId, options)
Instanciate the player for a given application.
| Property | Type | Description | optional | DefaultValue |
| --- | --- | --- | --- | --- |
| **`sdkShareLinkID`** | String | Furioos SDK Link ID of the application you want to share. | false | null |
| **`containerDivId`** | String | The ID of the HTML container div that will host the render. | false | null |
| **`options`** | Object | The options to setup the player are these following : | true | {} |

##### options:
| Property | Type | Description | optional | DefaultValue |
| --- | --- | --- | --- | --- |
| **`whiteLabel`** | Boolean | Remove all Furioos' Logo | true | false |
| **`hideToolbar`** | Boolean | Hide the toolbar to create your own | true | false |
| **`hideTitle`** | Boolean | Hide the title bar to create your own | true | false |
| **`hidePlayButton`** | Boolean | Hide the play button | true | false |
| **`debugAppMode`** | Boolean | Active local debug of your application. See [Debug localy the SDK communication tunnel](#debug-localy-the-sdk-communication-tunnel) for more detail | true | false |

#### Example
```javascript
import { Player } from 'furioos-sdk';

const options = {
  whiteLabel: true,
  hideToolbar: false,
  hideTitle: true,
  hidePlayButton: false,
};

const player = new Player("123.456", "containerDivId", options);
```

### Properties
#### quality: String
Get the current setted quality. Possible values : AUTO / LOW / MEDIUM / HIGH


### Events
:warning: These events are no longer available. Please use the new .on() method.
<details>
  <summary>
    <b>onLoad(function() {})</b> 
    <p>Bind a callback that will be called when the player is ready.</p>
  </summary>

<b>Example</b>
```javascript
player.onLoad(function() {
  // Here you know when the player is ready.
  player.start();
})
```
</details>

<details>
  <summary>
    <b>onAppInstallProgress(function(data) {})</b> 
    <p>
       Bind a callback that will be called during your application installation.
       You'll receive the progress of the installation.
    </p>
  </summary>
  
  <b>data: </b>
  | Property | Type | Description | Value |
  | --- | --- | --- | --- |
  | **`status`** | String | The current installation step | "COPYING" or "DECOMPRESSING" |
  | **`progress`** | Number | The progress value | between 0 and 1 |

  <b>Example</b>
  ```javascript
  player.onAppInstallProgress(function(data) {
    // Implement your own code.
    console.log(data.status + " the application : " + Math.round(data.progress*100) + "%");
  })
  ```
</details>

<details>
  <summary>
    <b>onAppInstallSuccess(function() {})</b> 
    <p>
       Bind a callback that will be called when your application installation has succeed.
    </p>
  </summary>
  
  <b>Example</b>
  ```javascript
  player.onAppInstallSuccess(function() {
    // Implement your own code.
    console.log("My application is fully installed");
  })
  ```
</details>

<details>
  <summary>
    <b>onAppInstallFail(function() {})</b> 
    <p>
       Bind a callback that will be called when your application installation has failed.
    </p>
  </summary>
  
  <b>Example</b>
  ```javascript
  player.onAppInstallFail(function() {
    // Implement your own code.
    console.log("Installation has failed");
  })
  ```
</details>

<details>
  <summary>
    <b>onAppStart(function() {})</b> 
    <p>
       Bind a callback that will be called when your application starts.
    </p>
  </summary>
  
  <b>Example</b>
  ```javascript
  player.onAppStart(function() {
    // Implement your own code.
    console.log("Application started");
  })
  ```
</details>

<details>
  <summary>
    <b>onStreamStart(function() {})</b> 
    <p>
       Bind a callback that will be called when the stream starts.
    </p>
  </summary>
  
  <b>Example</b>
  ```javascript
  player.onStreamStart(function() {
    // Implement your own code.
    console.log("Stream started");
  })
  ```
</details>

<details>
  <summary>
    <b>onUserActive(function() {})</b> 
    <p>Bind a callback that will be called when the user is **active** on your session (only fired when a session is running).</p>
  </summary>

<b>Example</b>
```javascript
player.onUserActive(function() {
  // Implement your own code.
  console.log("My user is active");
})
```
</details>

<details>
  <summary>
    <b>onUserInactive(function() {})</b> 
    <p>Bind a callback that will be called when the user is **inactive** on your session (only fired when a session is running).</p>
  </summary>

<b>Example</b>
```javascript
player.onUserInactive(function() {
  // Implement your own code.
  console.log("My user is inactive");
})
```
</details>

<details>
  <summary>
    <b>onSessionStopped(function() {})</b> 
    <p>Bind a callback that will be called when the session is stopped (ex: stopped for inactivity).</p>
  </summary>

<b>Example</b>
```javascript
player.onSessionStopped(function() {
  // Implement your own code.
  console.log("The session has been stopped");
})
```
</details>

<details>
  <summary>
    <b>onStats(function(stats) {})</b> 
    <p>Bind a callback that will be called frequently during a running session with all stats.</p>
  </summary>
  
  <b>stats:</b>
  | Property | Type | Description | DefaultValue |
  | --- | --- | --- | --- |
  | **`appHeight`** | Number | Height of the application screen on VM | 0 |
  | **`appWidth`** | Number | Width of the application screen on VM | 0 |
  | **`dataLatency`** | Number | Round trip network latency | 0 |
  | **`dataMethod`** | String | events/data transmission method (value: "datachannel" or "ws") | "datachannel" |
  | **`packetsLost`** | Number | Percent of lost packets (value: 0 to 1) | 0 |
  | **`serverCpuUsage`** | Number | Server CPU usage | 0 |
  | **`serverEncodingMs`** | Number | Server encoding time (milliseconds) | 0 |
  | **`serverFramerate`** | Number | Server framerate | 0 |
  | **`serverGpuMemTotal`** | Number | Total GPU RAM available on server (byte) | 0 |
  | **`serverGpuMemUsed`** | Number | Current GPU RAM used on server (byte) | 0 |
  | **`serverGpuUsage`** | Number | Server GPU usage percent | 0 |
  | **`serverGrabbingMs`** | Number | Server grabbing time (milliseconds) | 0 |
  | **`serverRamTotal`** | Number | Total RAM available on serve (byte) | 0 |
  | **`serverRamUsed`** | Number | Current RAM used on server (byte) | 0 |
  | **`streamingEngine`** | String | Current streaming engine used (value: "Furioos" or "RenderStreaming") | "Furioos" |
  | **`userActive`** | Boolean | Define if the user is consider as active by the Furioos player | 0 |
  | **`videoBitrate`** | Number | Received video bitrate (kbps) | 0 |
  | **`videoFramerate`** | Number | Received video framerate | 0 |
  | **`videoHeight`** | Number | Heigh of the received video | 0 |
  | **`videoWidth`** | Number | Width of the received video | 0 |
  | **`videoLatency`** | Number | Total video latency (round trip network latency + decoding time) | 0 |


  <b>Example</b>
  ```javascript
  player.onStats(function(stats) {
    // Implement your own code.
    console.log("Stats received: ", stats);
  })
  ```
</details>