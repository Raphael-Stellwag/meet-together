# MeetTogetherClient

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 9.1.1.


## Instalation
Run ...
```
	npm install
```
to install all the dependencies. Then run ...
```
	ng serve
```
to run the application ([http://localhost:4200](http://localhost:4200)) or you can also specify the host by ...
```
	ng serve --host 0.0.0.0
```
... to make the application accessible on other devices ([http://{local-ip}:4200](http://{local-ip}:4200)) 

### crypto-js not found warning

The app still should work completly find (this error just could get to a problem when built for prod). 
You can rid of this warning by editting `node_modules/@angular-devkit/build-angular/src/angular-cli-files/models/webpack-configs/browser.js`, change `node: false` to `node: {crypto:true}`.

### Optional Configuration

You can specify a different api_base_uri in the `environment/environment.ts` files. The api_base_uri is used for the http requests as well as for the socket.io connection.


## Build for production

To build for production run:

```
	ng build --prod --base-href /meet-together/
```

and then publish to github pages by:
```
	ngh
```