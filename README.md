# angular-login-broker-library

Use Login Broker (https://login.broker) to login to your app or website with facebook, google, linkedin, microsoft, apple or github. Sign up for free and get 100,000 monthly active users. No credit card required.

Please note that after the user logs in, this will produce a 'sessionId'. This must be verified on your server-side to complete the authentication.

Get a free API key here and also see the details about how to call the api to verify:
https://login.broker/account/

## Installation

```
npm install angular-login-broker-library
```

## Usage with LoginBrokerButton

This is the quickest way to make it work. It will show a button to login and includes an icon if you have Font Awesome Free version 5 available.

First, you need to include AngularLoginBrokerLibraryModule into your project's module like this.

```
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AngularLoginBrokerLibraryModule } from 'angular-login-broker-library';
import { AppComponent } from './app.component';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    AngularLoginBrokerLibraryModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
```
Next, include app-login-broker-button into component html as this.

```
<app-login-broker-button
    [tenantName]="'loginbroker'"
    [platform]="'google'"
    [onSessionReceived]="handleSessionReceived.bind(this)"
    [onErrorReceived]="handleErrorReceived.bind(this)">
  </app-login-broker-button>
  <app-login-broker-button
    [tenantName]="'loginbroker'"
    [platform]="'github'"
    [onSessionReceived]="handleSessionReceived.bind(this)"
    [onErrorReceived]="handleErrorReceived.bind(this)">
  </app-login-broker-button>
```

In component itself, you can put handlers.

```
  const handleSessionReceived = (sessionId) => {
    console.log('Received sessionId', sessionId);
    // Verify the sessionId on your server-side or API and get the logged in user email
  }

  const handleErrorReceived = (error) => {
    console.log('Error happened', error);
  }
```