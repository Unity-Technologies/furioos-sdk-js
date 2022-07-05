(()=>{var e={404:(e,t,s)=>{var o=s(179);const{version:a}=s(147),n={LOAD:"load",ERROR:"error",START:"start",STOP:"stop",MAXIMIZE:"maximize",MINIMIZE:"minimize",QUALITY:"quality",RESTART_STREAM:"restartStream",RESUME_SESSION:"resumeSession",ON_RESUME_SESSION:"onResumeSession",ON_SDK_MESSAGE:"onSDKMessage",SEND_SDK_MESSAGE:"sendSDKMessage",SET_LOCATION:"setLocation",ON_USER_ACTIVE:"onUserActive",ON_USER_INACTIVE:"onUserInactive",ON_SESSION_STOPPED:"onSessionStopped",ON_STATS:"onStats",GET_SERVER_AVAILABILITY:"getServerAvailability",GET_SERVER_METADATA:"getServerMetadata",SET_THUMBNAIL_URL:"setThumbnailUrl",ON_APP_INSTALL_PROGRESS:"onAppInstallProgress",ON_APP_INSTALL_SUCCESS:"onAppInstallSuccess",ON_APP_INSTALL_FAIL:"onAppInstallFail",ON_APP_START:"onAppStart",ON_STREAM_START:"onStreamStart",SET_VOLUME:"setVolume",ON_CRASH_APP:"appStop"},i=864e5,r={AUTO:0,LOW:1,MEDIUM:2,HIGH:3,ULTRA:4},l={AUTO:0,LOW:360,MEDIUM:720,HIGH:1080},d={EUW:[52.1326,5.2913],USW:[47.751076,-120.740135],USE:[37.926868,-78.024902],AUE:[-33.865143,151.2099]};let c="https://portal.furioos.com";const S=a;e.exports={Player:class{static get qualityValues(){return r}static get fsQualityValues(){return l}static get regions(){return d}constructor(e,t,s){if(!function(e,t,s){return!(!e||"string"!=typeof e||!t||"string"!=typeof t)}(e,t))throw"Bad parameters";this.isRestartStream=!1,this.canResumeSession=!1,e.indexOf("?")>0&&(e=e.split("?")[0]),s.overridedURL&&(c=s.overridedURL),this._quality=l.HIGH,e=c+"/embed/"+e;let a=!1;if(s){let n="?";if(s.whiteLabel&&(e+=n+"whiteLabel=true",n="&"),s.hideToolbar&&(e+=n+"hideToolbar=true",n="&"),s.hideTitle&&(e+=n+"hideTitle=true",n="&"),s.hidePlayButton&&(e+=n+"hidePlayButton=true",n="&"),s.inactiveTimeout){let t=s.inactiveTimeout;s.inactiveTimeout<1e4&&(t=1e4),s.inactiveTimeout>i&&(t=i),e+=n+"inactiveTimeout="+t/1e3,n="&"}if(s.debugAppMode){a=!0,document.getElementById(t).innerText="You are currently debugging locally your app. There is not stream here. Open console to see logs";const e=s.wsServerAddress?s.wsServerAddress+":8081":"127.0.0.1:8081";this.sdkDebug=new o(e),this.sdkDebug.onReady=()=>{this.loaded=!0,this._onLoadCallback&&this._onLoadCallback()},this.sdkDebug.onSDKMessage((e=>{this._onSDKMessageCallback&&this._onSDKMessageCallback(e)}))}}this.loaded=!1,this.debugAppMode=a,this.sharedLink=e,this.containerId=t,this.options=s,a||(this.embed=this._createIframe())}_createIframe(){const e=document.getElementById(this.containerId);if(!e)throw"Cannot find the container";const t=document.createElement("iframe");return t.setAttribute("src",this.sharedLink),t.setAttribute("id","furioos-sdk-iframe"),t.setAttribute("allow","autoplay; fullscreen"),t.style.width="100%",t.style.height="100%",e.appendChild(t),t.onload=this._onLoad.bind(this),t}_displayErrorMessage(e){const t=document.getElementById(this.containerId),s=document.createElement("div");s.innerText=e,t.innerHTML="",t.appendChild(s)}_onLoad(){window.addEventListener("message",(e=>{switch(e.data.type){case n.LOAD:return this.location&&(this.embed.contentWindow?this.embed.contentWindow.postMessage({type:n.SET_LOCATION,value:this.location},c):setTimeout((()=>{this.embed.contentWindow.postMessage({type:n.SET_LOCATION,value:this.location},c)}),100)),this.loaded=!0,this.embed.contentWindow.postMessage({type:"SET_VERSION",value:S},c),void(this._onLoadCallback&&this._onLoadCallback());case n.ON_SDK_MESSAGE:return void(this._onSDKMessageCallback&&this._onSDKMessageCallback(e.data.value));case n.ON_USER_ACTIVE:return void(this._onUserActiveCallback&&this._onUserActiveCallback());case n.ON_USER_INACTIVE:return void(this._onUserInactiveCallback&&this._onUserInactiveCallback());case n.ON_APP_INSTALL_PROGRESS:return void(this._onAppInstallProgress&&this._onAppInstallProgress(e.data.value));case n.ON_APP_INSTALL_SUCCESS:return void(this._onAppInstallSuccess&&this._onAppInstallSuccess());case n.ON_APP_INSTALL_FAIL:return void(this._onAppInstallFail&&this._onAppInstallFail());case n.ON_APP_START:return void(this._onAppStart&&this._onAppStart());case n.ON_STREAM_START:return void(this._onStreamStart&&(this.isRestartStream=!1,this._onStreamStart()));case n.ON_SESSION_STOPPED:return void(this._onSessionStoppedCallback&&this._onSessionStoppedCallback());case n.ON_STATS:return void(this._onStatsCallback&&this._onStatsCallback(JSON.parse(e.data.value)));case n.GET_SERVER_AVAILABILITY:const t=e.data.value;return t.error?(console.log("Error getting server availability",t.error),void(this._getServerAvailabilityErrorCallback&&this._getServerAvailabilityErrorCallback(t.error))):this._getServerAvailabilityCallback?void this._getServerAvailabilityCallback(t.stats):void console.log("No success callback binded !");case n.GET_SERVER_METADATA:const s=e.data.value;return s.error?(console.log("Error getting server metadata",s.error),void(this._getServerMetadataErrorCallback&&this._getServerMetadataErrorCallback(s.error))):this._getServerMetadataCallback?void this._getServerMetadataCallback(s.metadata):void console.log("No success callback binded !");case n.ERROR:return void this._displayErrorMessage(e.data.value);case n.ON_CRASH_APP:return void(this._onAppStop&&this._onAppStop(e.data.value));case n.ON_RESUME_SESSION:return void(this._onResumeSession&&(this.canResumeSession=e.data.value,this._onResumeSession({canResumeSession:e.data.value})))}}))}on(e,t){switch(e){case n.LOAD:return void(this._onLoadCallback=t);case n.ON_APP_INSTALL_PROGRESS:return void(this._onAppInstallProgress=t);case n.ON_APP_INSTALL_SUCCESS:return void(this._onAppInstallSuccess=t);case n.ON_APP_INSTALL_FAIL:return void(this._onAppInstallFail=t);case n.ON_APP_START:return void(this._onAppStart=t);case n.ON_STREAM_START:return void(this._onStreamStart=t);case n.ON_SESSION_STOPPED:return void(this._onSessionStoppedCallback=t);case n.ON_STATS:return void(this._onStatsCallback=t);case n.ON_USER_INACTIVE:return void(this._onUserInactiveCallback=t);case n.ON_USER_ACTIVE:return void(this._onUserActiveCallback=t);case n.ON_SDK_MESSAGE:return void(this._onSDKMessageCallback=t);case n.ON_CRASH_APP:return void(this._onAppStop=t);case n.ON_RESUME_SESSION:return void(this._onResumeSession=t)}}setDefaultLocation(e){this.location=e,this.loaded&&(this.debugAppMode?console.log("No setDefaultLocation in debug mode"):this.embed.contentWindow.postMessage({type:n.SET_LOCATION,value:this.location},c))}start(e){e||(e=this.location),this.loaded&&(this.debugAppMode?console.log("No start in debug mode"):this.embed.contentWindow.postMessage({type:n.START,value:e},c))}stop(){this.loaded&&(this.debugAppMode?console.log("No stop in debug mode"):this.embed.contentWindow.postMessage({type:n.STOP},c))}maximize(){this.loaded&&(this.debugAppMode?console.log("No maximize in debug mode"):this.embed.contentWindow.postMessage({type:n.MAXIMIZE},c))}minimize(){this.loaded&&(this.debugAppMode?console.log("No minimize in debug mode"):this.embed.contentWindow.postMessage({type:n.MINIMIZE},c))}get quality(){switch(this._quality){case r.AUTO:case l.AUTO:return"AUTO";case r.LOW:case l.LOW:return"LOW";case r.MEDIUM:case l.MEDIUM:return"MEDIUM";case r.HIGH:case l.HIGH:case r.ULTRA:return"HIGH"}}setQuality(e){if(e!==r.LOW&&e!==r.MEDIUM&&e!==r.HIGH&&e!==r.ULTRA&&e!==r.AUTO&&e!==l.AUTO&&e!==l.LOW&&e!==l.MEDIUM&&e!==l.HIGH)throw"Bad parameter: The quality should be one of the given value in Player.qualityValues";if(!this.loaded)return;if(this.debugAppMode)return void console.log("No setQuality in debug mode");let t=e;t===r.LOW&&(console.warn("DEPRECATED: This quality constants is depreciated and will not be maintained for long. Update your sdk and use the new quality values: FS_QUALITY_VALUES"),t=l.LOW),t===r.MEDIUM&&(console.warn("DEPRECATED: This quality constants is depreciated and will not be maintained for long. Update your sdk and use the new quality values: FS_QUALITY_VALUES"),t=l.MEDIUM),t!==r.HIGH&&t!==r.ULTRA||(console.warn("DEPRECATED: This quality constants is depreciated and will not be maintained for long. Update your sdk and use the new quality values: FS_QUALITY_VALUES"),t=l.HIGH),this._quality=t,this.embed.contentWindow.postMessage({type:n.QUALITY,value:t},c)}restartStream(){this.loaded&&(this.debugAppMode?console.log("No restartStream in debug mode"):this.isRestartStream?console.warn("Stream is already restarting"):(this.embed.contentWindow.postMessage({type:n.RESTART_STREAM},c),this.isRestartStream=!0))}resumeSession(){this.loaded&&(this.debugAppMode?console.log("No resumeSession in debug mode"):this.canResumeSession?this.embed.contentWindow.postMessage({type:n.RESUME_SESSION},c):console.warn("No active session"))}sendSDKMessage(e){this.loaded&&("object"==typeof e&&(e=JSON.stringify(e)),this.debugAppMode?this.sdkDebug.sendSDKMessage(e):this.embed.contentWindow.postMessage({type:n.SEND_SDK_MESSAGE,value:e},c))}setUserActive(){this.sendSDKMessage({userActive:!0})}setThumbnailUrl(e){this.loaded&&(this.debugAppMode?console.log("No setThumbnailUrl in debug mode"):this.embed.contentWindow.postMessage({type:n.SET_THUMBNAIL_URL,value:e},c))}getServerAvailability(e,t){this.loaded&&(this.debugAppMode?console.log("No getServerAvailability in debug mode"):(this._getServerAvailabilityCallback=e,this._getServerAvailabilityErrorCallback=t,this.embed.contentWindow.postMessage({type:n.GET_SERVER_AVAILABILITY},c)))}getServerMetadata(e,t){this.loaded&&(this.debugAppMode?console.log("No getServerMetadata in debug mode"):(this._getServerMetadataCallback=e,this._getServerMetadataErrorCallback=t,this.embed.contentWindow.postMessage({type:n.GET_SERVER_METADATA},c)))}setVolume(e,t){this.loaded&&(this.debugAppMode?console.log("No setVolume in debug mode"):(this._setVolume=t,this.embed.contentWindow.postMessage({type:n.SET_VOLUME,value:e},c)))}onLoad(e){this._onLoadCallback=e,console.warn("DEPRECATED: OnLoad is deprecated and will not be maintained for long. Use the new .on() method to subscribe to events")}onUserInactive(e){this._onUserInactiveCallback=e,console.warn("DEPRECATED: onUserInactive is deprecated and will not be maintained for long. Use the new .on() method to subscribe to events")}onAppInstallProgress(e){this._onAppInstallProgress=e,console.warn("DEPRECATED: onAppInstallProgress is deprecated and will not be maintained for long. Use the new .on() method to subscribe to events")}onAppInstallSuccess(e){this._onAppInstallSuccess=e,console.warn("DEPRECATED: onAppInstallSuccess is deprecated and will not be maintained for long. Use the new .on() method to subscribe to events")}onAppInstallFail(e){this._onAppInstallFail=e,console.warn("DEPRECATED: onAppInstallFail is deprecated and will not be maintained for long. Use the new .on() method to subscribe to events")}onAppStart(e){this._onAppStart=e,console.warn("DEPRECATED: onAppStart is deprecated and will not be maintained for long. Use the new .on() method to subscribe to events")}onStreamStart(e){this._onStreamStart=e,console.warn("DEPRECATED: onStreamStart is deprecated and will not be maintained for long. Use the new .on() method to subscribe to events")}onSessionStopped(e){this._onSessionStoppedCallback=e,console.warn("DEPRECATED: onSessionStopped is deprecated and will not be maintained for long. Use the new .on() method to subscribe to events")}onStats(e){this._onStatsCallback=e,console.warn("DEPRECATED: onStats is deprecated and will not be maintained for long. Use the new .on() method to subscribe to events")}onSDKMessage(e){this._onSDKMessageCallback=e,console.warn("DEPRECATED: onSDKMessage is deprecated and will not be maintained for long. Use the new .on() method to subscribe to events")}onUserActive(e){this._onUserActiveCallback=e,console.warn("DEPRECATED: onUserActive is deprecated and will not be maintained for long. Use the new .on() method to subscribe to events")}},FS_SDK_EVENTS_NAME:n,FS_QUALITY_VALUES:l,FS_REGIONS:d,QUALITY_VALUES:r}},179:e=>{e.exports=class{constructor(e){if(!e)throw"Bad parameters";this.ws=new WebSocket("ws://"+e),this.ws.binaryType="arraybuffer",this.ws.onerror=e=>{this._wsOnError(e)},this.ws.onclose=e=>{this._wsOnClose(e)},this.ws.onmessage=e=>{this._wsOnMessage(e)},this.ws.onopen=()=>{console.log("WS connected to: ",e),this.onReady&&this.onReady()}}_wsOnError(e){console.error("WS Error",e)}_wsOnClose(e){console.error("WS Close",e)}_wsOnMessage(e){const t=JSON.parse(e.data);if("furioos"==t.type&&"sdk"==t.task){const e="string"==typeof t.data?t.data:JSON.parse(t.data);this._onSDKMessageCallback(e)}}_wsOnSendError(e){console.error("WS send error",e)}onSDKMessage(e){this._onSDKMessageCallback=e}sendSDKMessage(e){if(!this.ws||this.ws.readyState!=WebSocket.OPEN)return void console.log("Cannot send message, ws connection not open");const t={type:"furioos",task:"sdk",data:e};this.ws.send(JSON.stringify(t),this._wsOnSendError)}}},10:(e,t,s)=>{const{Player:o,FS_QUALITY_VALUES:a,FS_SDK_EVENTS_NAME:n,FS_REGIONS:i,QUALITY_VALUES:r}=s(404);e.exports={Player:o,FS_SDK_EVENTS_NAME:n,FS_QUALITY_VALUES:a,FS_REGIONS:i,QUALITY_VALUES:r},window.furioos={Player:o,FS_SDK_EVENTS_NAME:n,FS_QUALITY_VALUES:a,FS_REGIONS:i,QUALITY_VALUES:r}},147:e=>{"use strict";e.exports=JSON.parse('{"name":"furioos-sdk","version":"2.0.0","description":"Furioos SDK: create your own furioos UI communicating with your application","main":"index.js","scripts":{"test":"echo \\"Error: no test specified\\" && exit 1","build":"webpack ./index.js --output-filename=furioos.bundle.js --mode=production"},"repository":{"type":"git","url":"git+https://github.com/Unity-Technologies/furioos-sdk-js"},"author":"Furioos LTD","license":"MIT","bugs":{"url":"https://github.com/Unity-Technologies/furioos-sdk-js/issues"},"homepage":"https://github.com/Unity-Technologies/furioos-sdk-js#readme","devDependencies":{"webpack":"^5.73.0","webpack-cli":"^4.10.0"}}')}},t={};!function s(o){var a=t[o];if(void 0!==a)return a.exports;var n=t[o]={exports:{}};return e[o](n,n.exports,s),n.exports}(10)})();