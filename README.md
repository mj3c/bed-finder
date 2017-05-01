# BedFinder
Hybrid application developed for the 'Mobile systems and services' course using Ionic. Its used for storing information about places that offer hospitality.

## Prerequisites
+ **npm** - you can get it along with [node.js](https://nodejs.org/en/download/)

+ **ionic/cordova** - `npm install -g cordova ionic`

## Install
After cloning, run `npm install` inside the main directory to install all the packages (it can take a few minutes).
After that, run `cordova prepare` to install the Android platform and required plugins.

You can also run `cordova platform add ios` if you want to run the app on an ios device or simulator.

To run the app on your own device, connect it via USB and allow USB debugging, 
then run `ionic run android --device`.

To run the app on a running android emulator use `ionic run android --emulator`.
