import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { AngularLoginBrokerLibraryComponent } from './angular-login-broker-library.component';
import { AngularLoginBrokerLibraryService } from './angular-login-broker-library.service';

@NgModule({
  declarations: [
    AngularLoginBrokerLibraryComponent
  ],
  imports: [
    BrowserModule, HttpClientModule
  ],
  providers: [
    AngularLoginBrokerLibraryService
  ],
  exports: [
    AngularLoginBrokerLibraryComponent
  ]
})
export class AngularLoginBrokerLibraryModule { }
