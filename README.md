# Furioos SDK
## Requirements
- A Furioos Account on www.furioos.com available from the Business plan.
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
| **`overridedURL`** | Boolean | Override the url of the server you want to communicate with | true | "https://portal.furioos.com" |
| **`debugAppMode`** | Boolean | Active local debug of your application. See [Debug localy the SDK communication tunnel](#debug-localy-the-sdk-communication-tunnel) for more detail | true | false |
| **`wsServerAddress`** | String | Set up the ip address of your websocket server. See [Debug localy the SDK communication tunnel](#debug-localy-the-sdk-communication-tunnel) for more detail | true | "127.0.0.1" |

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
Get the current setted quality. Possible values : AUTO / LOW / MEDIUM / HIGH / ULTRA

### Events
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

### Methods
#### setUserActive()
This function help you to keep the session open if your user does not interact with the interface.  
Calling this function will fire onUserActive.  
:warning: If you always call it without checking if the user is really here the session will never ended untill the user close his window.

<details>
  <summary>
    <b>setThumbnailUrl(url)</b> 
    <p>Change the thumbnail of your app.</p>
  </summary>
  
  | Property | Type | Description | DefaultValue |
  | --- | --- | --- | --- |
  | **`url`** | String | A public url of the thumbnail you want to set | null |
</details>

<details>
  <summary>
    <b>getServerAvailability(function(data) {}, function(error) {})</b> 
    <p>Call this function to get an estimated time to get a session on Furioos.</p>
  </summary>
  
  <b>data:</b>
  | Property | Type | Description | DefaultValue |
  | --- | --- | --- | --- |
  | **`assignTime`** | Number | Estimated time (minutes) to be assigned to a server | 0 |
  | **`launchTime`** | Number | Estimated time (minutes) for your app to be ready (copied, extracted and launched) | 0 |
  | **`availableMachines`** | Number | Number of ready VM waiting for a session | 0 |
  | <b>*</b>**`maximumMachines`** | Number | Maximum machines setted on your campaign | 0 |
  | <b>*</b>**`usedMachines`** | Number | Number of current used machines in your pool | 0 |
  | <b>*</b>**`creatingMachines`** | Number | Number of creating machines (creating machine in the cloud) | 0 |
  | <b>*</b>**`installingMachines`** | Number | Number of installing machine (installing your application on it) | 0 |
  
  <b>*</b> *Those values are only available for an application running on a pre-allocated campaign.*
  
  <b>Example:</b>
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
</details>

<details>
  <summary>
    <b>getServerMetadata(function(metadata) {}, function(error) {})</b> 
    <p>
      Call this function to get unique VM informations.
      This function return metadata only when a session is running.
    </p>
  </summary>
  
  <b>metadata:</b>
  | Property | Type | Description | DefaultValue |
  | --- | --- | --- | --- |
  | **`publicIP`** | String | The VM public IP. | "" |
  | **`name`** | String | A unique name to identify a VM. | "" |
  
  <b>Example:</b>
  ```javascript
    player.getServerAvailability(function(metadata) {
      console.log("Public VM IP: ", metadata.publicIP);
      console.log("VM unique name: ", metadata.name);
    }, function(error) {
      // Treat the error.
    });
  ```
</details>

<details>
  <summary>
    <b>setLocation(location)</b> 
    <p>
      Setup the default location used for each start.  
      You should set this value before the user can start the session if you use the default Furioos' start button.
    </p>
  </summary>
  
  | Property | Type | Description | DefaultValue |
  | --- | --- | --- | --- |
  | **`location`** | String | The VM public IP. | "" |
  
  <b>Example:</b>
  ```javascript
    player.setLocation(Player.regions.EUW);
  ```
</details>

<details>
  <summary>
    <b>start(location)</b> 
    <p>
      Start a new session.
    </p>
  </summary>
  
  | Property | Type | Description | DefaultValue | Optional |
  | --- | --- | --- | --- | --- |
  | **`location`** | String | The VM public IP. | "" | true |
  
  <b>Example:</b>
  ```javascript
    player.start(Player.regions.EUW);
  ```
</details>

#### stop()
Stop the session.

#### maximize()
Enable Full screen mode.

#### minimize()
Disable Full screen mode.

<details>
  <summary>
    <b>setQuality(quality)</b> 
    <p>
      Set the quality of the stream.
    </p>
  </summary>
  
  | Property | Type | Description | DefaultValue | Optional |
  | --- | --- | --- | --- | --- |
  | **`quality`** | QualityValue | Use one of the static value Player.qualityValues.AUTO / Player.qualityValues.LOW / Player.qualityValues.MEDIUM / Player.qualityValues.HIGH / Player.qualityValues.ULTRA | Furioos App Quality | false |
  
  <b>Example:</b>
  ```javascript
    player.setQuality(Player.qualityValues.ULTRA);
  ```
</details>

#### restartStream()
Restart the streaming.

### Communicate with your application
Go deeper with your UI by creating your own data interpretation.  
Those methods let you send/receive JSON data between your application and the HTML page where you have implemented the JS SDK.

#### Requirements
- The Furioos SDK implemented in your application.
  - Furioos SDK for Unity : https://github.com/Unity-Technologies/furioos-sdk-unity
  - Furioos SDK for Unreal : :star: Coming in October 2020 :wink:

<details>
  <summary>
    <b>onSDKMessage(function(data) {})</b> 
    <p>
      Bind a callback to receive messages from your application.
    </p>
  </summary>
  
  | Property | Type | Description | DefaultValue | Optional |
  | --- | --- | --- | --- | --- |
  | **`data`** | Object | The JSON that you send from your application. | null | false |
  
  <b>Example:</b>
  ```javascript
    player.onSDKMessage(function(data) {
      console.log("Message received from my application: ", data);
    });
  ```
</details>

<details>
  <summary>
    <b>sendSDKMessage(data)</b> 
    <p>
      Send data to your own application by using the Furioos SDK.
    </p>
  </summary>
  
  | Property | Type | Description | DefaultValue | Optional |
  | --- | --- | --- | --- | --- |
  | **`data`** | Object | The data you want to send to your app formated in JSON. | null | false |
  
  <b>Example:</b>
  ```javascript
    player.sendSDKMessage({ "test": "test" }); 
  ```
</details>

## Debug localy the SDK communication tunnel
:warning: This feature cannot work without **running the following project**: https://github.com/Unity-Technologies/furioos-sdk-js-example

With this project, you'll be able to communicate localy with your application through port 8081.

:warning: There will be no stream.
<p>
 This feature open a direct tunnel between your js and your application running localy.<br/>
 Only <b>sendSDKMessage</b> and <b>onSDKMessage</b> can be used here to test the communication.
</p>

#### How does it work ?
You just need to enable the **debugAppMode**.

```javascript
import { Player } from 'furioos-sdk';

const options = {
  whiteLabel: true,
  hideToolbar: false,
  hideTitle: true,
  hidePlayButton: false,
  debugAppMode: true, // This enable the local debug mode.
};

const player = new Player("123.456", "containerDivId", options);
```
## :warning: Common Errors
- *Failed to execute 'postMessage' on 'DOMWindow': The target origin (http://....) provided does not match the recipient window's origin ('http://...')*

  This error means that you do not have the correct website URL setted on your SDK link on Furioos.  
  If the url your are testing the player implementation is `http://localhost:8080`, you must have this url as website url of your SDK link on Furioos (by creating or editing one).
