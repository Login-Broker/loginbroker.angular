import { Component, Input } from '@angular/core';
import { AngularLoginBrokerLibraryService } from './angular-login-broker-library.service';

@Component({
  selector: 'app-login-broker-button',
  template: `
    <button class="login-broker-button login-broker-{{ platform }}-button" (click)="startLoginProcess()">
      <i class="fab fa-{{ platform }}"></i>
      Login with {{ platform }}
    </button>
  `,
  styleUrls: ['./angular-login-broker-library.css']
})
export class AngularLoginBrokerLibraryComponent {
  @Input() tenantName!: string;
  @Input() platform!: string;
  @Input() onSessionReceived!: (sessionId: string) => void;
  @Input() onErrorReceived!: (error: string) => void;
  
  constructor(private loginBrokerService: AngularLoginBrokerLibraryService) {}

  public startLoginProcess(): void {
    this.loginBrokerService.startLoginProcess(
      this.tenantName,
      this.platform,
      this.onSessionReceived,
      this.onErrorReceived
    );
  }
}