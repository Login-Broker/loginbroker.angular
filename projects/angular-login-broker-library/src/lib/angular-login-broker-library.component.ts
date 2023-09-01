import { Component, Input } from '@angular/core';
import { AngularLoginBrokerLibraryService } from './angular-login-broker-library.service';

@Component({
  selector: 'lib-angular-login-broker-library',
  template: `
    <button (click)="startLoginProcess()">Login with {{ platform }}</button>
  `,
  styles: [
  ]
})
export class AngularLoginBrokerLibraryComponent {
  @Input()
  platform!: string;
  @Input()
  tenantName!: string;

  constructor(private loginBrokerService: AngularLoginBrokerLibraryService) {}

  startLoginProcess() {
    this.loginBrokerService
      .startLoginProcess(this.tenantName, this.platform)
      .subscribe(
        (result) => {
          if (result === 'completed') {
            // Handle session completed
          } else if (result === 'failed') {
            console.log('Login failed. Try again');
            // Handle login failure
          } else {
            console.log('Session not yet available');
            // Handle other cases
          }
        },
        (error) => {
          console.error(error);
          // Handle errors
        }
      );
  }
}
